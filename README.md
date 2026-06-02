# Batik HM Akmal Catalog Website

Website katalog digital untuk Batik HM Akmal / Unggul Jaya Banyurip.

## Stack

- SvelteKit + TypeScript
- Tailwind CSS
- Supabase (Auth, PostgreSQL, Storage)
- Rule-based chatbot di website
- Mock adapter integrasi stok kasir

## Fitur yang disiapkan

- Landing page + profil UMKM
- Katalog produk Batik Cap (Cap 1 Warna, Cap 2 Warna)
- Filter berdasarkan jenis cap dan warna
- Detail produk sederhana
- Floating chatbot widget
- Tombol WhatsApp + rute lokasi
- Admin login (Supabase Auth) + dashboard baseline
- SQL migration + seed data

## Jalankan project

1. Install dependencies:

```bash
npm install
```

2. Salin environment:

```bash
cp .env.example .env
```

3. Isi variabel Supabase pada `.env`.

4. Jalankan dev server:

```bash
npm run dev
```

5. Build production:

```bash
npm run build
npm run preview
```

## Deploy VPS + Nginx + Cloudflare (ringkas)

- Gunakan output Node adapter (`@sveltejs/adapter-node`).
- Jalankan aplikasi Node pada port internal (mis. `3000`).
- Nginx sebagai reverse proxy ke Node app.
- Aktifkan SSL dan proxied DNS di Cloudflare.
- Simpan rahasia di environment server, bukan di source code.

## Database Supabase

- Migration: `supabase/migrations/0001_init.sql`
- Seed data: `supabase/seed.sql`

## Catatan

- Website ini bukan marketplace penuh.
- Tidak ada cart, checkout otomatis, pembayaran online, invoice, atau tracking pesanan.
- Pemesanan diarahkan via chatbot/WhatsApp setelah konfirmasi stok.
