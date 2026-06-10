<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSidangRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'mahasiswa_id' => ['required', 'exists:mahasiswa,id'],
            'judul_skripsi' => ['required', 'string', 'max:500'],
            'penguji1_id' => ['required', 'exists:dosen,id'],
            'penguji2_id' => ['required', 'exists:dosen,id'],
            'pimpinan_sidang_id' => ['required', 'exists:dosen,id'],
            'tanggal_ujian' => ['required', 'date'],
            'tahun_akademik' => ['required', 'string', 'size:5', 'regex:/^\d{4}[12]$/'],
            'ruangan_id' => ['nullable', 'exists:ruangan,id'],
            'jam_id' => ['nullable', 'exists:jam,id'],
            'pic_id' => ['nullable', 'exists:pic,id'],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
