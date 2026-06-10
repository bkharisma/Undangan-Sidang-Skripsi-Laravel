import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Sidang } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

interface Props extends Record<string, unknown> {
    sidang: Sidang;
}

export default function Show({ sidang }: PageProps<Props>) {
    return (
        <AppLayout>
            <Head title={`Sidang - ${sidang.mahasiswa?.nama}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.visit(route('admin.sidang.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Sidang</h1>
                </div>

                {/* Mahasiswa Info */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Data Mahasiswa</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <span className="text-sm text-muted-foreground">Nama</span>
                            <p className="font-medium">{sidang.mahasiswa?.nama}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">NIM</span>
                            <p className="font-medium">{sidang.mahasiswa?.nim}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Program Studi</span>
                            <p className="font-medium">{sidang.mahasiswa?.program_studi}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Tanggal Ujian</span>
                            <p className="font-medium">{sidang.tanggal_ujian}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Tahun Akademik</span>
                            <p className="font-medium">{sidang.tahun_akademik}</p>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div>
                        <span className="text-sm text-muted-foreground">Judul Skripsi</span>
                        <p className="font-medium">{sidang.judul_skripsi}</p>
                    </div>
                </div>

                {/* Dosen Info */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Dosen Terlibat</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <span className="text-sm text-muted-foreground">Penguji 1</span>
                            <p className="font-medium">{sidang.penguji1?.nama}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Penguji 2</span>
                            <p className="font-medium">{sidang.penguji2?.nama}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Pimpinan Sidang</span>
                            <p className="font-medium">{sidang.pimpinan_sidang?.nama}</p>
                        </div>
                    </div>
                </div>

                {/* Jadwal Sidang */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Jadwal Sidang</h2>
                    {sidang.jadwal_sidang ? (
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Tanggal</span>
                                <p className="font-medium">{sidang.jadwal_sidang.tanggal}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Ruangan</span>
                                <p className="font-medium">{sidang.jadwal_sidang.ruangan?.nama}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Waktu</span>
                                <p className="font-medium">
                                    {sidang.jadwal_sidang.jam?.jam_mulai} – {sidang.jadwal_sidang.jam?.jam_selesai}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">PIC</span>
                                <p className="font-medium">{sidang.jadwal_sidang.pic?.nama}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Belum ada jadwal.</p>
                    )}
                </div>


            </div>
        </AppLayout>
    );
}
