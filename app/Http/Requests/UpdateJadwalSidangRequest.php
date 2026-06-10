<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJadwalSidangRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'tanggal' => ['required', 'date'],
            'ruangan_id' => ['required', 'exists:ruangan,id'],
            'jam_id' => ['required', 'exists:jam,id'],
            'pic_id' => ['required', 'exists:pic,id'],
        ];
    }
}
