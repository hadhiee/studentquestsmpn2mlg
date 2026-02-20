# Panduan Deployment ke Vercel

Panduan ini akan membantu Anda mengonlinekan game **Student Quest: Edisi Dinasti Umayyah** menggunakan Vercel, serta menghubungkannya dengan database Supabase.

## 1. Persiapan Supabase untuk Production

Supabase perlu tahu bahwa Anda akan menggunakan domain `simonic-ic.vercel.app` untuk login.

1.  Buka Dashboard Supabase Anda: https://supabase.com/dashboard/
2.  Pilih Project Anda.
3.  Masuk ke menu **Authentication** > **URL Configuration**.
4.  Tambahkan domain Anda di bagian **Site URL**:
    -   Isi dengan: `https://simonic-ic.vercel.app`
5.  Tambahkan URL Redirect di bagian **Redirect URLs**:
    -   Klik **Add URL**
    -   Masukkan: `https://simonic-ic.vercel.app/**` (Tanda `**` berarti semua sub-halaman diizinkan, meskipun aplikasi kita SPA).
    -   Pastikan `http://localhost:3000/**` juga masih ada agar Anda tetap bisa testing di lokal.

## 2. Deployment ke Vercel

Ada dua cara untuk deploy: Menggunakan GitHub (Disarankan) atau Vercel CLI.

### Cara A: Melalui GitHub (Disarankan)
1.  Upload kode proyek ini ke repository GitHub baru.
2.  Buka [vercel.com](https://vercel.com) dan login.
3.  Klik **Add New...** > **Project**.
4.  Import repository GitHub yang baru saja Anda buat.
5.  Konfigurasi Project:
    -   **Framework Preset**: Vite (biasanya terdeteksi otomatis).
    -   **Root Directory**: `./` (biarkan default).
    -   **Environment Variables**:
        Expand bagian ini dan masukkan 2 variable penting yang ada di file `.env.local` Anda:
        -   `VITE_SUPABASE_URL`: (Copy dari file .env.local Anda)
        -   `VITE_SUPABASE_ANON_KEY`: (Copy dari file .env.local Anda)

6.  Klik **Deploy**.

### Cara B: Melalui Terminal (Vercel CLI)
Jika Anda sudah menginstall Vercel CLI (`npm i -g vercel`):

1.  Jalankan perintah ini di terminal project:
    ```bash
    vercel
    ```
2.  Ikuti instruksi di layar:
    -   Set up and deploy? **Y**
    -   Which scope? (Pilih akun Anda)
    -   Link to existing project? **N**
    -   Project name? **studentquestsmpn2mlg** (atau nama lain)
    -   In which directory? **./**
    -   Want to modify these settings? **N** (Vite biasanya sudah otomastis)
    -   **PENTING**: Ketika ditanya apakah ingin override settings, pilih **No** KECUALI environment variables.
3.  Setelah deploy selesai, masuk ke Dashboard Vercel project tersebut.
4.  Pergi ke **Settings** > **Environment Variables**.
5.  Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` seperti langkah di atas.
6.  Redeploy project (bisa lewat tab Deployments > Redeploy) agar variable tersebut aktif.

## 3. Konfigurasi Google Cloud (PENTING)

Login Google tidak akan berhasil di domain baru jika tidak diizinkan di Google Cloud Console.

1.  Buka Google Cloud Console: https://console.cloud.google.com/
2.  Pilih Project yang Anda gunakan untuk `Client ID` Supabase.
3.  Masuk ke **APIs & Services** > **Credentials**.
4.  Klik nama **OAuth 2.0 Client ID** yang Anda gunakan.
5.  Di bagian **Authorized JavaScript origins**, tambahkan:
    -   `https://simonic-ic.vercel.app`
6.  Di bagian **Authorized redirect URIs**, tambahkan URL Callback dari Supabase Anda:
    -   Ini *biasanya* tetap sama: `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback`
    -   Jadi bagian ini **MUNGKIN TIDAK PERLU DIUBAH** jika Anda hanya mengubah frontend domain. Supabase yang menangani redirect.
    -   **NAMUN**: Pastikan Anda sudah menambahkan `https://simonic-ic.vercel.app` di Dashboard Supabase (Langkah 1).

## Troubleshooting

-   **Redirect Salah**: Jika setelah login Google Anda kembali ke `localhost` padahal sedang di Vercel, cek kembali **Site URL** di dashboard Supabase.
-   **Layar Putih / Error 404**: Cek apakah file `vercel.json` ada di root project isinya konfigurasi rewrite. (Sudah kami buatkan).
-   **Login Gagal/Diam**: Cek console browser (F12 > Console). Apakah ada error merah? Biasanya terkait "Authorized origin" di Google Cloud atau "Redirect URL" di Supabase.
