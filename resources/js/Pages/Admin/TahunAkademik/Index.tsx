import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface TahunAkademikData {
    id: number;
    tahun: string;
    is_active: boolean;
    label: string;
}

interface Props {
    tahunAkademikList: TahunAkademikData[];
}

export default function Index({ tahunAkademikList }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setProcessing(true);
        router.delete(route('admin.tahun-akademik.destroy', deleteId), {
            onFinish: () => {
                setProcessing(false);
                setDeleteId(null);
            },
        });
    };

    const handleToggle = (id: number) => {
        router.patch(route('admin.tahun-akademik.toggle-active', id));
    };

    return (
        <AppLayout>
            <Head title="Tahun Akademik" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Tahun Akademik</h1>
                    <Button onClick={() => router.visit(route('admin.tahun-akademik.create'))}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Tahun Akademik
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kode</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tahunAkademikList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        Belum ada data tahun akademik.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tahunAkademikList.map((ta) => (
                                    <TableRow key={ta.id}>
                                        <TableCell className="font-medium">{ta.tahun}</TableCell>
                                        <TableCell>{ta.label}</TableCell>
                                        <TableCell>
                                            <Badge variant={ta.is_active ? 'default' : 'outline'}>
                                                {ta.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleToggle(ta.id)}
                                                    title={ta.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    {ta.is_active ? (
                                                        <ToggleRight className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => router.visit(route('admin.tahun-akademik.edit', ta.id))}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => setDeleteId(ta.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <ConfirmDialog
                    open={deleteId !== null}
                    onOpenChange={() => setDeleteId(null)}
                    title="Hapus Tahun Akademik"
                    description="Apakah Anda yakin ingin menghapus tahun akademik ini?"
                    onConfirm={handleDelete}
                    processing={processing}
                />
            </div>
        </AppLayout>
    );
}
