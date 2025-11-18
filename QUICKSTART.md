# ⚡ Quick Start Guide

Halo! Ingin langsung mulai menggunakan aplikasi ini? Ikuti panduan singkat ini dan Anda akan siap dalam 5 menit! 🚀

## 📋 Yang Diperlukan

Sebelum mulai, pastikan Anda punya:

- ✅ **Node.js** versi 18 atau lebih baru (cek dengan `node --version`)
- ✅ **PostgreSQL** database (atau gunakan SQLite untuk development)
- ✅ **API Keys** untuk:
  - Firecrawl (untuk scraping)
  - OpenAI atau OpenRouter (untuk AI)

> 💡 **Tips**: Jika belum punya PostgreSQL, bisa pakai SQLite dulu untuk test!

## 🎯 Setup Cepat (5 Menit)

### 1️⃣ Install Dependencies

Buka terminal di folder project dan jalankan:

```bash
npm install
```

Tunggu sampai selesai (biasanya 1-2 menit).

### 2️⃣ Buat File .env

Buat file `.env` di root folder dan isi dengan ini:

```env
# Database (pakai SQLite untuk mudah)
DATABASE_URL="file:./dev.db"

# API Keys (WAJIB!)
FIRECRAWL_API_KEY=your_firecrawl_key
OPENAI_API_KEY=your_openai_key

# Server
PORT=3000
```

> 🔑 **Cara Dapatkan API Keys:**
> - Firecrawl: https://firecrawl.dev (sign up gratis)
> - OpenAI: https://platform.openai.com (butuh credit card)
> - OpenRouter: https://openrouter.ai (alternatif yang lebih murah)

### 3️⃣ Setup Database

Jalankan 2 perintah ini:

```bash
npm run db:generate
npm run db:push
```

Selesai! Database sudah siap. 🎉

### 4️⃣ Jalankan Aplikasi

```bash
npm run dev
```

Jika berhasil, Anda akan melihat:
```
API running on 3000
Scheduler initialized. Will run every 2 hours
```

**Selamat! Aplikasi Anda sudah berjalan!** 🎊

## 🧪 Test Aplikasi

### Cara Termudah: Pakai Halaman Test HTML

1. Buka file `test-api.html` di browser
2. Klik tombol "Test" pada Health Check
3. Jika status OK, berarti semua berjalan dengan baik!

### Atau Test via Browser

Buka di browser:
- http://localhost:3000/api/health
- http://localhost:3000/api/posts
- http://localhost:3000/api/hotels

### Test Scrape Hotel

```bash
curl -X POST http://localhost:3000/api/hotels/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.expedia.com/hotel/..."}'
```

### Test Buat Post

```bash
curl -X POST http://localhost:3000/api/posts/create
```

### Test Chatbot

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend a hotel"}'
```

## 🔄 Workflow Otomatis

Setelah setup, sistem akan otomatis:

1. **Setiap 2 jam** - Pilih hotel yang belum digunakan
2. **Generate konten** - AI membuat konten menarik
3. **Publish** - Simpan ke database
4. **Share** - Post ke Twitter & LinkedIn (jika dikonfigurasi)

### Test Langsung (Tanpa Tunggu 2 Jam)

Tambahkan ini di `.env`:

```env
RUN_ON_STARTUP=true
```

Sistem akan langsung jalan saat startup! 🚀

## 🎯 Langkah Selanjutnya

Setelah aplikasi berjalan:

1. **Setup Social Media** - Tambahkan Twitter & LinkedIn credentials di `.env`
2. **Scrape Hotel** - Tambahkan beberapa hotel menggunakan endpoint `/api/hotels/scrape`
3. **Integrasi Mobile** - Lihat `lynx-rn-example.md` untuk contoh integrasi
4. **Customize** - Edit prompt di `src/agent/contentAgent.ts` untuk konten yang lebih sesuai

## 🐛 Troubleshooting

### Database Error?

```bash
# Pastikan PostgreSQL berjalan (jika pakai PostgreSQL)
# Atau pastikan format DATABASE_URL benar
DATABASE_URL="postgresql://user:password@host:port/database"
```

### API Key Error?

- Pastikan semua API keys sudah diisi di `.env`
- Cek apakah API key masih valid
- Restart aplikasi setelah mengubah `.env`

### Scraping Gagal?

- Firecrawl mungkin perlu disesuaikan untuk website tertentu
- Cek apakah URL hotel valid
- Cek quota Firecrawl API Anda

### Social Media Posting Gagal?

- Pastikan OAuth tokens masih valid
- Cek permissions dan scopes API
- Lihat error di database tabel `SocialMediaPost`

## 🚀 Production Deployment

Siap untuk production? Ikuti langkah ini:

1. Set `NODE_ENV=production` di `.env`
2. Gunakan database production (bukan localhost)
3. Setup reverse proxy (nginx) untuk HTTPS
4. Konfigurasi CORS untuk domain spesifik
5. Setup monitoring dan logging
6. Gunakan API keys production

## 📚 Butuh Bantuan Lebih?

- 📖 Lihat `README.md` untuk dokumentasi lengkap
- 🇮🇩 Lihat `CARA_JALANKAN.md` untuk panduan bahasa Indonesia
- 📱 Lihat `lynx-rn-example.md` untuk integrasi mobile app

---

**Selamat mencoba! Semoga berhasil! 🎉**
