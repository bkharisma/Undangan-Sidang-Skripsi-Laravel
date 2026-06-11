import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Dosen } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Search, FileUp } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props extends Record<string, unknown> {
    dosen: {
        data: Dosen[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
}

export default function Index({ dosen, filters }: PageProps<Props>) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setProcessing(true);
        router.delete(route('admin.dosen.destroy', deleteId), {
            onFinish: () => {
                setProcessing(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Data Dosen" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Data Dosen</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => router.visit(route('admin.dosen.bulk.create'))}>
                            <FileUp className="mr-2 h-4 w-4" /> Tambah Banyak
                        </Button>
                        <Button onClick={() => router.visit(route('admin.dosen.create'))}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Dosen
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau inisial..."
                            defaultValue={filters?.search || ''}
                            className="pl-9"
                            onChange={(e) => {
                                const value = e.target.value;
                                router.get(
                                    route('admin.dosen.index'),
                                    { search: value || undefined },
                                    { preserveState: true, replace: true }
                                );
                            }}
                        />
                    </div>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Inisial</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dosen.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Tidak ada data dosen.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dosen.data.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-medium">{d.nama}</TableCell>
                                        <TableCell>{d.inisial}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon-sm" onClick={() => router.visit(route('admin.dosen.edit', d.id))}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(d.id)}>
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

                <Pagination links={dosen.links} from={dosen.from} to={dosen.to} total={dosen.total} />

                <ConfirmDialog
                    open={deleteId !== null}
                    onOpenChange={() => setDeleteId(null)}
                    title="Hapus Dosen"
                    description="Apakah Anda yakin ingin menghapus dosen ini?"
                    onConfirm={handleDelete}
                    processing={processing}
                />
            </div>
        </AppLayout>
    );
}
