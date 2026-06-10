<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Preview Template</title>
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
        .content {
            margin: 20px 0;
        }
        .content p {
            margin: 4px 0;
        }
        .signature {
            margin-top: 40px;
            text-align: right;
        }
        .signature img {
            max-height: 50px;
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

    <div class="content">
        <p>Nomor &nbsp;&nbsp;&nbsp;&nbsp;: [Nomor Surat]</p>
        <p>Lampiran : -</p>
        <p>Perihal &nbsp;&nbsp;: Undangan Sidang Skripsi</p>
        <p>&nbsp;</p>
        <p>Kepada Yth.</p>
        <p><strong>[Nama Dosen]</strong></p>
        <p>&nbsp;</p>
        <p>[Isi surat akan ditampilkan sesuai data undangan yang dibuat.]</p>
    </div>

    <div class="signature">
        <p>{{ $ttdKota ?? config('app.universitas_kota', 'Kota') }}, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
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
