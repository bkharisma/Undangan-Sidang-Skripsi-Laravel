import AppLayout from '@/Layouts/AppLayout';
import { PageProps, ProgramStudi } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Search, FileUp } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props extends Record<string, unknown> {
    programStudi: {
        data: ProgramStudi[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
}

export default function Index({ programStudi, filters }: PageProps<Props>) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setProcessing(true);
        router.delete(route('admin.program-studi.destroy', deleteId), {
            onFinish: () => {
                setProcessing(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Program Studi" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Program Studi</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => router.visit(route('admin.program-studi.bulk.create'))}>
                            <FileUp className="mr-2 h-4 w-4" /> Tambah Banyak
                        </Button>
                        <Button onClick={() => router.visit(route('admin.program-studi.create'))}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama..."
                            defaultValue={filters?.search || ''}
                            className="pl-9"
                            onChange={(e) => {
                                const value = e.target.value;
                                router.get(
                                    route('admin.program-studi.index'),
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
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programStudi.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Tidak ada data program studi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                programStudi.data.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.kode}</TableCell>
                                        <TableCell>{p.nama}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon-sm" onClick={() => router.visit(route('admin.program-studi.edit', p.id))}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(p.id)}>
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

                <Pagination links={programStudi.links} from={programStudi.from} to={programStudi.to} total={programStudi.total} />

                <ConfirmDialog
                    open={deleteId !== null}
                    onOpenChange={() => setDeleteId(null)}
                    title="Hapus Program Studi"
                    description="Apakah Anda yakin ingin menghapus program studi ini?"
                    onConfirm={handleDelete}
                    processing={processing}
                />
            </div>
        </AppLayout>
    );
}
