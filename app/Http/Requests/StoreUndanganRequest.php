<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUndanganRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'dosen_id' => ['required', 'exists:dosen,id'],
            'nomor_surat' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'dosen_id.required' => 'Dosen target harus dipilih.',
        ];
    }
}
