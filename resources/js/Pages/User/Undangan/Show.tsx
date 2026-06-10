import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Eye, Download, Pencil, Trash2 } from 'lucide-react';

interface Dosen {
    id: number;
    nama: string;
    inisial: string;
}

interface SidangRow {
    no?: number;
    sidang_id: number;
    hari_tanggal: string | null;
    ruangan: string;
    waktu: string;
    nama_mahasiswa: string;
    nim: string;
    program_studi: string;
    judul_skripsi: string;
    peran: string;
}

interface UndanganDetail {
    id: number;
    user_id: number;
    dosen_id: number;
    nomor_surat: string | null;
    deskripsi: string | null;
    dosen?: Dosen;
    created_at: string;
    updated_at: string;
}

interface Props {
    undangan: UndanganDetail;
    sidangList: SidangRow[];
}

const HARI_INDONESIA: Record<string, string> = {
    Sunday: 'Minggu',
    Monday: 'Senin',
    Tuesday: 'Selasa',
    Wednesday: 'Rabu',
    Thursday: 'Kamis',
    Friday: 'Jumat',
    Saturday: 'Sabtu',
};

function formatHariTanggal(dateStr: string | null): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const dayName = HARI_INDONESIA[
        date.toLocaleDateString('en-US', { weekday: 'long' })
    ] ?? '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
}

export default function UndanganShow({ undangan, sidangList }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Detail Undangan" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('undangan.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Detail Undangan #{undangan.id}</h1>
                    </div>
                    <div className="flex gap-2">
                        <a href={route('undangan.preview', undangan.id)} target="_blank" rel="noreferrer">
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </a>
                        <a href={route('undangan.download', undangan.id)}>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </a>
                        <Link href={route('undangan.edit', undangan.id)}>
                            <Button variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Link
                            href={route('undangan.destroy', undangan.id)}
                            method="delete"
                            as="button"
                            onClick={(e) => {
                                if (!confirm('Hapus undangan ini?')) e.preventDefault();
                            }}
                        >
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Undangan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Ditujukan Kepada</Label>
                            <p className="font-medium">{undangan.dosen?.nama}</p>
                            <p className="text-sm text-muted-foreground">{undangan.dosen?.inisial}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Nomor Surat</Label>
                            <p className="font-medium font-mono">{undangan.nomor_surat ?? '-'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Dibuat Pada</Label>
                            <p className="font-medium">{formatDate(undangan.created_at)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Daftar Jadwal Sidang ({sidangList.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sidangList.length === 0 ? (
                            <p className="text-muted-foreground">Tidak ada jadwal sidang yang melibatkan dosen ini.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-3 py-2 text-left font-medium">No</th>
                                            <th className="px-3 py-2 text-left font-medium">Hari/Tanggal</th>
                                            <th className="px-3 py-2 text-left font-medium">Waktu</th>
                                            <th className="px-3 py-2 text-left font-medium">Ruangan</th>
                                            <th className="px-3 py-2 text-left font-medium">Nama Mahasiswa</th>
                                            <th className="px-3 py-2 text-left font-medium">NIM</th>
                                            <th className="px-3 py-2 text-left font-medium">Judul Skripsi</th>
                                            <th className="px-3 py-2 text-left font-medium">Peran</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sidangList.map((row, idx) => (
                                            <tr key={row.sidang_id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-3 py-2">{idx + 1}</td>
                                                <td className="px-3 py-2">{formatHariTanggal(row.hari_tanggal)}</td>
                                                <td className="px-3 py-2">{row.waktu}</td>
                                                <td className="px-3 py-2">{row.ruangan}</td>
                                                <td className="px-3 py-2">{row.nama_mahasiswa}</td>
                                                <td className="px-3 py-2">{row.nim}</td>
                                                <td className="px-3 py-2 max-w-xs truncate">{row.judul_skripsi}</td>
                                                <td className="px-3 py-2">
                                                    <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-medium">
                                                        {row.peran}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
