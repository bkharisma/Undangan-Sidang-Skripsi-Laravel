import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface Dosen {
    id: number;
    nama: string;
    inisial: string;
}

interface UndanganDetail {
    id: number;
    dosen_id: number;
    nomor_surat: string | null;
    dosen?: Dosen;
}

interface Props {
    undangan: UndanganDetail;
}

export default function UndanganEdit({ undangan }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        nomor_surat: undangan.nomor_surat ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('undangan.update', undangan.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Undangan" />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={route('undangan.show', undangan.id)}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Undangan #{undangan.id}</h1>
                </div>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Ubah Nomor Surat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">Dosen</Label>
                                <p className="font-medium">{undangan.dosen?.nama} ({undangan.dosen?.inisial})</p>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nomor Surat *</Label>
                                    <Input
                                        value={data.nomor_surat}
                                        onChange={(e) => setData('nomor_surat', e.target.value)}
                                        placeholder="Masukkan nomor surat"
                                    />
                                    {errors.nomor_surat && (
                                        <p className="text-sm text-destructive">{errors.nomor_surat}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan
                                    </Button>
                                    <Link href={route('undangan.show', undangan.id)}>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
