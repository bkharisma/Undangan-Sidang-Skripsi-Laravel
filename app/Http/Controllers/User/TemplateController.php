<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class TemplateController extends Controller
{
    public function edit(): Response
    {
        $template = Template::firstOrCreate([]);

        return Inertia::render('User/Template/Edit', [
            'template' => $template,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'header_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:4096'],
            'header_logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'ttd_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'deskripsi' => ['nullable', 'string'],
            'ttd_kota' => ['nullable', 'string', 'max:100'],
            'ttd_jabatan' => ['nullable', 'string', 'max:200'],
            'ttd_nama' => ['nullable', 'string', 'max:200'],
            'ttd_nip' => ['nullable', 'string', 'max:50'],
        ], [
            'header_image.image' => 'Header image harus berupa gambar.',
            'header_image.max' => 'Ukuran header image maksimal 4MB.',
            'header_logo.image' => 'Header logo harus berupa gambar.',
            'header_logo.max' => 'Ukuran header logo maksimal 2MB.',
            'ttd_image.image' => 'TTD harus berupa gambar.',
            'ttd_image.max' => 'Ukuran TTD maksimal 2MB.',
        ]);

        $template = Template::firstOrCreate([]);
        $data = [
            'deskripsi' => $request->input('deskripsi'),
            'ttd_kota' => $request->input('ttd_kota'),
            'ttd_jabatan' => $request->input('ttd_jabatan'),
            'ttd_nama' => $request->input('ttd_nama'),
            'ttd_nip' => $request->input('ttd_nip'),
        ];

        if ($request->hasFile('header_image')) {
            if ($template->header_image) {
                Storage::disk('public')->delete($template->header_image);
            }
            $data['header_image'] = $request->file('header_image')->store('template', 'public');
        }

        if ($request->hasFile('header_logo')) {
            if ($template->header_logo) {
                Storage::disk('public')->delete($template->header_logo);
            }
            $data['header_logo'] = $request->file('header_logo')->store('template', 'public');
        }

        if ($request->hasFile('ttd_image')) {
            if ($template->ttd_image) {
                Storage::disk('public')->delete($template->ttd_image);
            }
            $data['ttd_image'] = $request->file('ttd_image')->store('template', 'public');
        }

        $template->update($data);

        return redirect()->route('template.edit')
            ->with('success', 'Template berhasil diperbarui.');
    }

    public function preview(): HttpResponse
    {
        $template = Template::first();

        $data = [
            'headerImageBase64' => null,
            'logoBase64' => null,
            'ttdBase64' => null,
            'ttdJabatan' => $template?->ttd_jabatan,
            'ttdNama' => $template?->ttd_nama,
            'ttdNip' => $template?->ttd_nip,
            'ttdKota' => $template?->ttd_kota,
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

        $pdf = Pdf::loadView('pdf.template-preview', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->stream('preview-template.pdf');
    }
}
