import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useRef, type FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, FileUp, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ImportError {
    row: number;
    data: { nim: string; nama: string; kode_prodi: string };
    messages: string[];
}

interface ImportResults {
    validCount: number;
    errorCount: number;
    errors: ImportError[];
}

interface Props extends Record<string, unknown> {
    importResults: ImportResults | null;
}

export default function BulkCreate({ importResults }: PageProps<Props>) {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!data.file) return;
        post(route('admin.mahasiswa.bulk.store'), {
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setData('file', null);
            },
        });
    };

    const downloadTemplate = () => {
        window.location.href = route('admin.mahasiswa.bulk.template');
    };

    return (
        <AppLayout>
            <Head title="Tambah Mahasiswa (Bulk)" />

            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => router.visit(route('admin.mahasiswa.index'))}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Tambah Mahasiswa (Bulk)</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Format File Excel</CardTitle>
                        <CardDescription>
                            File Excel (.xlsx/.xls) atau CSV dengan format berikut. Baris pertama adalah header (tidak diproses).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kolom A</TableHead>
                                        <TableHead>Kolom B</TableHead>
                                        <TableHead>Kolom C</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>nim</TableCell>
                                        <TableCell>nama</TableCell>
                                        <TableCell>kode_prodi</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-muted-foreground text-xs">NIM, maks 20 karakter (wajib, unik)</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">Nama lengkap mahasiswa (wajib)</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">Kode program studi, cth: TI, SI (wajib, harus terdaftar)</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <Button variant="outline" size="sm" onClick={downloadTemplate}>
                            <Download className="mr-2 h-4 w-4" /> Download Template Excel
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload File</CardTitle>
                        <CardDescription>Pilih file Excel (.xlsx, .xls) atau CSV yang berisi data mahasiswa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file">File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    ref={fileInputRef}
                                    onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                />
                                {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing || !data.file}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Upload & Impor
                                </Button>
                                <Button variant="outline" type="button" onClick={() => router.visit(route('admin.mahasiswa.index'))}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {importResults && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Hasil Impor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                {importResults.validCount > 0 && (
                                    <Alert>
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertDescription>
                                            {importResults.validCount} mahasiswa berhasil ditambahkan.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {importResults.errorCount > 0 && (
                                    <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {importResults.errorCount} baris gagal diimpor.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {importResults.validCount === 0 && importResults.errorCount === 0 && (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>Tidak ada data yang diproses.</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {importResults.errors.length > 0 && (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">Baris</TableHead>
                                                <TableHead>NIM</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Kode Prodi</TableHead>
                                                <TableHead>Error</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {importResults.errors.map((err, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{err.row}</TableCell>
                                                    <TableCell>{err.data.nim || '-'}</TableCell>
                                                    <TableCell>{err.data.nama || '-'}</TableCell>
                                                    <TableCell>{err.data.kode_prodi || '-'}</TableCell>
                                                    <TableCell className="text-destructive text-xs">
                                                        {err.messages.map((msg, j) => (
                                                            <div key={j}>{msg}</div>
                                                        ))}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {importResults.validCount > 0 && (
                                <div className="flex gap-2">
                                    <Button onClick={() => router.visit(route('admin.mahasiswa.index'))}>
                                        Lihat Data Mahasiswa
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
