import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Jam } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, FileUp } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props extends Record<string, unknown> {
    jam: {
        data: Jam[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
}

export default function Index({ jam }: PageProps<Props>) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setProcessing(true);
        router.delete(route('admin.jam.destroy', deleteId), {
            onFinish: () => {
                setProcessing(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Data Jam" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Data Jam</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.visit(route('admin.jam.bulk.create'))}>
                            <FileUp className="mr-2 h-4 w-4" /> Tambah Banyak
                        </Button>
                        <Button onClick={() => router.visit(route('admin.jam.create'))}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Jam
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Jam Mulai</TableHead>
                                <TableHead>Jam Selesai</TableHead>
                                <TableHead>Range</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jam.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        Tidak ada data jam.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                jam.data.map((j) => (
                                    <TableRow key={j.id}>
                                        <TableCell className="font-medium">{j.jam_mulai}</TableCell>
                                        <TableCell>{j.jam_selesai}</TableCell>
                                        <TableCell>{j.jam_mulai} - {j.jam_selesai}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon-sm" onClick={() => router.visit(route('admin.jam.edit', j.id))}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(j.id)}>
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

                <Pagination links={jam.links} from={jam.from} to={jam.to} total={jam.total} />

                <ConfirmDialog
                    open={deleteId !== null}
                    onOpenChange={() => setDeleteId(null)}
                    title="Hapus Jam"
                    description="Apakah Anda yakin ingin menghapus jam ini?"
                    onConfirm={handleDelete}
                    processing={processing}
                />
            </div>
        </AppLayout>
    );
}
