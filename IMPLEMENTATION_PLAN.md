# Implementation Plan - Aplikasi Undangan Sidang Skripsi

## 1. Project Overview

**Nama Aplikasi:** Undangan Sidang Skripsi  
**Tujuan:** Aplikasi untuk membuat dan meng-generate undangan sidang skripsi dalam format PDF

### Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Backend | PHP Laravel | 11.x |
| Database | MariaDB | 10.x+ |
| Frontend | React + TypeScript | React 18+ / TS 5+ |
| Bridge | Inertia.js | Latest |
| UI Framework | Tailwind CSS + shadcn/ui | 3.x |
| Authentication | Laravel Breeze (Inertia stack) | Latest |
| PDF Generation | barryvdh/laravel-dompdf | Latest |

---

## 2. Database Design

### 2.1 Entity Relationship

```
users (1) ════ (N) sidang (1) ════ (N) jadwal_sidang
  │                  │
  │                  └══ (N) undangan ══ (1) dosen
  │
  └── admin mengelola ──── users, dosen, mahasiswa, pic

mahasiswa (1) ════ (N) sidang
dosen ══════ direferensi oleh sidang (pembimbing1, pembimbing2,
                                 penguji1, penguji2, pimpinan_sidang)
       ══════ direferensi oleh undangan (target dosen)
pic   ══════ direferensi oleh jadwal_sidang
```

### 2.2 Tabel: users

| Column | Type | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| name | varchar(255) | NOT NULL |
| email | varchar(255) | UNIQUE, NOT NULL |
| email_verified_at | timestamp | nullable |
| password | varchar(255) | NOT NULL |
| role | enum('admin','user') | DEFAULT 'user' |
| remember_token | varchar(100) | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### 2.3 Tabel: dosen

| Column | Type | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| nama | varchar(255) | NOT NULL |
| inisial | varchar(10) | NOT NULL, UNIQUE |
| created_at | timestamp | |
| updated_at | timestamp | |

### 2.4 Tabel: mahasiswa

| Column | Type | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| nim | varchar(20) | NOT NULL, UNIQUE |
| nama | varchar(255) | NOT NULL |
| program_studi | varchar(255) | NOT NULL |
| created_at | timestamp | |
| updated_at | timestamp | |

### 2.5 Tabel: pic

| Column | Type | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| nama | varchar(255) | NOT NULL |
| created_at | timestamp | |
| updated_at | timestamp | |

### 2.6 Tabel: sidang

| Column | Type | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| user_id | bigint | FK → users.id, NOT NULL |
| mahasiswa_id | bigint | FK → mahasiswa.id, NOT NULL |
| judul_skripsi | text | NOT NULL |
| pembimbing1_id | bigint | FK → dosen.id, NOT NULL |
| pembimbing2_id | bigint | FK → dosen.id, NOT NULL |
| penguji1_id | bigint | FK → dosen.id, NOT NULL |
| penguji2_id | bigint | FK → dosen.id, NOT NULL |
| pimpinan_sidang_id | bigint | FK → dosen.id, NOT NULL |
| tanggal_ujian | date | NOT NULL |
| created_at | timestamp | |
| updated_at | timestamp | |

### 2.7 Tabel: jadwal_sidang

| Column | Type | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| sidang_id | bigint | FK → sidang.id, NOT NULL, UNIQUE |
| tanggal | date | NOT NULL |
| ruangan | varchar(255) | NOT NULL |
| waktu_mulai | time | NOT NULL |
| waktu_selesai | time | NOT NULL |
| pic_id | bigint | FK → pic.id, NOT NULL |
| created_at | timestamp | |
| updated_at | timestamp | |

### 2.8 Tabel: undangan

| Column | Type | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| user_id | bigint | FK → users.id, NOT NULL |
| sidang_id | bigint | FK → sidang.id, NOT NULL |
| dosen_id | bigint | FK → dosen.id, NOT NULL |
| header_logo | varchar(500) | nullable (path file) |
| ttd_image | varchar(500) | nullable (path file) |
| deskripsi | text | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## 3. Backend Architecture

