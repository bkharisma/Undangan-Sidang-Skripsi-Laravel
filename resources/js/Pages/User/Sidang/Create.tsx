import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
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

interface TahunAkademikOption {
    value: string;
    label: string;
}

interface Props {
    mahasiswa: Mahasiswa[];
    dosen: Dosen[];
    pic: Pic[];
    ruangan: Ruangan[];
    jam: Jam[];
    tahunAkademikOptions: TahunAkademikOption[];
}

export default function SidangCreate({ mahasiswa, dosen, pic, ruangan, jam, tahunAkademikOptions }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        mahasiswa_id: '',
        judul_skripsi: '',
        penguji1_id: '',
        penguji2_id: '',
        pimpinan_sidang_id: '',
        tanggal_ujian: '',
        tahun_akademik: '',
        ruangan_id: '',
        jam_id: '',
        pic_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('sidang.store'));
    };

    const selectedMahasiswa = mahasiswa.find((m) => m.id === Number(data.mahasiswa_id));
    const selectedPenguji1 = dosen.find((d) => d.id === Number(data.penguji1_id));
    const selectedPenguji2 = dosen.find((d) => d.id === Number(data.penguji2_id));
    const selectedPimpinanSidang = dosen.find((d) => d.id === Number(data.pimpinan_sidang_id));
    const selectedRuangan = ruangan.find((r) => r.id === Number(data.ruangan_id));
    const selectedJam = jam.find((j) => j.id === Number(data.jam_id));
    const selectedPic = pic.find((p) => p.id === Number(data.pic_id));

    return (
        <AppLayout>
            <Head title="Tambah Sidang" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Tambah Data Sidang</h1>

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="mahasiswa">Mahasiswa *</Label>
                        <Select
                            value={data.mahasiswa_id}
                            onValueChange={(v) => setData('mahasiswa_id', v || '')}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue>
                                    {selectedMahasiswa
                                        ? `${selectedMahasiswa.nim} - ${selectedMahasiswa.nama}`
                                        : 'Pilih mahasiswa...'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {mahasiswa.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.nim} - {m.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.mahasiswa_id && (
                            <p className="text-sm text-destructive">{errors.mahasiswa_id}</p>
                        )}
                        {selectedMahasiswa && (
                            <p className="text-sm text-muted-foreground">
                                Program Studi: {selectedMahasiswa.program_studi}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="judul">Judul Skripsi *</Label>
                        <Textarea
                            id="judul"
                            value={data.judul_skripsi}
                            onChange={(e) => setData('judul_skripsi', e.target.value)}
                            placeholder="Masukkan judul skripsi"
                            rows={3}
                        />
                        {errors.judul_skripsi && (
                            <p className="text-sm text-destructive">{errors.judul_skripsi}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Penguji 1 *</Label>
                            <Select
                                value={data.penguji1_id}
                                onValueChange={(v) => setData('penguji1_id', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {selectedPenguji1
                                            ? `${selectedPenguji1.inisial} - ${selectedPenguji1.nama}`
                                            : 'Pilih penguji 1...'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {dosen.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>
                                            {d.inisial} - {d.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.penguji1_id && (
                                <p className="text-sm text-destructive">{errors.penguji1_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Penguji 2 *</Label>
                            <Select
                                value={data.penguji2_id}
                                onValueChange={(v) => setData('penguji2_id', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {selectedPenguji2
                                            ? `${selectedPenguji2.inisial} - ${selectedPenguji2.nama}`
                                            : 'Pilih penguji 2...'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {dosen.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>
                                            {d.inisial} - {d.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.penguji2_id && (
                                <p className="text-sm text-destructive">{errors.penguji2_id}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Tahun Akademik *</Label>
                            <Select
                                value={data.tahun_akademik}
                                onValueChange={(v) => setData('tahun_akademik', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih tahun akademik..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {tahunAkademikOptions.map((ta) => (
                                        <SelectItem key={ta.value} value={ta.value}>
                                            {ta.label} ({ta.value})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tahun_akademik && (
                                <p className="text-sm text-destructive">{errors.tahun_akademik}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Pimpinan Sidang *</Label>
                            <Select
                                value={data.pimpinan_sidang_id}
                                onValueChange={(v) => setData('pimpinan_sidang_id', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {selectedPimpinanSidang
                                            ? `${selectedPimpinanSidang.inisial} - ${selectedPimpinanSidang.nama}`
                                            : 'Pilih pimpinan sidang...'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {dosen.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>
                                            {d.inisial} - {d.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.pimpinan_sidang_id && (
                                <p className="text-sm text-destructive">{errors.pimpinan_sidang_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal_ujian">Tanggal Ujian *</Label>
                            <Input
                                id="tanggal_ujian"
                                type="date"
                                value={data.tanggal_ujian}
                                onChange={(e) => setData('tanggal_ujian', e.target.value)}
                            />
                            {errors.tanggal_ujian && (
                                <p className="text-sm text-destructive">{errors.tanggal_ujian}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-t pt-4">
                            <h2 className="mb-4 text-lg font-semibold">Jadwal Sidang (Opsional)</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Ruangan</Label>
                                <Select
                                    value={data.ruangan_id}
                                    onValueChange={(v) => setData('ruangan_id', v || '')}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih ruangan...">
                                            {selectedRuangan?.nama}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ruangan.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {r.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.ruangan_id && (
                                    <p className="text-sm text-destructive">{errors.ruangan_id}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Jam</Label>
                                <Select
                                    value={data.jam_id}
                                    onValueChange={(v) => setData('jam_id', v || '')}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih jam...">
                                            {selectedJam ? `${selectedJam.jam_mulai} - ${selectedJam.jam_selesai}` : undefined}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jam.map((j) => (
                                            <SelectItem key={j.id} value={String(j.id)}>
                                                {j.jam_mulai} - {j.jam_selesai}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.jam_id && (
                                    <p className="text-sm text-destructive">{errors.jam_id}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>PIC</Label>
                                <Select
                                    value={data.pic_id}
                                    onValueChange={(v) => setData('pic_id', v || '')}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih PIC...">
                                            {selectedPic?.nama}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pic.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.pic_id && (
                                    <p className="text-sm text-destructive">{errors.pic_id}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
