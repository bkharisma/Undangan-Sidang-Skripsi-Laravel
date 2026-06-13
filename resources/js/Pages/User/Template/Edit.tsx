import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo } from 'react';
import { Save, Eye } from 'lucide-react';

interface TemplateData {
    id: number;
    header_image: string | null;
    header_logo: string | null;
    ttd_image: string | null;
    header_image_url: string | null;
    header_logo_url: string | null;
    ttd_image_url: string | null;
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

    const headerImagePreview = useMemo(
        () => (data.header_image ? URL.createObjectURL(data.header_image) : null),
        [data.header_image],
    );
    const headerLogoPreview = useMemo(
        () => (data.header_logo ? URL.createObjectURL(data.header_logo) : null),
        [data.header_logo],
    );
    const ttdImagePreview = useMemo(
        () => (data.ttd_image ? URL.createObjectURL(data.ttd_image) : null),
        [data.ttd_image],
    );

    useEffect(() => {
        return () => {
            if (headerImagePreview) URL.revokeObjectURL(headerImagePreview);
        };
    }, [headerImagePreview]);

    useEffect(() => {
        return () => {
            if (headerLogoPreview) URL.revokeObjectURL(headerLogoPreview);
        };
    }, [headerLogoPreview]);

    useEffect(() => {
        return () => {
            if (ttdImagePreview) URL.revokeObjectURL(ttdImagePreview);
        };
    }, [ttdImagePreview]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('template.update'));
    };

    return (
        <AppLayout>
            <Head title="Edit Template PDF" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Template PDF</h1>
                        <p className="text-sm text-muted-foreground">
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

                <form onSubmit={submit} className="max-w-2xl">
                    <Card>
                        <CardContent>
                            <Accordion multiple defaultValue={['header', 'ttd', 'deskripsi']}>
                                <AccordionItem value="header">
                                    <AccordionTrigger>Header</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="header_image">
                                                    Header Image (Kop Surat Full)
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Upload gambar kop surat full-width. Jika diisi, akan menggantikan header teks dan logo.
                                                </p>
                                                {(headerImagePreview || template.header_image_url) && (
                                                    <div className="rounded border p-2">
                                                        <img
                                                            src={headerImagePreview ?? template.header_image_url ?? ''}
                                                            alt="Preview header image"
                                                            className="max-h-24 w-full object-contain"
                                                        />
                                                    </div>
                                                )}
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

                                            <div className="space-y-2">
                                                <Label htmlFor="header_logo">
                                                    Header Logo
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Hanya dipakai jika Header Image tidak diisi.
                                                </p>
                                                {(headerLogoPreview || template.header_logo_url) && (
                                                    <div className="rounded border p-2 inline-block">
                                                        <img
                                                            src={headerLogoPreview ?? template.header_logo_url ?? ''}
                                                            alt="Preview header logo"
                                                            className="h-12 w-auto object-contain"
                                                        />
                                                    </div>
                                                )}
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
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="ttd">
                                    <AccordionTrigger>Tanda Tangan</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="ttd_image">
                                                    Gambar TTD
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Upload gambar tanda tangan (format PNG transparan disarankan).
                                                </p>
                                                {(ttdImagePreview || template.ttd_image_url) && (
                                                    <div className="rounded border p-2 inline-block">
                                                        <img
                                                            src={ttdImagePreview ?? template.ttd_image_url ?? ''}
                                                            alt="Preview TTD"
                                                            className="h-16 w-auto object-contain"
                                                        />
                                                    </div>
                                                )}
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
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="deskripsi">
                                    <AccordionTrigger>Deskripsi</AccordionTrigger>
                                    <AccordionContent>
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
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Template
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
