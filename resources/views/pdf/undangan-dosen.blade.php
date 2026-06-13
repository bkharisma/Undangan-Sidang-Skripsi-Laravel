<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Undangan Sidang Skripsi</title>
    <style>
        @page {
            margin: 2cm 1.5cm 2cm 1.5cm;
        }
        body {
            font-family: "DejaVu Sans", sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #000;
        }
        .header {
            text-align: center;
            margin-bottom: 16px;
        }
        .header img.logo {
            max-height: 60px;
            margin-bottom: 6px;
        }
        .header img.header-full {
            width: 100%;
            margin-bottom: 6px;
        }
        .header h3 {
            margin: 2px 0;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header p {
            margin: 2px 0;
            font-size: 10pt;
        }
        hr {
            border: none;
            border-top: 2px solid #000;
            margin: 12px 0;
        }
        hr.thin {
            border-top: 1px solid #000;
            margin: 8px 0;
        }
        .letter-meta {
            margin-bottom: 12px;
        }
        .letter-meta p {
            margin: 2px 0;
        }
        .recipient {
            margin-bottom: 12px;
        }
        .recipient p {
            margin: 2px 0;
        }
        .description {
            margin-bottom: 10px;
            text-align: justify;
        }
        .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 9pt;
        }
        .schedule-table th {
            background-color: #eee;
            border: 1px solid #000;
            padding: 5px 4px;
            text-align: center;
            font-weight: bold;
        }
        .schedule-table td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
        }
        .schedule-table .no {
            width: 28px;
            text-align: center;
        }
        .schedule-table .peran {
            width: 80px;
            text-align: center;
        }
        .closing {
            margin-top: 14px;
            text-align: justify;
        }
        .signature {
            margin-top: 30px;
            text-align: right;
        }
        .signature img {
            max-height: 90px;
            margin-bottom: 4px;
        }
        .signature p {
            margin: 2px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        @if($headerImageBase64)
            <img src="{{ $headerImageBase64 }}" alt="Header" class="header-full">
        @else
            @if($logoBase64)
                <img src="{{ $logoBase64 }}" alt="Logo" class="logo">
            @endif
            <h3>{{ config('app.name', 'Universitas') }}</h3>
            <p>{{ config('app.universitas_fakultas', 'Fakultas') }}</p>
        @endif
    </div>

    <hr>

    <div class="letter-meta">
        <p>Nomor &nbsp;&nbsp;&nbsp;&nbsp;: {{ $undangan->nomor_surat }}</p>
        <p>Lampiran : -</p>
        <p>Perihal &nbsp;&nbsp;: Undangan Sidang Skripsi</p>
    </div>

    <div class="recipient">
        <p>Kepada Yth.</p>
        <p><strong>Bapak/Ibu {{ $undangan->dosen->nama }}</strong></p>
        <p>Dosen Politeknik Pariwisata Palembang</p>
    </div>

    @if(($templateDeskripsi ?? null) !== null && ($templateDeskripsi ?? null) !== '')
    <div class="description">
        <p>{{ $templateDeskripsi }}</p>
    </div>
    @endif

    <p>Berikut adalah daftar jadwal sidang skripsi yang melibatkan Bapak/Ibu:</p>

    <table class="schedule-table">
        <thead>
            <tr>
                <th class="no">No</th>
                <th>Hari / Tanggal</th>
                <th>Waktu</th>
                <th>Ruangan</th>
                <th>Nama Mahasiswa</th>
                <th>NIM</th>
                <th>Judul Skripsi</th>
                <th class="peran">Peran</th>
            </tr>
        </thead>
        <tbody>
            @forelse($sidangList as $i => $s)
            <tr>
                <td class="no">{{ $i + 1 }}</td>
                <td>{{ formatTanggalIndonesia($s['hari_tanggal'], 'l, d F Y') }}</td>
                <td>{{ $s['waktu'] }}</td>
                <td>{{ $s['ruangan'] }}</td>
                <td>{{ $s['nama_mahasiswa'] }}</td>
                <td>{{ $s['nim'] }}</td>
                <td>{{ $s['judul_skripsi'] }}</td>
                <td class="peran">{{ $s['peran'] }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align: center;">Tidak ada jadwal sidang.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="closing">
        <p>Demikian undangan ini kami sampaikan. Atas perhatian dan kehadiran Bapak/Ibu, kami ucapkan terima kasih.</p>
    </div>

    <div class="signature">
        <p>{{ $ttdKota ?? config('app.universitas_kota', 'Kota') }}, {{ formatTanggalIndonesia(\Carbon\Carbon::now(), 'd F Y') }}</p>
        @if($ttdJabatan ?? null)
        <p>{{ $ttdJabatan }}</p>
        @endif
        <p>&nbsp;</p>
        @if($ttdBase64)
            <img src="{{ $ttdBase64 }}" alt="TTD">
        @endif
        <p>__________________________</p>
        <p><strong>{{ $ttdNama ?? config('app.universitas_pic', 'Panitia') }}</strong></p>
        @if($ttdNip ?? null)
        <p>NIP. {{ $ttdNip }}</p>
        @endif
    </div>
</body>
</html>
