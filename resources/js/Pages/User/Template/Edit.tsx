import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Save, Eye } from 'lucide-react';

interface TemplateData {
    id: number;
    header_image: string | null;
    header_logo: string | null;
    ttd_image: string | null;
    ttd_kota: string | null;
    ttd_jabatan: string | null;
    ttd_nama: string | null;
    ttd_nip: string | null;
    deskripsi: string | null;
}

interface Props {
    template: TemplateData;
}

export default function TemplateEdit({ template }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        header_image: null as File | null,
        header_logo: null as File | null,
        ttd_image: null as File | null,
        ttd_kota: template.ttd_kota ?? '',
        ttd_jabatan: template.ttd_jabatan ?? '',
        ttd_nama: template.ttd_nama ?? '',
        ttd_nip: template.ttd_nip ?? '',
        deskripsi: template.deskripsi ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('template.update'));
    };

    return (
        <AppLayout>
            <Head title="Edit Template PDF" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Template PDF</h1>
                        <p className="text-muted-foreground">
                            Atur header, logo, tanda tangan, dan deskripsi yang akan tampil di semua undangan PDF.
                        </p>
                    </div>
                    <a href={route('template.preview')} target="_blank" rel="noreferrer">
                        <Button variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview PDF
                        </Button>
                    </a>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="header_image">
                                    Header Image (Kop Surat Full) {template.header_image && <span className="text-xs text-muted-foreground">(ada header tersimpan)</span>}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Upload gambar kop surat full-width. Jika diisi, akan menggantikan header teks dan logo.
                                </p>
                                <Input
                                    id="header_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setData('header_image', e.target.files[0]);
                                        }
                                    }}
                                />
                                {errors.header_image && (
                                    <p className="text-sm text-destructive">{errors.header_image}</p>
                                )}
                            </div>

                            <Separator />

                            <p className="text-sm text-muted-foreground">
                                Opsi di bawah hanya dipakai jika Header Image tidak diisi:
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="header_logo">
                                    Header Logo {template.header_logo && <span className="text-xs text-muted-foreground">(ada logo tersimpan)</span>}
                                </Label>
                                <Input
                                    id="header_logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setData('header_logo', e.target.files[0]);
                                        }
                                    }}
                                />
                                {errors.header_logo && (
                                    <p className="text-sm text-destructive">{errors.header_logo}</p>
                                )}
                            </div>

                            <Separator />

                            <p className="text-sm font-medium">Tanda Tangan</p>

                            <div className="space-y-2">
                                <Label htmlFor="ttd_image">
                                    Gambar TTD {template.ttd_image && <span className="text-xs text-muted-foreground">(ada TTD tersimpan)</span>}
                                </Label>
                                <Input
                                    id="ttd_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setData('ttd_image', e.target.files[0]);
                                        }
                                    }}
                                />
                                {errors.ttd_image && (
                                    <p className="text-sm text-destructive">{errors.ttd_image}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ttd_kota">Kota</Label>
                                <Input
                                    id="ttd_kota"
                                    value={data.ttd_kota}
                                    onChange={(e) => setData('ttd_kota', e.target.value)}
                                    placeholder="Contoh: Jakarta..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ttd_jabatan">Jabatan</Label>
                                <Input
                                    id="ttd_jabatan"
                                    value={data.ttd_jabatan}
                                    onChange={(e) => setData('ttd_jabatan', e.target.value)}
                                    placeholder="Contoh: Ketua Program Studi..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ttd_nama">Nama Penanda Tangan</Label>
                                <Input
                                    id="ttd_nama"
                                    value={data.ttd_nama}
                                    onChange={(e) => setData('ttd_nama', e.target.value)}
                                    placeholder="Nama pejabat penanda tangan..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ttd_nip">NIP</Label>
                                <Input
                                    id="ttd_nip"
                                    value={data.ttd_nip}
                                    onChange={(e) => setData('ttd_nip', e.target.value)}
                                    placeholder="NIP pejabat penanda tangan..."
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi Undangan</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Tulis deskripsi atau pesan untuk semua undangan..."
                                    rows={4}
                                />
                                {errors.deskripsi && (
                                    <p className="text-sm text-destructive">{errors.deskripsi}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Template
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
