import type { LucideIcon } from 'lucide-react';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'user';
}

export interface Dosen {
    id: number;
    nama: string;
    inisial: string;
    created_at: string;
    updated_at: string;
}

export interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    program_studi: string;
    created_at: string;
    updated_at: string;
}

export interface Pic {
    id: number;
    nama: string;
    created_at: string;
    updated_at: string;
}

export interface ProgramStudi {
    id: number;
    kode: string;
    nama: string;
    created_at: string;
    updated_at: string;
}

export interface Sidang {
    id: number;
    user_id: number;
    mahasiswa_id: number;
    judul_skripsi: string;
    penguji1_id: number;
    penguji2_id: number;
    pimpinan_sidang_id: number;
    tanggal_ujian: string;
    tahun_akademik: string;
    user?: User;
    mahasiswa?: Mahasiswa;
    penguji1?: Dosen;
    penguji2?: Dosen;
    pimpinan_sidang?: Dosen;
    jadwal_sidang?: JadwalSidang;
    undangan?: Undangan[];
    undangan_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Ruangan {
    id: number;
    nama: string;
    created_at: string;
    updated_at: string;
}

export interface Jam {
    id: number;
    jam_mulai: string;
    jam_selesai: string;
    created_at: string;
    updated_at: string;
}

export interface JadwalSidang {
    id: number;
    sidang_id: number;
    tanggal: string;
    ruangan_id: number;
    jam_id: number;
    pic_id: number;
    ruangan?: Ruangan;
    jam?: Jam;
    pic?: Pic;
    created_at: string;
    updated_at: string;
}

export interface Undangan {
    id: number;
    user_id: number;
    sidang_id: number;
    dosen_id: number;
    header_logo: string | null;
    ttd_image: string | null;
    deskripsi: string | null;
    user?: User;
    sidang?: Sidang;
    dosen?: Dosen;
    created_at: string;
    updated_at: string;
}

export interface DosenSchedule {
    no: number;
    sidang_id: number;
    hari_tanggal: string | null;
    ruangan: string;
    waktu: string;
    kode_dosen: string;
    keterangan: string;
    nama_mahasiswa: string;
    prodi: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
