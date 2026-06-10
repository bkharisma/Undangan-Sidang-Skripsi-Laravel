import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Ruangan } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Props extends Record<string, unknown> {
    ruangan: Ruangan;
}

export default function Edit({ ruangan }: PageProps<Props>) {
    const { data, setData, put, processing, errors } = useForm({
        nama: ruangan.nama,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.ruangan.update', ruangan.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Ruangan" />

            <div className="space-y-6 max-w-lg">
                <h1 className="text-2xl font-bold">Edit Ruangan</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                        />
                        {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                        <Button variant="outline" type="button" onClick={() => router.visit(route('admin.ruangan.index'))}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
