<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDosenRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'inisial' => ['required', 'string', 'max:10', 'unique:dosen,inisial'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama dosen wajib diisi.',
            'inisial.required' => 'Inisial wajib diisi.',
            'inisial.unique' => 'Inisial sudah digunakan.',
        ];
    }
}
