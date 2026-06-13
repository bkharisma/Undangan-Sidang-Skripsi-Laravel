import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Pencil, Eye, Trash2, CalendarCheck, CalendarX, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { cn } from '@/lib/utils';
import Checkbox from '@/Components/Checkbox';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface SidangItem {
    id: number;
    judul_skripsi: string;
    tanggal_ujian: string;
    tahun_akademik: string;
    mahasiswa?: { id: number; nim: string; nama: string; program_studi: string };
    jadwal_sidang?: { id: number; ruangan?: { nama: string } } | null;

}

interface TahunAkademikOption {
    value: string;
    label: string;
}

interface Props {
    sidang: {
        data: SidangItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; tahun_akademik?: string; sort?: string; direction?: string; prodi?: string; per_page?: string };
    tahunAkademikOptions: TahunAkademikOption[];
    prodiOptions: string[];
}

export default function SidangIndex({ sidang, filters, tahunAkademikOptions, prodiOptions }: Props) {
    const { data, setData, get } = useForm({ search: filters.search || '' });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [bulkProcessing, setBulkProcessing] = useState(false);

    const currentPageIds = sidang.data.map((s) => s.id);
    const allOnPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedIds((prev) =>
            allOnPageSelected
                ? prev.filter((id) => !currentPageIds.includes(id))
                : [...new Set([...prev, ...currentPageIds])]
        );
    };

    const handleBulkDelete = () => {
        setBulkProcessing(true);
        router.delete(route('sidang.bulk.destroy'), {
            data: { ids: selectedIds },
            onSuccess: () => {
                setBulkProcessing(false);
                setBulkDeleteOpen(false);
                setSelectedIds([]);
            },
            onFinish: () => setBulkProcessing(false),
        });
    };

    const buildQuery = (overrides: Record<string, string | undefined> = {}) => ({
        search: data.search || undefined,
        tahun_akademik: filters.tahun_akademik || undefined,
        prodi: filters.prodi || undefined,
        sort: filters.sort || undefined,
        direction: filters.direction || undefined,
        per_page: filters.per_page || undefined,
        ...overrides,
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(route('sidang.index', buildQuery()));
    };

    const handleTaFilter = (value: string | null) => {
        get(route('sidang.index', buildQuery({ tahun_akademik: value && value !== 'all' ? value : undefined })));
    };

    const handleProdiFilter = (value: string | null) => {
        get(route('sidang.index', buildQuery({ prodi: value && value !== 'all' ? value : undefined })));
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort || 'created_at';
        const currentDirection = filters.direction || 'desc';
        const direction = currentSort === column && currentDirection === 'asc' ? 'desc' : 'asc';
        get(route('sidang.index', buildQuery({ sort: column, direction })));
    };

    const sortIcon = (column: string) => {
        const currentSort = filters.sort || 'created_at';
        if (currentSort !== column) {
            return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />;
        }
        if (filters.direction === 'asc') {
            return <ArrowUp className="ml-1 h-3.5 w-3.5" />;
        }
        return <ArrowDown className="ml-1 h-3.5 w-3.5" />;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Data Sidang" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Data Sidang</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            disabled={selectedIds.length === 0}
                            onClick={() => setBulkDeleteOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Terpilih{selectedIds.length > 0 && ` (${selectedIds.length})`}
                        </Button>
                        <Button variant="outline" onClick={() => {
                            const params = new URLSearchParams();
                            if (filters.search) params.set('search', filters.search);
                            if (filters.tahun_akademik) params.set('tahun_akademik', filters.tahun_akademik);
                            if (filters.prodi) params.set('prodi', filters.prodi);
                            if (filters.sort) params.set('sort', filters.sort);
                            if (filters.direction) params.set('direction', filters.direction);
                            window.location.href = route('sidang.export') + (params.toString() ? '?' + params.toString() : '');
                        }}>
                            <Download className="mr-2 h-4 w-4" /> Export Excel
                        </Button>
                        <Button onClick={() => router.visit('/sidang/create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Sidang
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Input
                        placeholder="Cari NIM, nama, atau judul skripsi..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="w-full sm:max-w-sm"
                    />
                    <Select
                        value={filters.tahun_akademik || ''}
                        onValueChange={handleTaFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[240px]">
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
                        value={filters.prodi || ''}
                        onValueChange={handleProdiFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
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
                    <Button type="submit" variant="outline">
                        <Search className="mr-2 h-4 w-4" />
                        Cari
                    </Button>
                </form>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Tampilkan</span>
                    <Select
                        value={filters.per_page || '10'}
                        onValueChange={(value) => {
                            get(route('sidang.index', buildQuery({ per_page: value ?? undefined })));
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

                <div className="rounded-lg border overflow-hidden">
                    <Table className="min-w-[750px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={allOnPageSelected}
                                        onChange={toggleSelectAll}
                                        aria-label="Pilih semua di halaman ini"
                                    />
                                </TableHead>
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
                                <TableHead
                                    className="cursor-pointer select-none whitespace-nowrap"
                                    onClick={() => handleSort('jadwal')}
                                >
                                    <span className="inline-flex items-center">
                                        Jadwal {sortIcon('jadwal')}
                                    </span>
                                </TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sidang.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                                        Belum ada data sidang.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sidang.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="w-10">
                                            <Checkbox
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => toggleSelect(item.id)}
                                                aria-label={`Pilih sidang ${item.mahasiswa?.nim}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.mahasiswa?.nim}
                                        </TableCell>
                                        <TableCell>{item.mahasiswa?.nama}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.tahun_akademik}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {item.judul_skripsi}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.tanggal_ujian).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {item.jadwal_sidang ? (
                                                <Badge variant="default" className="gap-1">
                                                    <CalendarCheck className="h-3 w-3" />
                                                    Ada
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1">
                                                    <CalendarX className="h-3 w-3" />
                                                    Belum
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={route('sidang.show', item.id)}>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('sidang.edit', item.id)}>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={route('sidang.destroy', item.id)}
                                                    method="delete"
                                                    as="button"
                                                    onClick={(e) => {
                                                        if (!confirm('Hapus sidang ini? Semua data terkait akan ikut terhapus.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Button variant="ghost" size="icon-sm">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {sidang.last_page > 1 && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {sidang.from} sampai {sidang.to} dari {sidang.total} data
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {sidang.links.map((link, i) => {
                                if (link.url === null) {
                                    return (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            size="sm"
                                            disabled
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={cn(
                                            'inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-colors h-7 gap-1 px-2.5 text-[0.8rem]',
                                            link.active
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                                                : 'border border-input bg-background hover:bg-muted hover:text-foreground'
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={(open) => {
                    if (!bulkProcessing) setBulkDeleteOpen(open);
                }}
                title="Hapus Data Terpilih"
                description={`Anda yakin ingin menghapus ${selectedIds.length} data sidang terpilih? Semua data jadwal yang terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleBulkDelete}
                processing={bulkProcessing}
            />
        </AppLayout>
    );
}
