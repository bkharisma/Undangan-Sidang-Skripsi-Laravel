<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProgramStudiRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'kode' => [
                'required', 'string', 'max:20',
                Rule::unique('program_studi', 'kode')->ignore($this->route('program_studi')),
            ],
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
