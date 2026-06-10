import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

interface DosenItem {
    id: number;
    nama: string;
    inisial: string;
}

interface DosenSchedule {
    no: number;
    sidang_id: number;
    hari_tanggal: string | null;
    ruangan: string;
    waktu: string;
    kode_dosen: string;
    keterangan: string;
    nama_mahasiswa: string;
    prodi: string;
}

interface Props {
    dosenList: DosenItem[];
    nomorSuratSuggestion: string;
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

export default function UndanganCreate({ dosenList, nomorSuratSuggestion }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        dosen_id: '',
        nomor_surat: nomorSuratSuggestion,
    });

    const [schedules, setSchedules] = useState<DosenSchedule[]>([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);

    useEffect(() => {
        if (!data.dosen_id) {
            setSchedules([]);
            return;
        }

        setLoadingSchedules(true);
        fetch(route('undangan.dosen-schedules', { dosen_id: data.dosen_id }))
            .then((res) => res.json())
            .then((json) => {
                setSchedules(json);
                setLoadingSchedules(false);
            })
            .catch(() => setLoadingSchedules(false));
    }, [data.dosen_id]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('undangan.store'));
    };

    const selectedDosen = dosenList.find((d) => d.id === Number(data.dosen_id));

    return (
        <AppLayout>
            <Head title="Buat Undangan" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Buat Undangan Sidang</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="max-w-2xl space-y-4">
                        <div className="space-y-2">
                            <Label>Pilih Dosen *</Label>
                            <Select
                                value={data.dosen_id}
                                onValueChange={(v) => setData('dosen_id', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {selectedDosen
                                            ? `${selectedDosen.inisial} - ${selectedDosen.nama}`
                                            : 'Pilih dosen...'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {dosenList.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>
                                            {d.inisial} - {d.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.dosen_id && (
                                <p className="text-sm text-destructive">{errors.dosen_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Nomor Surat</Label>
                            <Input
                                value={data.nomor_surat}
                                onChange={(e) => setData('nomor_surat', e.target.value)}
                                placeholder="Nomor surat undangan"
                            />
                            <p className="text-xs text-muted-foreground">
                                Kosongkan untuk menggunakan nomor otomatis.
                            </p>
                            {errors.nomor_surat && (
                                <p className="text-sm text-destructive">{errors.nomor_surat}</p>
                            )}
                        </div>
                    </div>

                    {data.dosen_id && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Preview Jadwal Sidang Dosen</h2>
                                {!loadingSchedules && (
                                    <span className="text-sm text-muted-foreground">
                                        {schedules.length} jadwal ditemukan
                                    </span>
                                )}
                            </div>

                            {loadingSchedules ? (
                                <p className="text-sm text-muted-foreground">Memuat jadwal...</p>
                            ) : schedules.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Tidak ada sidang yang melibatkan dosen ini.
                                </p>
                            ) : (
                                <div className="overflow-x-auto rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="px-3 py-2 text-left font-medium">No</th>
                                                <th className="px-3 py-2 text-left font-medium">Hari/Tanggal</th>
                                                <th className="px-3 py-2 text-left font-medium">Ruangan</th>
                                                <th className="px-3 py-2 text-left font-medium">Waktu</th>
                                                <th className="px-3 py-2 text-left font-medium">Kode Dosen</th>
                                                <th className="px-3 py-2 text-left font-medium">Keterangan</th>
                                                <th className="px-3 py-2 text-left font-medium">Nama Mahasiswa</th>
                                                <th className="px-3 py-2 text-left font-medium">Prodi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.map((row) => (
                                                <tr key={row.sidang_id} className="border-b last:border-0 hover:bg-muted/50">
                                                    <td className="px-3 py-2">{row.no}</td>
                                                    <td className="px-3 py-2">{formatHariTanggal(row.hari_tanggal)}</td>
                                                    <td className="px-3 py-2">{row.ruangan}</td>
                                                    <td className="px-3 py-2">{row.waktu}</td>
                                                    <td className="px-3 py-2">{row.kode_dosen}</td>
                                                    <td className="px-3 py-2">{row.keterangan}</td>
                                                    <td className="px-3 py-2">{row.nama_mahasiswa}</td>
                                                    <td className="px-3 py-2">{row.prodi}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing || !data.dosen_id || (data.dosen_id !== '' && schedules.length === 0 && !loadingSchedules)}>
                            Generate Undangan
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
