import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Mahasiswa } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Search, FileUp } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props extends Record<string, unknown> {
    mahasiswa: {
        data: Mahasiswa[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
}

export default function Index({ mahasiswa, filters }: PageProps<Props>) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setProcessing(true);
        router.delete(route('admin.mahasiswa.destroy', deleteId), {
            onFinish: () => {
                setProcessing(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Data Mahasiswa" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Data Mahasiswa</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.visit(route('admin.mahasiswa.bulk.create'))}>
                            <FileUp className="mr-2 h-4 w-4" /> Tambah Banyak
                        </Button>
                        <Button onClick={() => router.visit(route('admin.mahasiswa.create'))}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Mahasiswa
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau NIM..."
                            defaultValue={filters?.search || ''}
                            className="pl-9"
                            onChange={(e) => {
                                const value = e.target.value;
                                router.get(
                                    route('admin.mahasiswa.index'),
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
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Program Studi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mahasiswa.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        Tidak ada data mahasiswa.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mahasiswa.data.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">{m.nim}</TableCell>
                                        <TableCell>{m.nama}</TableCell>
                                        <TableCell>{m.program_studi}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon-sm" onClick={() => router.visit(route('admin.mahasiswa.edit', m.id))}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(m.id)}>
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

                <Pagination links={mahasiswa.links} from={mahasiswa.from} to={mahasiswa.to} total={mahasiswa.total} />

                <ConfirmDialog
                    open={deleteId !== null}
                    onOpenChange={() => setDeleteId(null)}
                    title="Hapus Mahasiswa"
                    description="Apakah Anda yakin ingin menghapus mahasiswa ini?"
                    onConfirm={handleDelete}
                    processing={processing}
                />
            </div>
        </AppLayout>
    );
}
