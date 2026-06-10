<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramStudiRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'kode' => ['required', 'string', 'max:20', 'unique:program_studi,kode'],
            'nama' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'kode.required' => 'Kode program studi wajib diisi.',
            'kode.unique' => 'Kode program studi sudah digunakan.',
            'nama.required' => 'Nama program studi wajib diisi.',
        ];
    }
}
