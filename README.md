# API Capstone Pengaduan

Backend API untuk pengelolaan pengaduan masyarakat. Dibangun dengan Node.js, Express, dan Prisma (MySQL).

## Teknologi
- Node.js + Express (type: module)
- Prisma ORM (MySQL)
- JWT untuk autentikasi
- Multer untuk upload lampiran

## Prasyarat
- Node.js LTS
- MySQL database dan kredensial

## Konfigurasi Lingkungan
1) Duplikasi `.env.example` menjadi `.env` dan isi nilai berikut:
   - `DATABASE_URL` (format mysql): `mysql://user:password@host:port/dbname`
   - `JWT_SECRET`: kunci rahasia JWT
   - `PORT`: port aplikasi (default 3000)
   - `FILE_STORAGE_PATH`: path penyimpanan file upload (misal `uploads/`)
   - Variabel email jika fitur email digunakan

## Menjalankan Secara Lokal
```bash
npm install
npx prisma migrate dev      # terapkan skema ke database lokal
npm run seed                # isi data awal admin, pimpinan, kategori (idempotent)
npm run dev                 # jalankan dengan nodemon
# atau
npm start                   # jalankan mode produksi lokal
```

## Skrip NPM
- `npm run dev` – start dengan nodemon
- `npm start` – start produksi lokal
- `npm run seed` – seeding admin + kategori

## Pengujian
Tes belum disiapkan (skrip `npm test` placeholder). Tambahkan Jest/Supertest sesuai kebutuhan sebelum digunakan di CI/CD.

## Checklist Deploy (Server Production)
1) **Siapkan environment**: salin `.env` berisi `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FILE_STORAGE_PATH`, dll.
2) **Install dependencies**: `npm ci --only=production` (atau `npm ci`).
3) **Migrasi DB**: `npx prisma migrate deploy` pada database produksi.
4) **Seeding (opsional sekali)**: `npm run seed` jika butuh data awal (admin, pimpinan, kategori). Seeding bersifat upsert.
5) **Jalankan aplikasi**:
   - Langsung: `node src/index.js`
   - Dengan PM2: `pm2 start src/index.js --name api-pengaduan`
6) **Reverse proxy/HTTPS**: konfigurasikan Nginx/Traefik untuk TLS, gzip, rate-limit, dan forward ke `PORT` aplikasi.
7) **File uploads**: pastikan folder `public/uploads` atau `uploads` ada dan bisa ditulis proses Node.
8) **Logging & monitoring**: arahkan log ke stdout/PM2, siapkan health check sederhana bila perlu.

## Operasional
- Migrasi di production: `npx prisma migrate deploy`
- Regenerate Prisma client (jika schema berubah): `npx prisma generate`
- Restore seeding aman dijalankan berulang (menggunakan upsert)

## Struktur Direktori Singkat
- `src/` – kode aplikasi (controllers, routes, services, middlewares)
- `prisma/` – `schema.prisma`, migrasi, `seed.js`
- `public/uploads` – aset statis/upload

Selamat menggunakan! Jika butuh contoh konfigurasi Nginx atau PM2 lebih rinci, tambahkan sesuai lingkungan server Anda.
