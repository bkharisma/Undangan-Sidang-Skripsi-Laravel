<?php

if (! function_exists('formatTanggalIndonesia')) {
    function formatTanggalIndonesia($date, string $format = 'd F Y'): string
    {
        if (! $date) {
            return '-';
        }

        $carbon = $date instanceof \Carbon\Carbon
            ? $date
            : \Carbon\Carbon::parse($date);

        $hari = [
            'Sunday' => 'Minggu',
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
        ];

        $bulan = [
            'January' => 'Januari',
            'February' => 'Februari',
            'March' => 'Maret',
            'April' => 'April',
            'May' => 'Mei',
            'June' => 'Juni',
            'July' => 'Juli',
            'August' => 'Agustus',
            'September' => 'September',
            'October' => 'Oktober',
            'November' => 'November',
            'December' => 'Desember',
        ];

        $result = $carbon->format($format);

        return strtr($result, array_merge($hari, $bulan));
    }
}
