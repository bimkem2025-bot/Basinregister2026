# Basinregister2026

Aplikasi register klien pemasyarakatan, dikembangkan di GitHub/Codex, dan backend menggunakan Google Apps Script + Google Sheets.

## Status koneksi GAS saat ini
- Deployment ID: `AKfycbw0-Yhc2MNtVqV8FKfMlQV4_7dxrnOLDyqfrWl6lkiqGRlFyUlC9i3QXE59N2AbTDRX`
- Web App URL: `https://script.google.com/macros/s/AKfycbw0-Yhc2MNtVqV8FKfMlQV4_7dxrnOLDyqfrWl6lkiqGRlFyUlC9i3QXE59N2AbTDRX/exec`
- Library URL: `https://script.google.com/macros/library/d/1POEKRDYBm7Q3c16XdH_kJygR9me-PBm4SlyFfK8AuPo8HuvnmjPKxC_p/3`

Front-end sudah default ke Web App URL di atas, tetapi tetap bisa dioverride dengan `window.GAS_WEB_APP_URL`.

## Fitur
- Cek klien existing dari `cur!E2:E` dengan searchable dropdown.
- Form entri klien baru jika tidak ditemukan.
- Perhitungan usia 2 mode (hari ini + tanggal acuan), format tahun-bulan-hari.
- Generate nomor register berdasarkan layanan + kelompok usia.
- Multi-register untuk multi layanan.
- Simpan data ke `register_input` pada spreadsheet yang sama.

## Alur GitHub + clasp + GAS
1. Kembangkan kode di repo GitHub ini.
2. Sinkronkan ke project Apps Script dengan `clasp push`.
3. Deploy versi terbaru menjadi Web App lewat `clasp deploy`.
4. Gunakan URL `/exec` hasil deployment untuk konsumsi front-end.

## Setup cepat
```bash
npm install
npm run clasp:login
cp .clasp.json.example .clasp.json
npm run clasp:status
npm run clasp:push
npm run clasp:deploy
```

## Jalankan UI lokal
```bash
npm run dev
```
Buka `http://localhost:4173`.
