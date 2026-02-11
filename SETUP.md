# Setup GitHub + clasp + Google Apps Script

Dokumen ini untuk memastikan app web lokal dari repo ini tersambung ke Google Apps Script.

## 1) Prasyarat
- Node.js 18+
- Akses Google account ke spreadsheet:
  - `1HWNKazkmqHN9xvEV18WxImkxKFzzL64_Ab16v4px4Pk`
- Deployment Web App aktif:
  - `https://script.google.com/macros/s/AKfycbw0-Yhc2MNtVqV8FKfMlQV4_7dxrnOLDyqfrWl6lkiqGRlFyUlC9i3QXE59N2AbTDRX/exec`

## 2) Install dependency
```bash
npm install
```

## 3) Login clasp
```bash
npm run clasp:login
```

## 4) Koneksi repo ini ke Apps Script
1. Copy file template:
   ```bash
   cp .clasp.json.example .clasp.json
   ```
2. Cek koneksi:
   ```bash
   npm run clasp:status
   ```

## 5) Push perubahan dari GitHub repo ke GAS
```bash
npm run clasp:push
```

## 6) Deploy versi baru Web App
```bash
npm run clasp:deploy
```

## 7) Verifikasi endpoint
- Buka URL berikut di browser:
  - `https://script.google.com/macros/s/AKfycbw0-Yhc2MNtVqV8FKfMlQV4_7dxrnOLDyqfrWl6lkiqGRlFyUlC9i3QXE59N2AbTDRX/exec?action=listClients`
- Jika benar, endpoint mengembalikan JSON list klien.

## 8) Jalankan front-end lokal
```bash
npm run dev
```

## Catatan penting
- Jika deployment baru dibuat, update URL di `index.html` atau set `window.GAS_WEB_APP_URL`.
- Untuk workflow tim: edit di branch GitHub -> merge -> `clasp push` -> `clasp deploy`.
