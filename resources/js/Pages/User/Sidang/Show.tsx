import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2, Plus, CalendarCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    program_studi: string;
}

interface Dosen {
    id: number;
    nama: string;
    inisial: string;
}

interface Pic {
    id: number;
    nama: string;
}

interface Ruangan {
    id: number;
    nama: string;
}

interface Jam {
    id: number;
    jam_mulai: string;
    jam_selesai: string;
}

interface JadwalSidang {
    id: number;
    tanggal: string;
    ruangan_id: number;
    jam_id: number;
    pic_id: number;
    ruangan?: Ruangan;
    jam?: Jam;
    pic?: Pic;
}

interface Sidang {
    id: number;
    judul_skripsi: string;
    tanggal_ujian: string;
    tahun_akademik: string;
    penguji1_id: number;
    penguji2_id: number;
    pimpinan_sidang_id: number;
    mahasiswa?: Mahasiswa;
    penguji1?: Dosen;
    penguji2?: Dosen;
    pimpinan_sidang?: Dosen;
    jadwal_sidang?: JadwalSidang | null;
}

interface Props {
    sidang: Sidang;
    pic: Pic[];
    ruangan: Ruangan[];
    jam: Jam[];
}

export default function SidangShow({ sidang, pic, ruangan, jam }: Props) {
    const hasJadwal = !!sidang.jadwal_sidang;

    const jadwalForm = useForm({
        tanggal: sidang.jadwal_sidang?.tanggal || sidang.tanggal_ujian,
        ruangan_id: sidang.jadwal_sidang ? String(sidang.jadwal_sidang.ruangan_id) : '',
        jam_id: sidang.jadwal_sidang ? String(sidang.jadwal_sidang.jam_id) : '',
        pic_id: sidang.jadwal_sidang ? String(sidang.jadwal_sidang.pic_id) : '',
    });

    const handleJadwalSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (hasJadwal) {
            jadwalForm.put(route('sidang.jadwal.update', sidang.id), {
                onSuccess: () => jadwalForm.reset(),
            });
        } else {
            jadwalForm.post(route('sidang.jadwal.store', sidang.id), {
                onSuccess: () => jadwalForm.reset(),
            });
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderJadwalForm = (isEdit: boolean) => (
        <form onSubmit={handleJadwalSubmit} className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">{isEdit ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Tanggal *</Label>
                    <Input
                        type="date"
                        value={jadwalForm.data.tanggal}
                        onChange={(e) => jadwalForm.setData('tanggal', e.target.value)}
                    />
                    {jadwalForm.errors.tanggal && (
                        <p className="text-sm text-destructive">{jadwalForm.errors.tanggal}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Ruangan *</Label>
                    <Select
                        value={jadwalForm.data.ruangan_id}
                        onValueChange={(v) => jadwalForm.setData('ruangan_id', v || '')}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih ruangan..." />
                        </SelectTrigger>
                        <SelectContent>
                            {ruangan.map((r) => (
                                <SelectItem key={r.id} value={String(r.id)}>
                                    {r.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {jadwalForm.errors.ruangan_id && (
                        <p className="text-sm text-destructive">{jadwalForm.errors.ruangan_id}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Jam *</Label>
                    <Select
                        value={jadwalForm.data.jam_id}
                        onValueChange={(v) => jadwalForm.setData('jam_id', v || '')}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jam..." />
                        </SelectTrigger>
                        <SelectContent>
                            {jam.map((j) => (
                                <SelectItem key={j.id} value={String(j.id)}>
                                    {j.jam_mulai} - {j.jam_selesai}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {jadwalForm.errors.jam_id && (
                        <p className="text-sm text-destructive">{jadwalForm.errors.jam_id}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>PIC *</Label>
                    <Select
                        value={jadwalForm.data.pic_id}
                        onValueChange={(v) => jadwalForm.setData('pic_id', v || '')}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih PIC..." />
                        </SelectTrigger>
                        <SelectContent>
                            {pic.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {jadwalForm.errors.pic_id && (
                        <p className="text-sm text-destructive">{jadwalForm.errors.pic_id}</p>
                    )}
                </div>
            </div>
            <Button type="submit" disabled={jadwalForm.processing}>
                {isEdit ? 'Perbarui Jadwal' : (
                    <>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Jadwal
                    </>
                )}
            </Button>
        </form>
    );

    return (
        <AppLayout>
            <Head title="Detail Sidang" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Detail Sidang</h1>
                    <div className="flex gap-2">
                        <Link href={route('sidang.edit', sidang.id)}>
                            <Button variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Sidang
                            </Button>
                        </Link>
                        <Link
                            href={route('sidang.destroy', sidang.id)}
                            method="delete"
                            as="button"
                            onClick={(e) => {
                                if (!confirm('Hapus sidang ini?')) e.preventDefault();
                            }}
                        >
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-muted-foreground">NIM</Label>
                                <p className="font-medium">{sidang.mahasiswa?.nim}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Nama</Label>
                                <p className="font-medium">{sidang.mahasiswa?.nama}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Program Studi</Label>
                                <p className="font-medium">{sidang.mahasiswa?.program_studi}</p>
                            </div>
                            <Separator />
                            <div>
                                <Label className="text-muted-foreground">Judul Skripsi</Label>
                                <p className="font-medium">{sidang.judul_skripsi}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Tanggal Ujian</Label>
                                <p className="font-medium">{formatDate(sidang.tanggal_ujian)}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Tahun Akademik</Label>
                                <p className="font-medium">{sidang.tahun_akademik}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dosen Terlibat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-muted-foreground">Penguji 1</Label>
                                <p className="font-medium">{sidang.penguji1?.nama} ({sidang.penguji1?.inisial})</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Penguji 2</Label>
                                <p className="font-medium">{sidang.penguji2?.nama} ({sidang.penguji2?.inisial})</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Pimpinan Sidang</Label>
                                <p className="font-medium">{sidang.pimpinan_sidang?.nama} ({sidang.pimpinan_sidang?.inisial})</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarCheck className="h-5 w-5" />
                            Jadwal Sidang
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasJadwal && sidang.jadwal_sidang ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div>
                                        <Label className="text-muted-foreground">Hari/Tanggal</Label>
                                        <p className="font-medium">{formatDate(sidang.jadwal_sidang.tanggal)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Ruangan</Label>
                                        <p className="font-medium">{sidang.jadwal_sidang.ruangan?.nama}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Waktu</Label>
                                        <p className="font-medium">{sidang.jadwal_sidang.jam?.jam_mulai} - {sidang.jadwal_sidang.jam?.jam_selesai}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">PIC</Label>
                                        <p className="font-medium">{sidang.jadwal_sidang.pic?.nama}</p>
                                    </div>
                                </div>
                                {renderJadwalForm(true)}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-muted-foreground">Belum ada jadwal sidang.</p>
                                {renderJadwalForm(false)}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