### 3.1 Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   ├── DashboardController.php
│   │   │   ├── UserController.php
│   │   │   ├── DosenController.php
│   │   │   ├── MahasiswaController.php
│   │   │   ├── PicController.php
│   │   │   └── SidangController.php
│   │   ├── User/
│   │   │   ├── DashboardController.php
│   │   │   ├── SidangController.php
│   │   │   ├── JadwalSidangController.php
│   │   │   └── UndanganController.php
│   │   └── Controller.php
│   ├── Middleware/
│   │   └── EnsureUserIsAdmin.php
│   ├── Requests/
│   │   ├── StoreUserRequest.php
│   │   ├── UpdateUserRequest.php
│   │   ├── StoreDosenRequest.php
│   │   ├── UpdateDosenRequest.php
│   │   ├── StoreMahasiswaRequest.php
│   │   ├── UpdateMahasiswaRequest.php
│   │   ├── StorePicRequest.php
│   │   ├── UpdatePicRequest.php
│   │   ├── StoreSidangRequest.php
│   │   ├── UpdateSidangRequest.php
│   │   ├── StoreJadwalSidangRequest.php
│   │   ├── UpdateJadwalSidangRequest.php
│   │   └── StoreUndanganRequest.php
│   └── Policies/
│       ├── SidangPolicy.php
│       ├── JadwalSidangPolicy.php
│       └── UndanganPolicy.php
├── Models/
│   ├── User.php
│   ├── Dosen.php
│   ├── Mahasiswa.php
│   ├── Pic.php
│   ├── Sidang.php
│   ├── JadwalSidang.php
│   └── Undangan.php

database/
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 0001_01_01_000001_create_cache_table.php
│   ├── 0001_01_01_000002_create_jobs_table.php
│   ├── 0002_00_00_create_dosen_table.php
│   ├── 0003_00_00_create_mahasiswa_table.php
│   ├── 0004_00_00_create_pic_table.php
│   ├── 0005_00_00_create_sidang_table.php
│   ├── 0006_00_00_create_jadwal_sidang_table.php
│   └── 0007_00_00_create_undangan_table.php
├── seeders/
│   ├── DatabaseSeeder.php
│   ├── UserSeeder.php
│   ├── DosenSeeder.php
│   ├── MahasiswaSeeder.php
│   └── PicSeeder.php

resources/
├── views/
│   └── pdf/
│       └── undangan.blade.php
├── js/
│   ├── app.tsx
│   ├── ssr.tsx
│   └── types/
│       └── index.d.ts
```

### 3.2 Model Relationships

```php
// User
User::hasMany(Sidang::class)
User::hasMany(Undangan::class)

// Mahasiswa
Mahasiswa::hasMany(Sidang::class)

// Dosen
Dosen::hasMany(Sidang::class, 'pembimbing1_id')
Dosen::hasMany(Sidang::class, 'pembimbing2_id')
Dosen::hasMany(Sidang::class, 'penguji1_id')
Dosen::hasMany(Sidang::class, 'penguji2_id')
Dosen::hasMany(Sidang::class, 'pimpinan_sidang_id')
Dosen::hasMany(Undangan::class)

// Pic
Pic::hasMany(JadwalSidang::class)

// Sidang
Sidang::belongsTo(User::class)
Sidang::belongsTo(Mahasiswa::class)
Sidang::belongsTo(Dosen::class, 'pembimbing1_id')
Sidang::belongsTo(Dosen::class, 'pembimbing2_id')
Sidang::belongsTo(Dosen::class, 'penguji1_id')
Sidang::belongsTo(Dosen::class, 'penguji2_id')
Sidang::belongsTo(Dosen::class, 'pimpinan_sidang_id')
Sidang::hasOne(JadwalSidang::class)
Sidang::hasMany(Undangan::class)

// JadwalSidang
JadwalSidang::belongsTo(Sidang::class)
JadwalSidang::belongsTo(Pic::class)

// Undangan
Undangan::belongsTo(User::class)
Undangan::belongsTo(Sidang::class)
Undangan::belongsTo(Dosen::class)
```

### 3.3 Routes

```php
// routes/web.php

// Auth routes (Breeze)
require __DIR__.'/auth.php';

// Redirect after login by role
Route::get('/', function () {
    $user = auth()->user();
    if (!$user) return redirect()->route('login');
    return $user->role === 'admin'
        ? redirect()->route('admin.dashboard')
        : redirect()->route('dashboard');
});

