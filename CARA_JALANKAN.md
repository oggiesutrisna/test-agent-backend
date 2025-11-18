# 🚀 Cara Menjalankan Aplikasi - Panduan Lengkap

Halo! Panduan ini akan membantu Anda menjalankan aplikasi dari awal sampai akhir. Ikuti langkah-langkahnya dengan sabar, dan Anda akan berhasil! 😊

## 📋 Yang Diperlukan Sebelum Mulai

Pastikan Anda sudah punya:

1. ✅ **Node.js** versi 18 atau lebih baru
   - Cek dengan: `node --version`
   - Download di: https://nodejs.org

2. ✅ **Database** (pilih salah satu):
   - PostgreSQL (lokal atau cloud)
   - SQLite (paling mudah untuk development!)

3. ✅ **API Keys**:
   - Firecrawl (untuk scraping) - https://firecrawl.dev
   - OpenAI atau OpenRouter (untuk AI) - https://platform.openai.com atau https://openrouter.ai

> 💡 **Tips**: Untuk pertama kali, gunakan SQLite + API keys minimal. Social media bisa ditambahkan nanti!

## 🎯 Langkah-langkah Setup (Ikuti Berurutan!)

### Langkah 1: Install Dependencies

Buka terminal (Command Prompt atau PowerShell) di folder project dan jalankan:

```bash
npm install
```

Tunggu sampai selesai. Ini akan menginstall semua package yang dibutuhkan (biasanya 1-2 menit).

> ⏳ **Sabarlah!** Proses ini mungkin terlihat lama, tapi normal kok.

### Langkah 2: Setup Database

Anda punya 2 pilihan:

#### Opsi A: SQLite (Paling Mudah! Recommended untuk Development)

**Tidak perlu install apapun!** Cukup set di `.env` nanti.

#### Opsi B: PostgreSQL

Jika ingin pakai PostgreSQL, lihat panduan lengkap di `setup-database.md`.

> 💡 **Rekomendasi**: Untuk pertama kali, pakai SQLite dulu. Lebih mudah!

### Langkah 3: Buat File .env

Buat file baru bernama `.env` di root folder project (sama level dengan `package.json`).

Copy-paste ini ke file `.env`:

```env
# Database (SQLite - Paling Mudah!)
DATABASE_URL="file:./dev.db"

# Firecrawl API (WAJIB - untuk scraping hotel)
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# OpenAI atau OpenRouter (WAJIB - untuk AI content generation)
OPENAI_API_KEY=your_openai_api_key_here
# ATAU gunakan OpenRouter (lebih murah)
# OPENROUTER_API_KEY=your_openrouter_api_key_here

# Image Generation (opsional)
IMAGE_API_KEY=your_image_api_key_here

# Twitter API (opsional - untuk posting ke Twitter)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

# LinkedIn API (opsional - untuk posting ke LinkedIn)
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_PERSON_URN=urn:li:person:your_person_id

# Server Configuration
PORT=3000
NODE_ENV=development

# Scheduler (cron job)
CRON_SCHEDULE="0 */2 * * *"  # Setiap 2 jam
RUN_ON_STARTUP=false  # Set true untuk test langsung saat startup
```

**⚠️ PENTING**: Ganti semua `your_...` dengan API keys yang sebenarnya!

> 🔑 **Cara Dapatkan API Keys:**
> - Firecrawl: Sign up di https://firecrawl.dev (ada free tier)
> - OpenAI: Sign up di https://platform.openai.com (butuh credit card)
> - OpenRouter: Sign up di https://openrouter.ai (lebih murah)

### Langkah 4: Generate Prisma Client

Jalankan perintah ini:

```bash
npm run db:generate
```

Ini akan generate Prisma client yang dibutuhkan untuk akses database.

### Langkah 5: Setup Database Schema

Jalankan perintah ini untuk membuat tabel di database:

```bash
npm run db:push
```

Jika berhasil, Anda akan melihat pesan sukses. Database sudah siap! 🎉

> 💡 **Tips**: Jika pakai SQLite, file `dev.db` akan otomatis dibuat.

### Langkah 6: Jalankan Aplikasi

Sekarang saatnya menjalankan aplikasi!

#### Mode Development (Recommended - dengan auto-reload):

```bash
npm run dev
```

#### Mode Production:

```bash
npm run build
npm start
```

**Jika berhasil**, Anda akan melihat:

```
API running on 3000
Scheduler initialized. Will run every 2 hours (cron: 0 */2 * * *)
```

🎊 **Selamat! Aplikasi Anda sudah berjalan!**

Aplikasi sekarang bisa diakses di: `http://localhost:3000`

