# Website Pelaporan Kerusakan Kampus

Next.js project scaffold untuk pelaporan kerusakan fasilitas kampus dengan area user, dashboard admin, upload foto, tracking status, dan integrasi Supabase.

## Struktur Utama

- `src/app/laporan` untuk form laporan user
- `src/app/tracking` untuk tracking status laporan
- `src/app/admin` untuk dashboard admin
- `src/lib/supabase` untuk koneksi Supabase
- `src/lib/reports.ts` untuk query dan workflow laporan
- `supabase/schema.sql` untuk struktur database awal

## Environment

Salin `.env.example` ke `.env.local` lalu isi kredensial Supabase.

## Jalankan

```bash
npm install
npm run dev
```

## Quick checks

Periksa environment Supabase sebelum menjalankan aplikasi:

```bash
# Pastikan Anda sudah membuat .env.local dari .env.example
npm run check:supabase
```