// Admin Routes
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
    
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])
        ->name('dashboard');
    
    Route::resource('users', Admin\UserController::class)
        ->except(['show']);
    Route::resource('dosen', Admin\DosenController::class)
        ->except(['show']);
    Route::resource('mahasiswa', Admin\MahasiswaController::class)
        ->except(['show']);
    Route::resource('pic', Admin\PicController::class)
        ->except(['show']);
    
    Route::get('/sidang', [Admin\SidangController::class, 'index'])
        ->name('sidang.index');
    Route::get('/sidang/{sidang}', [Admin\SidangController::class, 'show'])
        ->name('sidang.show');
});

// User Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [User\DashboardController::class, 'index'])
        ->name('dashboard');
    
    Route::resource('sidang', User\SidangController::class);
    
    Route::post('/sidang/{sidang}/jadwal', [User\JadwalSidangController::class, 'store'])
        ->name('sidang.jadwal.store');
    Route::put('/sidang/{sidang}/jadwal', [User\JadwalSidangController::class, 'update'])
        ->name('sidang.jadwal.update');
    
    Route::resource('undangan', User\UndanganController::class);
    Route::post('/undangan/preview', [User\UndanganController::class, 'preview'])
        ->name('undangan.preview');
    Route::get('/undangan/{undangan}/download', [User\UndanganController::class, 'download'])
        ->name('undangan.download');
});
```

---

## 4. Frontend Architecture

### 4.1 Directory Structure

```
resources/js/
├── app.tsx
├── ssr.tsx
├── types/
│   └── index.d.ts
├── components/
│   ├── ui/                    (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── badge.tsx
│   │   ├── textarea.tsx
│   │   ├── alert.tsx
│   │   ├── pagination.tsx
│   │   └── toast.tsx
│   ├── sidebar.tsx
│   ├── navbar.tsx
│   └── confirm-dialog.tsx
├── layouts/
│   ├── auth-layout.tsx
│   └── app-layout.tsx
└── pages/
    ├── auth/
    │   ├── login.tsx
    │   └── register.tsx
    ├── admin/
    │   ├── dashboard.tsx
    │   ├── users/
    │   │   ├── index.tsx
    │   │   ├── create.tsx
    │   │   └── edit.tsx
    │   ├── dosen/
    │   │   ├── index.tsx
    │   │   ├── create.tsx
    │   │   └── edit.tsx
    │   ├── mahasiswa/
    │   │   ├── index.tsx
    │   │   ├── create.tsx
    │   │   └── edit.tsx
    │   ├── pic/
    │   │   ├── index.tsx
    │   │   ├── create.tsx
    │   │   └── edit.tsx
    │   └── sidang/
    │       ├── index.tsx
    │       └── show.tsx
    └── user/
        ├── dashboard.tsx
        ├── sidang/
        │   ├── index.tsx
        │   ├── create.tsx
        │   ├── edit.tsx
        │   └── show.tsx
        └── undangan/
            ├── index.tsx
            ├── create.tsx
            └── show.tsx
```

### 4.2 TypeScript Interfaces

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

interface Dosen {
    id: number;
    nama: string;
    inisial: string;
    created_at: string;
    updated_at: string;
}

interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    program_studi: string;
    created_at: string;
    updated_at: string;
}

interface Pic {
    id: number;
    nama: string;
    created_at: string;
    updated_at: string;
}

interface Sidang {
    id: number;
    user_id: number;
    mahasiswa_id: number;
    judul_skripsi: string;
    pembimbing1_id: number;
    pembimbing2_id: number;
    penguji1_id: number;
    penguji2_id: number;
    pimpinan_sidang_id: number;
    tanggal_ujian: string;
    user?: User;
    mahasiswa?: Mahasiswa;
    pembimbing1?: Dosen;
    pembimbing2?: Dosen;
    penguji1?: Dosen;
    penguji2?: Dosen;
    pimpinan_sidang?: Dosen;
    jadwal_sidang?: JadwalSidang;
    undangan_count?: number;
    created_at: string;
    updated_at: string;
}

interface JadwalSidang {
    id: number;
    sidang_id: number;
    tanggal: string;
    ruangan: string;
    waktu_mulai: string;
    waktu_selesai: string;
    pic_id: number;
    pic?: Pic;
    created_at: string;
    updated_at: string;
}

interface Undangan {
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

// Inertia PageProps
interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}
```

### 4.3 Navigation

**Admin Sidebar:**
```
├── Dashboard
├── Kelola User
├── Data Dosen
├── Data Mahasiswa
├── Data PIC
└── Semua Sidang
```

**User Sidebar:**
```
├── Dashboard
├── Data Sidang
└── Undangan
```

### 4.4 User Flow

```
1. Login → Dashboard (statistik project sendiri)
2. Sidang → CRUD data sidang
   └── Show Page → Kelola Jadwal Sidang
                  → Generate Undangan
3. Undangan → Buat Undangan (pilih sidang, upload logo & TTD,
              tulis deskripsi, pilih dosen target)
            → Preview (modal/iframe PDF)
            → Download PDF
            → History undangan (index)
```

---

## 5. PDF Template Design

### 5.1 Undangan Layout (Fixed Template)

```
╔══════════════════════════════════════════════════╗
║              [LOGO UNIVERSITAS]                  ║
║         UNIVERSITAS XXXX                         ║
║      FAKULTAS XXXX                               ║
║      PROGRAM STUDI XXXX                          ║
║══════════════════════════════════════════════════║
║                                                  ║
║  Nomor    : UND-{id}/{YYYY}/{MM}/{DD}            ║
║  Lampiran : -                                    ║
║  Perihal  : Undangan Sidang Skripsi              ║
║                                                  ║
║  Kepada Yth.                                     ║
║  Bapak/Ibu [Nama Dosen]                          ║
║  Sebagai [Pembimbing 1 / Pembimbing 2 /          ║
║           Penguji 1 / Penguji 2 /                ║
║           Pimpinan Sidang]                       ║
║                                                  ║
║  [DESKRIPSI UNDANGAN - custom text dari user]    ║
║                                                  ║
║  Adapun data mahasiswa yang akan melaksanakan    ║
║  ujian sidang skripsi adalah sebagai berikut:    ║
║                                                  ║
║  Nama Mahasiswa  : [Nama]                        ║
║  NIM             : [NIM]                         ║
║  Program Studi   : [Program Studi]               ║
║  Judul Skripsi   : [Judul Skripsi]               ║
║  Tanggal Ujian   : [Tanggal Ujian]               ║
║                                                  ║
║  Dosen Pembimbing 1 : [Nama Dosen]               ║
║  Dosen Pembimbing 2 : [Nama Dosen]               ║
║  Dosen Penguji 1    : [Nama Dosen]               ║
║  Dosen Penguji 2    : [Nama Dosen]               ║
║  Pimpinan Sidang    : [Nama Dosen]               ║
║                                                  ║
║  Jadwal Sidang:                                  ║
║  Hari/Tanggal  : [Hari], [Tanggal Sidang]        ║
║  Ruangan       : [Ruangan]                       ║
║  Waktu         : [Waktu Mulai] - [Waktu Selesai] ║
║  PIC           : [Nama PIC]                      ║
║                                                  ║
║  Demikian undangan ini kami sampaikan.           ║
║  Atas perhatian dan kehadiran Bapak/Ibu,         ║
║  kami ucapkan terima kasih.                      ║
║                                                  ║
║                                                  ║
║  [Kota], [Tanggal Dibuat]                        ║
║                                                  ║
║  [TTD IMAGE]                                     ║
║  __________________________                      ║
║  Nama PIC Sidang                                 ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

### 5.2 PDF Config

```php
// Paper: A4
// Orientation: Portrait
// Font: sans-serif (default)
// Logo: loaded from storage/app/public/undangan/logos/
// TTD: loaded from storage/app/public/undangan/ttd/
```

---

## 6. Implementation Phases

### Phase 1: Project Scaffold & Setup ~~[status: completed]~~

| # | Task | Detail | Status |
|---|---|---|---|
| 1.1 | Create Laravel project | `composer create-project laravel/laravel` (Laravel v13.x with framework v13.15) | ~~Done~~ |
| 1.2 | Install Breeze + Inertia + React TS | `composer require laravel/breeze` → `php artisan breeze:install react --typescript` | ~~Done~~ |
| 1.3 | Configure `.env` | MariaDB connection (mysql://root:321@127.0.0.1:3306/undisidangta_db), APP_NAME="Undangan Sidang" | ~~Done~~ |
| 1.4 | Install shadcn/ui | `npx shadcn@latest init` (Tailwind v4 + base-ui) + button, input, label, select, table, card, dialog, dropdown-menu, badge, textarea, alert, separator, sonner | ~~Done~~ |
| 1.5 | Install DomPDF | `composer require barryvdh/laravel-dompdf` (v3.1) | ~~Done~~ |
| 1.6 | Create storage link | `php artisan storage:link` | ~~Done~~ |
| 1.7 | Setup App Layout | `AppLayout.tsx` with collapsible sidebar (admin/user nav), navbar with user dropdown, mobile responsive | ~~Done~~ |

**Notes:**
- Laravel v13 installed (latest stable, superseded the v11 in original plan)
- Tailwind CSS v4 used instead of v3 (shadcn/ui Tailwind v4 support)
- shadcn/ui uses `@base-ui/react` instead of `@radix-ui` (latest version)
- All auth pages (Login, Register, etc.) updated to use shadcn/ui components
- TypeScript interfaces for all models added to `types/index.d.ts`
- Toaster (sonner) added to `app.tsx` for notification support

**Output:** ~~Project berjalan, halaman login/register tampil~~

---

### Phase 2: Authentication & Authorization ✅ COMPLETED

| # | Task | Detail | Status |
|---|---|---|---|
| 2.1 | Tambah kolom `role` ke users migration | `$table->enum('role', ['admin', 'user'])->default('user')` | ✅ `2025_06_10_000000_add_role_to_users_table.php` |
| 2.2 | Buat middleware `EnsureUserIsAdmin` | Cek `auth()->user()->role === 'admin'` | ✅ `app/Http/Middleware/EnsureUserIsAdmin.php` |
| 2.3 | Daftarkan middleware di `bootstrap/app.php` | Alias `admin` | ✅ |
| 2.4 | Disable public registration | Hapus route register dari `routes/auth.php` | ✅ |
| 2.5 | Buat UserSeeder | Seed default admin (admin@example.com / password) | ✅ `database/seeders/UserSeeder.php` |
| 2.6 | Setup route groups | `/admin/*` untuk admin, `/*` untuk user | ✅ `routes/web.php` |
| 2.7 | Redirect setelah login | Admin → `/admin/dashboard`, User → `/dashboard` | ✅ `AuthenticatedSessionController.php` |
| 2.8 | Modifikasi sidebar + layout | Bedakan sidebar admin dan user | ✅ `Components/Sidebar.tsx`, `Components/Navbar.tsx` |

**Output:** Login/register admin only, role-based redirect, sidebar berbeda

---

### Phase 3: Database Migrations & Models ✅ COMPLETED

| # | Task | Detail | Status |
|---|---|---|---|
| 3.1 | Buat migration `dosen` | nama, inisial (unique) | ✅ `2025_06_10_100000_create_dosen_table.php` |
| 3.2 | Buat migration `mahasiswa` | nim (unique), nama, program_studi | ✅ `2025_06_10_110000_create_mahasiswa_table.php` |
| 3.3 | Buat migration `pic` | nama | ✅ `2025_06_10_120000_create_pic_table.php` |
| 3.4 | Buat migration `sidang` | FK ke users, mahasiswa, dosen (5 FK) | ✅ `2025_06_10_130000_create_sidang_table.php` |
| 3.5 | Buat migration `jadwal_sidang` | FK ke sidang (unique), pic | ✅ `2025_06_10_140000_create_jadwal_sidang_table.php` |
| 3.6 | Buat migration `undangan` | FK ke users, sidang, dosen | ✅ `2025_06_10_150000_create_undangan_table.php` |
| 3.7 | Buat semua model + relationships | User, Dosen, Mahasiswa, Pic, Sidang, JadwalSidang, Undangan | ✅ 7 models dengan full relationships |
| 3.8 | Buat Policies | SidangPolicy, JadwalSidangPolicy, UndanganPolicy | ✅ 3 policies (user scoping) |
| 3.9 | Buat seeders + sample data | Admin + 8 dosen + 10 mahasiswa + 3 PIC | ✅ `DosenSeeder`, `MahasiswaSeeder`, `PicSeeder` |
| 3.10 | Run migrations + seed | `php artisan migrate:fresh --seed` | ✅ All 10 migrations + 4 seeders ran successfully |

**Output:** Semua tabel terbuat, relationships berfungsi, sample data tersedia

---

### Phase 4: Admin Panel - Master Data ✅ COMPLETED

| # | Task | Detail | Status |
|---|---|---|---|
| 4.1 | Admin Dashboard | Stats: total user, dosen, mahasiswa, PIC, sidang, undangan | ✅ `Admin/DashboardController.php` + dynamic TSX |
| 4.2 | User Management | Index (table + search + pagination), Create, Edit, Delete | ✅ `Admin/UserController.php` + 3 pages |
| 4.3 | Dosen Management | Index, Create, Edit, Delete | ✅ `Admin/DosenController.php` + 3 pages |
| 4.4 | Mahasiswa Management | Index, Create, Edit, Delete | ✅ `Admin/MahasiswaController.php` + 3 pages |
| 4.5 | PIC Management | Index, Create, Edit, Delete | ✅ `Admin/PicController.php` + 3 pages |
| 4.6 | Admin Sidang List | View semua sidang dari semua user (read-only) | ✅ `Admin/SidangController.php@index` |
| 4.7 | Admin Sidang Detail | Lihat detail sidang + jadwal + undangan | ✅ `Admin/SidangController.php@show` |
| 4.8 | Form Request validasi | Required fields, unique constraints, proper messages | ✅ 8 Form Requests (Store/Update for each entity) |

**Output:** Admin bisa kelola semua master data & lihat semua sidang

**Added extra components:**
- `Components/Pagination.tsx` — Reusable pagination with page numbers
- `Components/ConfirmDialog.tsx` — Reusable delete confirmation dialog
- `Components/FlashMessages.tsx` — Sonner toast integration for flash messages
- Updated `AppLayout.tsx` and `AuthenticatedLayout.tsx` with FlashMessages

---

### Phase 5: User Panel - Sidang & Jadwal ✅ COMPLETED

| # | Task | Detail | Status |
|---|---|---|---|
| 5.1 | User Dashboard | Stats: total sidang sendiri, berjadwal, undangan | ✅ `app/Http/Controllers/User/DashboardController.php` |
| 5.2 | Sidang Index | List sidang milik sendiri (table + search + pagination) | ✅ `resources/js/Pages/User/Sidang/Index.tsx` |
| 5.3 | Sidang Create | Form: select mahasiswa (auto-fill), select dosen (5 dropdown), judul, tanggal ujian | ✅ `resources/js/Pages/User/Sidang/Create.tsx` |
| 5.4 | Sidang Edit | Edit semua field sidang | ✅ `resources/js/Pages/User/Sidang/Edit.tsx` |
| 5.5 | Sidang Delete | Hapus sidang + cascade jadwal + undangan | ✅ `SidangController@destroy` |
| 5.6 | Sidang Show | Detail lengkap + section jadwal + section undangan | ✅ `resources/js/Pages/User/Sidang/Show.tsx` |
| 5.7 | Jadwal Sidang Create/Edit | Form di dalam Sidang Show: tanggal, ruangan, waktu mulai, waktu selesai, select PIC | ✅ `app/Http/Controllers/User/JadwalSidangController.php` |
| 5.8 | Sidang Policy | Pastikan user hanya akses sidang milik sendiri | ✅ `app/Policies/SidangPolicy.php` (existing) |

**Output:** User bisa CRUD sidang + kelola jadwal

**Notes:**
- Form Requests: `StoreSidangRequest`, `UpdateSidangRequest`, `StoreJadwalSidangRequest`, `UpdateJadwalSidangRequest` created
- Routes: `/sidang` resource + `/sidang/{sidang}/jadwal` store/update added
- User Dashboard replaces generic "You're logged in!" page with stats (total sidang, berjadwal, undangan)
- All Select components use `@base-ui/react` (v5 shadcn/ui pattern)
- Fixed `JadwalSidang` model time casts (removed incorrect `datetime` cast from `waktu_mulai`/`waktu_selesai` which are `time` columns)

---

### Phase 6: Undangan - Generate, Preview & Download ✅ COMPLETED

| # | Task | Detail | Status |
|---|---|---|---|
| 6.1 | Undangan Index | List undangan yang sudah dibuat user | ✅ `User/Undangan/Index.tsx` + `UndanganController@index` |
| 6.2 | Undangan Create Page | Select sidang (dropdown), pilih dosen target (dari dosen terkait sidang), upload logo, upload TTD, tulis deskripsi | ✅ `User/Undangan/Create.tsx` + `UndanganController@create` + `@store` |
| 6.3 | Dosen selection + role detection | Auto-detect peran dosen (pembimbing/penguji/pimpinan) | ✅ Client-side role mapping + server-side `getDosenRoleInSidang()` |
| 6.4 | File upload handling | Store logo & TTD ke storage | ✅ `StoreUndanganRequest` validates images + `store()` saves to `storage/app/public/undangan/{logos,ttd}/` |
| 6.5 | Undangan Preview endpoint | Generate PDF via DomPDF, return sebagai response inline | ✅ `UndanganController@preview` → `$pdf->stream()` |
| 6.6 | Undangan Download endpoint | Generate PDF via DomPDF, return sebagai download | ✅ `UndanganController@download` → `$pdf->download()` |
| 6.7 | PDF Blade template | Undangan layout, Masukkan semua data dinamis | ✅ `resources/views/pdf/undangan.blade.php` — full formal letter layout with logo, TTD, data fields |
| 6.8 | Preview modal/iframe | Tampilkan PDF preview di modal sebelum download | ✅ Preview opens in new tab; Download/Preview buttons on Sidang Show + Undangan Show pages |
| 6.9 | Undangan Show | Lihat detail undangan yang sudah dibuat | ✅ `User/Undangan/Show.tsx` + `UndanganController@show` |
| 6.10 | Undangan Delete | Hapus undangan | ✅ `UndanganController@destroy` — cleans up storage files too |

**Output:** User bisa membuat, preview, dan download undangan PDF

---

### Phase 7: Polish & Refinement

| # | Task | Detail |
|---|---|---|
| 7.1 | Responsive layout | Pastikan semua halaman responsif |
| 7.2 | Loading states | Spinner/skeleton saat loading |
| 7.3 | Error handling | Flash messages, validation error display |
| 7.4 | Success toasts | Notifikasi setelah CRUD actions |
| 7.5 | Confirm dialogs | Konfirmasi sebelum hapus |
| 7.6 | Empty states | Tampilkan pesan jika tidak ada data |
| 7.7 | Breadcrumb navigation | Navigasi antar halaman |
| 7.8 | Date format localization | Format tanggal Bahasa Indonesia |

---

## 7. Key Code Snippets

### 7.1 Dosen Role Detection

```php
private function getDosenRoleInSidang(int $dosenId, Sidang $sidang): string
{
    return match($dosenId) {
        $sidang->pembimbing1_id => 'Pembimbing 1',
        $sidang->pembimbing2_id => 'Pembimbing 2',
        $sidang->penguji1_id => 'Penguji 1',
        $sidang->penguji2_id => 'Penguji 2',
        $sidang->pimpinan_sidang_id => 'Pimpinan Sidang',
        default => 'Dosen',
    };
}
```

### 7.2 PDF Generation

```php
use Barryvdh\DomPDF\Facade\Pdf;

public function download(Undangan $undangan)
{
    $undangan->load([
        'sidang.mahasiswa',
        'sidang.pembimbing1',
        'sidang.pembimbing2',
        'sidang.penguji1',
        'sidang.penguji2',
        'sidang.pimpinanSidang',
        'sidang.jadwalSidang.pic',
        'dosen',
    ]);

    $dosenRole = $this->getDosenRoleInSidang($undangan->dosen_id, $undangan->sidang);

    $pdf = Pdf::loadView('pdf.undangan', [
        'undangan' => $undangan,
        'dosenRole' => $dosenRole,
    ])->setPaper('a4', 'portrait');

    $filename = 'undangan-sidang-' . $undangan->sidang->mahasiswa->nim . '.pdf';

    return $pdf->download($filename);
}
```

### 7.3 User Scoping

```php
class SidangController extends Controller
{
    public function index()
    {
        $sidang = Sidang::where('user_id', auth()->id())
            ->with([
                'mahasiswa',
                'pembimbing1',
                'pembimbing2',
                'penguji1',
                'penguji2',
                'pimpinanSidang',
                'jadwalSidang',
            ])
            ->withCount('undangan')
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Sidang/Index', [
            'sidang' => $sidang,
        ]);
    }
}
```

### 7.4 File Upload

```php
$logoPath = $request->file('header_logo')
    ?->store('undangan/logos', 'public');

$ttdPath = $request->file('ttd_image')
    ?->store('undangan/ttd', 'public');

$undangan = Undangan::create([
    'user_id' => auth()->id(),
    'sidang_id' => $request->sidang_id,
    'dosen_id' => $request->dosen_id,
    'header_logo' => $logoPath,
    'ttd_image' => $ttdPath,
    'deskripsi' => $request->deskripsi,
]);
```

---

## 8. Dependencies

### Composer

```json
{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "laravel/breeze": "^2.0",
        "barryvdh/laravel-dompdf": "^3.0",
        "inertiajs/inertia-laravel": "^2.0"
    }
}
```

### NPM

```json
{
    "dependencies": {
        "@inertiajs/react": "^2.0",
        "react": "^18.3",
        "react-dom": "^18.3",
        "@radix-ui/react-dialog": "...",
        "@radix-ui/react-dropdown-menu": "...",
        "@radix-ui/react-label": "...",
        "@radix-ui/react-select": "...",
        "@radix-ui/react-slot": "...",
        "class-variance-authority": "...",
        "clsx": "...",
        "tailwind-merge": "...",
        "lucide-react": "..."
    }
}
```

---

## 9. Testing Strategy

| Area | Test Type | Cakupan |
|---|---|---|
| Authentication | Feature Test | Login, logout, role redirect |
| Admin CRUD | Feature Test | Create, read, update, delete semua entity |
| Sidang CRUD | Feature Test | User scoped CRUD, admin view all |
| Authorization | Feature Test | User tidak bisa akses route admin |
| PDF Generation | Feature Test | PDF terbuat, data valid, file download |
| File Upload | Feature Test | Upload valid, validasi file type/size |
| Validation | Feature Test | Required fields, unique NIM/inisial/email |

---

## 10. File Checklist

### Backend (~30 files)

| Kategori | File |
|---|---|
| Migrations | 9 files (includes default Laravel migrations) |
| Models | 7 files |
| Controllers | 10 files (6 Admin + 4 User) |
| Form Requests | 13 files |
| Policies | 3 files |
| Middleware | 1 file |
| Seeders | 5 files |
| Views | 1 PDF template |

### Frontend (~30 files)

| Kategori | File |
|---|---|
| Core | 2 files (app.tsx, ssr.tsx) |
| Types | 1 file |
| Layouts | 2 files |
| Components | ~10 files (sidebar, navbar, shadcn/ui) |
| Auth Pages | 2 files |
| Admin Pages | ~12 files |
| User Pages | ~9 files |

### Config (~5 files)

| Kategori | File |
|---|---|
| .env | 1 file |
| routes/web.php | 1 file |
| config/auth.php | Modifikasi |
| tailwind.config.js | 1 file |
| tsconfig.json | 1 file |

**Total estimate: ~70 files**

---

## 11. Timeline Estimate

| Fase | Estimasi Waktu |
|---|---|
| Phase 1: Scaffold & Setup | 30 menit |
| Phase 2: Auth & Authorization | 45 menit |
| Phase 3: Migrations & Models | 45 menit |
| Phase 4: Admin Panel | 90 menit |
| Phase 5: User Sidang & Jadwal | 90 menit |
| Phase 6: Undangan PDF | 90 menit |
| Phase 7: Polish | 60 menit |
| **Total** | **~7.5 jam** |

---

## 12. Notes

- **User hanya didaftarkan oleh admin** — Tidak ada self-registration
- **Layout undangan fixed** — Template PDF sudah tetap, user hanya upload logo dan TTD
- **PIC adalah entitas terpisah** — Dikelola admin sebagai data master
- **Satu sidang = satu jadwal** — Relasi one-to-one (unique key)
- **Satu sidang bisa punya banyak undangan** — Satu per dosen yang terlibat
- **Dosen selection** — Saat membuat undangan, hanya dosen yang terlibat di sidang tersebut yang muncul sebagai pilihan
