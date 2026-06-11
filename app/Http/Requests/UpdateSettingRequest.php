<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'app_logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'app_name' => ['nullable', 'string', 'max:100'],
            'app_deskripsi' => ['nullable', 'string'],
            'favicon' => ['nullable', 'image', 'mimes:jpeg,png,ico,svg', 'max:512'],
        ];
    }

    public function messages(): array
    {
        return [
            'app_logo.image' => 'Logo harus berupa gambar.',
            'app_logo.max' => 'Ukuran logo maksimal 2MB.',
            'favicon.image' => 'Favicon harus berupa gambar.',
            'favicon.max' => 'Ukuran favicon maksimal 512KB.',
        ];
    }
}
