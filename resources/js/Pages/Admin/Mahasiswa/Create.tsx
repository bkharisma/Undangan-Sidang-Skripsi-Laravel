import AppLayout from '@/Layouts/AppLayout';
import { PageProps, ProgramStudi } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Props extends Record<string, unknown> {
    programStudiList: Pick<ProgramStudi, 'id' | 'kode' | 'nama'>[];
}

export default function Create({ programStudiList }: PageProps<Props>) {
    const { data, setData, post, processing, errors } = useForm({
        nim: '',
        nama: '',
        program_studi: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.mahasiswa.store'));
    };

    return (
        <AppLayout>
            <Head title="Tambah Mahasiswa" />

            <div className="space-y-6 max-w-lg">
                <h1 className="text-2xl font-bold">Tambah Mahasiswa</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nim">NIM</Label>
                        <Input
                            id="nim"
                            value={data.nim}
                            onChange={(e) => setData('nim', e.target.value)}
                        />
                        {errors.nim && <p className="text-sm text-destructive">{errors.nim}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                        />
                        {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="program_studi">Program Studi</Label>
                        <Select value={data.program_studi} onValueChange={(value) => setData('program_studi', value ?? '')}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih program studi..." />
                            </SelectTrigger>
                            <SelectContent>
                                {programStudiList.map((p) => (
                                    <SelectItem key={p.id} value={p.nama}>
                                        {p.kode} - {p.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.program_studi && <p className="text-sm text-destructive">{errors.program_studi}</p>}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                        <Button variant="outline" type="button" onClick={() => router.visit(route('admin.mahasiswa.index'))}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
