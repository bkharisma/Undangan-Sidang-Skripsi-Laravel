import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Pic } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Props extends Record<string, unknown> {
    pic: Pic;
}

export default function Edit({ pic }: PageProps<Props>) {
    const { data, setData, put, processing, errors } = useForm({
        nama: pic.nama,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.pic.update', pic.id));
    };

    return (
        <AppLayout>
            <Head title="Edit PIC" />

            <div className="space-y-6 max-w-lg">
                <h1 className="text-2xl font-bold">Edit PIC</h1>

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
                        <Button variant="outline" type="button" onClick={() => router.visit(route('admin.pic.index'))}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
