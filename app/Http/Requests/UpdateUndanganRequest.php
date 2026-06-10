<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUndanganRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nomor_surat' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_surat.required' => 'Nomor surat harus diisi.',
        ];
    }
}
