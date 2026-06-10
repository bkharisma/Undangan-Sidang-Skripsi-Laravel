import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Sidang, Pic, Ruangan, Jam } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Search, Upload, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Loader2 } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { FormEventHandler, useState } from 'react';

interface TahunAkademikOption {
    value: string;
    label: string;
}

interface Props extends Record<string, unknown> {
    sidang: {
        data: Sidang[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string; tahun_akademik?: string; sort?: string; direction?: string; prodi?: string; per_page?: string };
    tahunAkademikOptions: TahunAkademikOption[];
    prodiOptions: string[];
    pic: Pic[];
    ruangan: Ruangan[];
    jam: Jam[];
}

export default function Index({ sidang, filters, tahunAkademikOptions, prodiOptions, pic, ruangan, jam }: PageProps<Props>) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSidang, setSelectedSidang] = useState<Sidang | null>(null);

    const buildQuery = (overrides: Record<string, string | undefined> = {}) => ({
        search: filters?.search || undefined,
        tahun_akademik: filters?.tahun_akademik || undefined,
        prodi: filters?.prodi || undefined,
        sort: filters?.sort || undefined,
        direction: filters?.direction || undefined,
        per_page: filters?.per_page || undefined,
        ...overrides,
    });

    const jadwalForm = useForm({
        tanggal: '',
        ruangan_id: '',
        jam_id: '',
        pic_id: '',
    });

    const openEditDialog = (s: Sidang) => {
        setSelectedSidang(s);
        jadwalForm.setData({
            tanggal: s.jadwal_sidang?.tanggal || s.tanggal_ujian,
            ruangan_id: s.jadwal_sidang ? String(s.jadwal_sidang.ruangan_id) : '',
            jam_id: s.jadwal_sidang ? String(s.jadwal_sidang.jam_id) : '',
            pic_id: s.jadwal_sidang ? String(s.jadwal_sidang.pic_id) : '',
        });
        jadwalForm.clearErrors();
        setDialogOpen(true);
    };

    const handleJadwalSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedSidang) return;

        jadwalForm.put(route('admin.sidang.jadwal.update', selectedSidang.id), {
            onSuccess: () => {
                setDialogOpen(false);
                setSelectedSidang(null);
                jadwalForm.reset();
            },
        });
    };

    const handleSort = (column: string) => {
        const currentSort = filters?.sort || 'created_at';
        const currentDirection = filters?.direction || 'desc';
        const direction = currentSort === column && currentDirection === 'asc' ? 'desc' : 'asc';
        router.get(
            route('admin.sidang.index'),
            buildQuery({ sort: column, direction }),
            { preserveState: true, replace: true }
        );
    };

    const sortIcon = (column: string) => {
        const currentSort = filters?.sort || 'created_at';
        if (currentSort !== column) {
            return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />;
        }
        if (filters?.direction === 'asc') {
            return <ArrowUp className="ml-1 h-3.5 w-3.5" />;
        }
        return <ArrowDown className="ml-1 h-3.5 w-3.5" />;
    };

    return (
        <AppLayout>
            <Head title="Semua Sidang" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Semua Sidang</h1>
                    <Button onClick={() => router.visit(route('admin.sidang.bulk.create'))}>
                        <Upload className="mr-2 h-4 w-4" /> Tambah Bulk
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari mahasiswa, NIM, atau judul..."
                            defaultValue={filters?.search || ''}
                            className="pl-9"
                            onChange={(e) => {
                                const value = e.target.value;
                                router.get(
                                    route('admin.sidang.index'),
                                    buildQuery({ search: value || undefined }),
                                    { preserveState: true, replace: true }
                                );
                            }}
                        />
                    </div>
                    <Select
                        value={filters?.tahun_akademik || ''}
                        onValueChange={(value) => {
                            router.get(
                                route('admin.sidang.index'),
                                buildQuery({ tahun_akademik: value && value !== 'all' ? value : undefined }),
                                { preserveState: true, replace: true }
                            );
                        }}
                    >
                        <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Semua Tahun Akademik" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tahun Akademik</SelectItem>
                            {tahunAkademikOptions.map((ta) => (
                                <SelectItem key={ta.value} value={ta.value}>
                                    {ta.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters?.prodi || ''}
                        onValueChange={(value) => {
                            router.get(
                                route('admin.sidang.index'),
                                buildQuery({ prodi: value && value !== 'all' ? value : undefined }),
                                { preserveState: true, replace: true }
                            );
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Prodi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Prodi</SelectItem>
                            {prodiOptions.map((prodi) => (
                                <SelectItem key={prodi} value={prodi}>
                                    {prodi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Tampilkan</span>
                    <Select
                        value={filters?.per_page || '10'}
                        onValueChange={(value) => {
                            router.get(
                                route('admin.sidang.index'),
                                buildQuery({ per_page: value ?? undefined }),
                                { preserveState: true, replace: true }
                            );
                        }}
                    >
                        <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 25, 50].map((n) => (
                                <SelectItem key={n} value={String(n)}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>data</span>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer select-none whitespace-nowrap"
                                    onClick={() => handleSort('nim')}
                                >
                                    <span className="inline-flex items-center">
                                        NIM {sortIcon('nim')}
                                    </span>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer select-none whitespace-nowrap"
                                    onClick={() => handleSort('nama')}
                                >
                                    <span className="inline-flex items-center">
                                        Nama Mahasiswa {sortIcon('nama')}
                                    </span>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer select-none whitespace-nowrap"
                                    onClick={() => handleSort('tahun_akademik')}
                                >
                                    <span className="inline-flex items-center">
                                        T.A. {sortIcon('tahun_akademik')}
                                    </span>
                                </TableHead>
                                <TableHead>Judul Skripsi</TableHead>
                                <TableHead
                                    className="cursor-pointer select-none whitespace-nowrap"
                                    onClick={() => handleSort('tanggal_ujian')}
                                >
                                    <span className="inline-flex items-center">
                                        Tanggal Ujian {sortIcon('tanggal_ujian')}
                                    </span>
                                </TableHead>
                                <TableHead>Ruangan</TableHead>
                                <TableHead>Jam</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sidang.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                                        Tidak ada data sidang.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sidang.data.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">
                                            {s.mahasiswa?.nim}
                                        </TableCell>
                                        <TableCell>{s.mahasiswa?.nama}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{s.tahun_akademik}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {s.judul_skripsi}
                                        </TableCell>
                                        <TableCell>{s.tanggal_ujian}</TableCell>
                                        <TableCell>
                                            {s.jadwal_sidang?.ruangan?.nama ?? (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {s.jadwal_sidang?.jam ? (
                                                `${s.jadwal_sidang.jam.jam_mulai} - ${s.jadwal_sidang.jam.jam_selesai}`
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(s)} title="Edit Jadwal">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => router.visit(route('admin.sidang.show', s.id))}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination links={sidang.links} from={sidang.from} to={sidang.to} total={sidang.total} />
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
                if (!jadwalForm.processing) setDialogOpen(open);
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Jadwal Sidang</DialogTitle>
                        <DialogDescription>
                            {selectedSidang?.mahasiswa?.nama} — {selectedSidang?.mahasiswa?.nim}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleJadwalSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tanggal *</Label>
                            <Input
                                type="date"
                                value={jadwalForm.data.tanggal}
                                onChange={(e) => jadwalForm.setData('tanggal', e.target.value)}
                            />
                            {jadwalForm.errors.tanggal && (
                                <p className="text-sm text-destructive">{jadwalForm.errors.tanggal}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Ruangan *</Label>
                            <Select
                                value={jadwalForm.data.ruangan_id}
                                onValueChange={(v) => jadwalForm.setData('ruangan_id', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih ruangan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {ruangan.map((r) => (
                                        <SelectItem key={r.id} value={String(r.id)}>
                                            {r.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {jadwalForm.errors.ruangan_id && (
                                <p className="text-sm text-destructive">{jadwalForm.errors.ruangan_id}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Jam *</Label>
                            <Select
                                value={jadwalForm.data.jam_id}
                                onValueChange={(v) => jadwalForm.setData('jam_id', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih jam..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {jam.map((j) => (
                                        <SelectItem key={j.id} value={String(j.id)}>
                                            {j.jam_mulai} - {j.jam_selesai}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {jadwalForm.errors.jam_id && (
                                <p className="text-sm text-destructive">{jadwalForm.errors.jam_id}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>PIC *</Label>
                            <Select
                                value={jadwalForm.data.pic_id}
                                onValueChange={(v) => jadwalForm.setData('pic_id', v || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih PIC..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {pic.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {jadwalForm.errors.pic_id && (
                                <p className="text-sm text-destructive">{jadwalForm.errors.pic_id}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                disabled={jadwalForm.processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={jadwalForm.processing}>
                                {jadwalForm.processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
