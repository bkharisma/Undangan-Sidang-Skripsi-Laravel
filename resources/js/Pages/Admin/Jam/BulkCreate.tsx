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
    data: { jam_mulai: string; jam_selesai: string };
    messages: string[];
}

interface ImportResults {
    validCount: number;
    errorCount: number;
    errors: ImportError[];
    validIds: number[];
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
        post(route('admin.jam.bulk.store'), {
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setData('file', null);
            },
        });
    };

    const downloadTemplate = () => {
        window.location.href = route('admin.jam.bulk.template');
    };

    return (
        <AppLayout>
            <Head title="Tambah Jam (Bulk)" />

            <div className="space-y-6 w-full">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => router.visit(route('admin.jam.index'))}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Tambah Jam (Bulk)</h1>
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>jam_mulai</TableCell>
                                        <TableCell>jam_selesai</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-muted-foreground text-xs">Jam mulai (HH:MM)</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">Jam selesai (HH:MM)</TableCell>
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
                        <CardDescription>Pilih file Excel (.xlsx, .xls) atau CSV yang berisi data jam.</CardDescription>
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
                                <Button variant="outline" type="button" onClick={() => router.visit(route('admin.jam.index'))}>
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
                                            {importResults.validCount} jam berhasil ditambahkan.
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
                                                <TableHead>Jam Mulai</TableHead>
                                                <TableHead>Jam Selesai</TableHead>
                                                <TableHead>Error</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {importResults.errors.map((err, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{err.row}</TableCell>
                                                    <TableCell>{err.data.jam_mulai || '-'}</TableCell>
                                                    <TableCell>{err.data.jam_selesai || '-'}</TableCell>
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
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">ID</TableHead>
                                                <TableHead>Keterangan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {importResults.validIds.map((id, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-mono font-medium">{id}</TableCell>
                                                    <TableCell className="text-muted-foreground text-xs">Gunakan ID ini sebagai referensi di Excel Sidang (kolom I)</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {importResults.validCount > 0 && (
                                <div className="flex gap-2">
                                    <Button onClick={() => router.visit(route('admin.jam.index'))}>
                                        Lihat Data Jam
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
