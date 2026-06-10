<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUndanganRequest;
use App\Http\Requests\UpdateUndanganRequest;
use App\Models\Dosen;
use App\Models\Sidang;
use App\Models\Template;
use App\Models\Undangan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UndanganController extends Controller
{
    public function index(Request $request): Response
    {
        $undangan = Undangan::where('user_id', $request->user()->id)
            ->with(['dosen'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/Undangan/Index', [
            'undangan' => $undangan,
        ]);
    }

    public function create(Request $request): Response
    {
        $dosenList = Dosen::orderBy('nama')->get()->map(fn ($d) => [
            'id' => $d->id,
            'nama' => $d->nama,
            'inisial' => $d->inisial,
        ]);

        $nomorSuratSuggestion = $this->generateNomorSuratSuggestion();

        return Inertia::render('User/Undangan/Create', [
            'dosenList' => $dosenList,
            'nomorSuratSuggestion' => $nomorSuratSuggestion,
        ]);
    }

    public function dosenSchedules(Request $request): JsonResponse
    {
        $request->validate(['dosen_id' => 'required|exists:dosen,id']);
        $dosenId = (int) $request->input('dosen_id');

        $dosen = Dosen::findOrFail($dosenId);

        $sidangList = Sidang::where(function ($q) use ($dosenId) {
            $q->where('penguji1_id', $dosenId)
                ->orWhere('penguji2_id', $dosenId)
                ->orWhere('pimpinan_sidang_id', $dosenId);
        })
            ->with(['jadwalSidang.ruangan', 'jadwalSidang.jam', 'mahasiswa'])
            ->get();

        $result = [];
        $no = 1;
        foreach ($sidangList as $sidang) {
            $role = match ($dosenId) {
                $sidang->penguji1_id => 'Penguji 1',
                $sidang->penguji2_id => 'Penguji 2',
                $sidang->pimpinan_sidang_id => 'Pimpinan Sidang',
                default => 'Dosen',
            };

            $jadwal = $sidang->jadwalSidang;

            $result[] = [
                'no' => $no++,
                'sidang_id' => $sidang->id,
                'hari_tanggal' => $jadwal?->tanggal?->format('Y-m-d'),
                'ruangan' => $jadwal?->ruangan?->nama ?? '-',
                'waktu' => $jadwal && $jadwal->jam
                    ? $jadwal->jam->jam_mulai . ' - ' . $jadwal->jam->jam_selesai
                    : '-',
                'kode_dosen' => $dosen->inisial,
                'keterangan' => $role,
                'nama_mahasiswa' => $sidang->mahasiswa?->nama ?? '-',
                'prodi' => $sidang->mahasiswa?->program_studi ?? '-',
            ];
        }

        return response()->json($result);
    }

    public function store(StoreUndanganRequest $request): RedirectResponse
    {
        $dosenId = (int) $request->input('dosen_id');
        $userId = $request->user()->id;

        $exists = Undangan::where('user_id', $userId)
            ->where('dosen_id', $dosenId)
            ->exists();

        if ($exists) {
            return redirect()->route('undangan.index')
                ->with('error', 'Undangan untuk dosen ini sudah ada. Hapus undangan yang lama terlebih dahulu.');
        }

        $sidangList = Sidang::where(function ($q) use ($dosenId) {
            $q->where('penguji1_id', $dosenId)
                ->orWhere('penguji2_id', $dosenId)
                ->orWhere('pimpinan_sidang_id', $dosenId);
        })->get();

        if ($sidangList->isEmpty()) {
            return redirect()->route('undangan.index')
                ->with('error', 'Tidak ada sidang yang melibatkan dosen tersebut.');
        }

        $nomorSurat = $request->input('nomor_surat')
            ?: $this->generateNomorSuratSuggestion();

        $undangan = Undangan::create([
            'user_id' => $userId,
            'dosen_id' => $dosenId,
            'nomor_surat' => $nomorSurat,
        ]);

        return redirect()->route('undangan.show', $undangan)
            ->with('success', 'Undangan berhasil dibuat.');
    }

    public function show(Undangan $undangan): Response
    {
        Gate::authorize('view', $undangan);

        $undangan->load(['dosen']);

        $sidangList = $undangan->sidang_list;

        return Inertia::render('User/Undangan/Show', [
            'undangan' => $undangan,
            'sidangList' => $sidangList,
        ]);
    }

    public function edit(Undangan $undangan): Response
    {
        Gate::authorize('update', $undangan);

        $undangan->load(['dosen']);

        return Inertia::render('User/Undangan/Edit', [
            'undangan' => $undangan,
        ]);
    }

    public function update(UpdateUndanganRequest $request, Undangan $undangan): RedirectResponse
    {
        Gate::authorize('update', $undangan);

        $undangan->update([
            'nomor_surat' => $request->input('nomor_surat'),
        ]);

        return redirect()->route('undangan.show', $undangan)
            ->with('success', 'Nomor surat berhasil diperbarui.');
    }

    public function destroy(Undangan $undangan): RedirectResponse
    {
        Gate::authorize('delete', $undangan);

        $undangan->delete();

        return redirect()->route('undangan.index')->with('success', 'Undangan berhasil dihapus.');
    }

    public function preview(Undangan $undangan): HttpResponse
    {
        Gate::authorize('view', $undangan);

        return $this->generatePdf($undangan, inline: true);
    }

    public function download(Undangan $undangan): HttpResponse
    {
        Gate::authorize('view', $undangan);

        return $this->generatePdf($undangan, inline: false);
    }

    private function generatePdf(Undangan $undangan, bool $inline): HttpResponse
    {
        $undangan->load(['dosen']);

        $sidangList = $undangan->sidang_list;

        $template = Template::first();

        $data = [
            'undangan' => $undangan,
            'sidangList' => $sidangList,
            'headerImageBase64' => null,
            'logoBase64' => null,
            'ttdBase64' => null,
        ];

        if ($template?->header_image) {
            $path = Storage::disk('public')->path($template->header_image);
            if (file_exists($path)) {
                $ext = pathinfo($template->header_image, PATHINFO_EXTENSION);
                $data['headerImageBase64'] = 'data:image/' . $ext . ';base64,' . base64_encode(file_get_contents($path));
            }
        }

        if ($template?->header_logo) {
            $path = Storage::disk('public')->path($template->header_logo);
            if (file_exists($path)) {
                $ext = pathinfo($template->header_logo, PATHINFO_EXTENSION);
                $data['logoBase64'] = 'data:image/' . $ext . ';base64,' . base64_encode(file_get_contents($path));
            }
        }

        if ($template?->ttd_image) {
            $path = Storage::disk('public')->path($template->ttd_image);
            if (file_exists($path)) {
                $ext = pathinfo($template->ttd_image, PATHINFO_EXTENSION);
                $data['ttdBase64'] = 'data:image/' . $ext . ';base64,' . base64_encode(file_get_contents($path));
            }
        }

        $data['templateDeskripsi'] = $template?->deskripsi;
        $data['ttdKota'] = $template?->ttd_kota;
        $data['ttdJabatan'] = $template?->ttd_jabatan;
        $data['ttdNama'] = $template?->ttd_nama;
        $data['ttdNip'] = $template?->ttd_nip;

        $pdf = Pdf::loadView('pdf.undangan-dosen', $data)
            ->setPaper('a4', 'portrait');

        $inisial = str_replace(' ', '-', $undangan->dosen->inisial ?? 'dosen');
        $filename = 'undangan-sidang-' . $inisial . '.pdf';

        return $inline ? $pdf->stream($filename) : $pdf->download($filename);
    }

    private function generateNomorSuratSuggestion(): string
    {
        $bulanRomawi = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV',
            5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII',
            9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII',
        ];

        $bulan = (int) date('m');
        $tahun = date('Y');

        $count = Undangan::whereMonth('created_at', $bulan)
            ->whereYear('created_at', $tahun)
            ->count();

        $seq = str_pad((string) ($count + 1), 3, '0', STR_PAD_LEFT);

        return "UND-{$seq}/{$bulanRomawi[$bulan]}/{$tahun}";
    }

}
