import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        kode: '',
        nama: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.program-studi.store'));
    };

    return (
        <AppLayout>
            <Head title="Tambah Program Studi" />

            <div className="space-y-6 max-w-lg">
                <h1 className="text-2xl font-bold">Tambah Program Studi</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="kode">Kode</Label>
                        <Input
                            id="kode"
                            value={data.kode}
                            onChange={(e) => setData('kode', e.target.value)}
                            placeholder="Contoh: TI"
                        />
                        {errors.kode && <p className="text-sm text-destructive">{errors.kode}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            placeholder="Contoh: Teknik Informatika"
                        />
                        {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                        <Button variant="outline" type="button" onClick={() => router.visit(route('admin.program-studi.index'))}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
