import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Download, Pencil, Trash2 } from 'lucide-react';

interface Dosen {
    id: number;
    nama: string;
    inisial: string;
}

interface UndanganItem {
    id: number;
    dosen_id: number;
    dosen?: Dosen;
    nomor_surat: string | null;
    created_at: string;
}

interface Props {
    undangan: {
        data: UndanganItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { active: boolean; label: string; url: string | null }[];
    };
}

export default function UndanganIndex({ undangan }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Undangan" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Undangan</h1>
                    <Button onClick={() => router.visit('/undangan/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Undangan
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Semua Undangan ({undangan.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {undangan.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-4 py-12">
                                <p className="text-muted-foreground">Belum ada undangan yang dibuat.</p>
                                <Button variant="outline" onClick={() => router.visit('/undangan/create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Undangan Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-sm text-muted-foreground">
                                            <th className="px-4 py-3 text-left font-medium">#</th>
                                            <th className="px-4 py-3 text-left font-medium">Dosen</th>
                                            <th className="px-4 py-3 text-left font-medium">Nomor Surat</th>
                                            <th className="px-4 py-3 text-left font-medium">Tanggal Dibuat</th>
                                            <th className="px-4 py-3 text-center font-medium">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {undangan.data.map((item) => (
                                            <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 text-sm">{item.id}</td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium">{item.dosen?.nama}</p>
                                                    <p className="text-xs text-muted-foreground">{item.dosen?.inisial}</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-mono">{item.nomor_surat ?? '-'}</td>
                                                <td className="px-4 py-3 text-sm">{formatDate(item.created_at)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link href={route('undangan.show', item.id)}>
                                                            <Button variant="ghost" size="icon" title="Lihat">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('undangan.edit', item.id)}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <a href={route('undangan.preview', item.id)} target="_blank" rel="noreferrer">
                                                            <Button variant="ghost" size="icon" title="Preview PDF">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </a>
                                                        <Link
                                                            href={route('undangan.destroy', item.id)}
                                                            method="delete"
                                                            as="button"
                                                            onClick={(e) => {
                                                                if (!confirm('Hapus undangan ini?')) e.preventDefault();
                                                            }}
                                                        >
                                                            <Button variant="ghost" size="icon" title="Hapus">
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {undangan.last_page > 1 && (
                            <Pagination
                                links={undangan.links}
                                from={undangan.from}
                                to={undangan.to}
                                total={undangan.total}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