## ✅ Verifikasi Aplikasi Berjalan

Setelah aplikasi berjalan, cek apakah semuanya OK:

### Cara 1: Buka di Browser (Paling Mudah!)

Buka browser dan kunjungi:
- http://localhost:3000/api/health

Jika muncul JSON dengan status "ok", berarti berhasil! ✅

### Cara 2: Pakai Halaman Test HTML

1. Buka file `test-api.html` di browser (double-click)
2. Klik tombol "Test" pada Health Check
3. Jika status OK, berarti semua berjalan dengan baik!

## 🧪 Test API Endpoints

Sekarang coba test beberapa endpoint:

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

Atau buka di browser: http://localhost:3000/api/health

### 2. Scrape Hotel (Contoh)

```bash
curl -X POST http://localhost:3000/api/hotels/scrape \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://www.expedia.com/hotel/...\"}"
```

> 💡 **Tips**: Ganti URL dengan URL hotel Expedia yang valid!

### 3. Test Chatbot

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Recommend a hotel\"}"
```

### 4. Buat Post Manual

```bash
curl -X POST http://localhost:3000/api/posts/create
```

## 🔧 Troubleshooting (Mengatasi Masalah)

### Error: "Cannot find module '@prisma/client'"

**Solusi:**
```bash
npm install
npm run db:generate
```

### Error: Database connection failed

**Solusi:**
- Jika pakai PostgreSQL: Pastikan PostgreSQL service berjalan
- Cek `DATABASE_URL` di file `.env` sudah benar
- Format PostgreSQL: `postgresql://user:password@host:port/database`
- Format SQLite: `file:./dev.db`

### Error: "FIRECRAWL_API_KEY is required"

**Solusi:**
- Pastikan file `.env` ada di root folder
- Pastikan `FIRECRAWL_API_KEY` sudah diisi (bukan `your_firecrawl_api_key_here`)
- **Restart aplikasi** setelah mengubah `.env`

### Error: Port already in use

**Solusi:**
Ubah `PORT` di file `.env` ke port lain, misalnya:
```env
PORT=3001
```

Lalu restart aplikasi.

### Error: "No available hotels to create post from"

**Solusi:**
Anda perlu scrape hotel dulu! Jalankan:
```bash
curl -X POST http://localhost:3000/api/hotels/scrape \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://www.expedia.com/hotel/...\"}"
```

## 📝 Catatan Penting

1. **API Keys Minimal**:
   - Wajib: `FIRECRAWL_API_KEY` dan `OPENAI_API_KEY` (atau `OPENROUTER_API_KEY`)
   - Opsional: Social media keys (Twitter, LinkedIn)

2. **Database**:
   - SQLite: File `dev.db` akan otomatis dibuat saat `npm run db:push`
   - PostgreSQL: Harus dibuat database dulu

3. **Social Media**:
   - Twitter dan LinkedIn **opsional**
   - Aplikasi tetap bisa jalan tanpa ini
   - Post akan dibuat, tapi tidak di-share ke social media

4. **Scheduler**:
   - Akan otomatis jalan setiap 2 jam
   - Untuk test langsung, set `RUN_ON_STARTUP=true` di `.env`

## 🎯 Quick Start (Setup Minimal)

Jika hanya ingin test cepat:

1. Install: `npm install`
2. Buat `.env` dengan minimal:
   ```env
   DATABASE_URL="file:./dev.db"
   FIRECRAWL_API_KEY=your_key
   OPENAI_API_KEY=your_key
   PORT=3000
   ```
3. Setup DB: `npm run db:generate && npm run db:push`
4. Run: `npm run dev`

**Selesai!** Aplikasi sudah jalan. 🎉

## 📚 Command Reference

Berikut command-command yang sering digunakan:

```bash
# Development
npm run dev              # Run dengan hot reload (recommended!)

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema ke database
npm run db:migrate       # Create migration (untuk production)
npm run db:studio        # Buka Prisma Studio (GUI untuk database)

# Production
npm run build            # Build TypeScript ke JavaScript
npm start                # Run production build
```

## 🆘 Butuh Bantuan Lebih?

Jika masih ada masalah:

1. 📖 Baca `README.md` untuk dokumentasi lengkap
2. ⚡ Baca `QUICKSTART.md` untuk quick start guide
3. 🗄️ Baca `setup-database.md` untuk panduan database
4. 📱 Baca `PANDUAN_PENGGUNAAN.md` untuk panduan penggunaan

---

**Selamat mencoba! Semoga berhasil! Jika ada pertanyaan, jangan ragu untuk bertanya! 😊**
