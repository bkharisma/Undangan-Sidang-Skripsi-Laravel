import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Save } from 'lucide-react';

interface SettingData {
    id: number;
    app_logo: string | null;
    app_logo_url: string | null;
    app_name: string | null;
    app_deskripsi: string | null;
    favicon: string | null;
    favicon_url: string | null;
}

interface Props {
    setting: SettingData;
}

export default function SettingEdit({ setting }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        app_logo: null as File | null,
        app_name: setting.app_name ?? '',
        app_deskripsi: setting.app_deskripsi ?? '',
        favicon: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.setting.update'));
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Aplikasi" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Pengaturan Aplikasi</h1>
                    <p className="text-sm text-muted-foreground">
                        Atur logo, nama, deskripsi, dan favicon aplikasi.
                    </p>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Identitas Aplikasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="app_logo">
                                    Logo Aplikasi
                                    {setting.app_logo && (
                                        <span className="text-xs text-muted-foreground"> (logo tersimpan)</span>
                                    )}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Logo akan tampil di sidebar. Format PNG/JPG, maks 2MB.
                                </p>
                                {setting.app_logo_url && (
                                    <div className="rounded border p-2 inline-block">
                                        <img
                                            src={setting.app_logo_url}
                                            alt="Logo saat ini"
                                            className="h-12 w-auto object-contain"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="app_logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setData('app_logo', e.target.files[0]);
                                        }
                                    }}
                                />
                                {errors.app_logo && (
                                    <p className="text-sm text-destructive">{errors.app_logo}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="app_name">Nama Aplikasi</Label>
                                <Input
                                    id="app_name"
                                    value={data.app_name}
                                    onChange={(e) => setData('app_name', e.target.value)}
                                    placeholder="Nama aplikasi..."
                                />
                                {errors.app_name && (
                                    <p className="text-sm text-destructive">{errors.app_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="app_deskripsi">Deskripsi Aplikasi</Label>
                                <Textarea
                                    id="app_deskripsi"
                                    value={data.app_deskripsi}
                                    onChange={(e) => setData('app_deskripsi', e.target.value)}
                                    placeholder="Deskripsi aplikasi..."
                                    rows={3}
                                />
                                {errors.app_deskripsi && (
                                    <p className="text-sm text-destructive">{errors.app_deskripsi}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="favicon">
                                    Favicon
                                    {setting.favicon && (
                                        <span className="text-xs text-muted-foreground"> (favicon tersimpan)</span>
                                    )}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Icon kecil di tab browser. Format PNG/ICO, maks 512KB.
                                </p>
                                {setting.favicon_url && (
                                    <div className="rounded border p-1 inline-block">
                                        <img
                                            src={setting.favicon_url}
                                            alt="Favicon saat ini"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="favicon"
                                    type="file"
                                    accept="image/*,.ico"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setData('favicon', e.target.files[0]);
                                        }
                                    }}
                                />
                                {errors.favicon && (
                                    <p className="text-sm text-destructive">{errors.favicon}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Pengaturan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
