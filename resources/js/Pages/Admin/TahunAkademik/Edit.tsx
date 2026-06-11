import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Save } from 'lucide-react';

interface TahunAkademikData {
    id: number;
    tahun: string;
    is_active: boolean;
}

interface Props {
    tahunAkademik: TahunAkademikData;
}

export default function Edit({ tahunAkademik }: Props) {
    const currentTahun = tahunAkademik.tahun;
    const currentYear = currentTahun.substring(0, 4);
    const currentSemester = currentTahun.substring(4, 5);

    const { data, setData, put, errors, processing } = useForm({
        tahun: currentYear,
        semester: currentSemester,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.tahun-akademik.update', tahunAkademik.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Tahun Akademik" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Edit Tahun Akademik</h1>

                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Form Tahun Akademik</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tahun">Tahun</Label>
                                <Input
                                    id="tahun"
                                    type="number"
                                    value={data.tahun}
                                    onChange={(e) => setData('tahun', e.target.value)}
                                />
                                {errors.tahun && (
                                    <p className="text-sm text-destructive">{errors.tahun}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="semester">Semester</Label>
                                <Select
                                    value={data.semester}
                                    onValueChange={(value) => setData('semester', value ?? '')}
                                >
                                    <SelectTrigger id="semester" className="w-full">
                                        <SelectValue placeholder="Pilih semester..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Ganjil</SelectItem>
                                        <SelectItem value="2">Genap</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.semester && (
                                    <p className="text-sm text-destructive">{errors.semester}</p>
                                )}
                            </div>

                            <div className="text-sm text-muted-foreground">
                                Kode: <strong>{data.tahun}{data.semester}</strong>
                            </div>

                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
