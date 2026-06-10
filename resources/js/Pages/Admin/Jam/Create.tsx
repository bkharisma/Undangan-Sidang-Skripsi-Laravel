import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        jam_mulai: '',
        jam_selesai: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.jam.store'));
    };

    return (
        <AppLayout>
            <Head title="Tambah Jam" />

            <div className="space-y-6 max-w-lg">
                <h1 className="text-2xl font-bold">Tambah Jam</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jam_mulai">Jam Mulai</Label>
                            <Input
                                id="jam_mulai"
                                type="time"
                                value={data.jam_mulai}
                                onChange={(e) => setData('jam_mulai', e.target.value)}
                            />
                            {errors.jam_mulai && <p className="text-sm text-destructive">{errors.jam_mulai}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jam_selesai">Jam Selesai</Label>
                            <Input
                                id="jam_selesai"
                                type="time"
                                value={data.jam_selesai}
                                onChange={(e) => setData('jam_selesai', e.target.value)}
                            />
                            {errors.jam_selesai && <p className="text-sm text-destructive">{errors.jam_selesai}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                        <Button variant="outline" type="button" onClick={() => router.visit(route('admin.jam.index'))}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
