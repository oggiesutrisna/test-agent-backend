# 🏨 AI Agent Backend - Hotel Content Generator

Selamat datang! Ini adalah sistem AI agent yang otomatis mengumpulkan data hotel, membuat konten menarik, dan mempublish ke social media setiap 2 jam. Semuanya berjalan otomatis tanpa perlu campur tangan manual! 🚀

## ✨ Apa yang Bisa Dilakukan?

Sistem ini punya beberapa fitur keren:

- 🏨 **Scraping Hotel Otomatis** - Ambil data hotel dari Expedia dan website lainnya dengan mudah
- 🤖 **Generate Konten AI** - AI akan membuat konten menarik (teks + gambar) secara otomatis
- 📱 **Posting ke Social Media** - Otomatis posting ke Twitter dan LinkedIn
- ⏰ **Jadwal Otomatis** - Berjalan setiap 2 jam tanpa perlu diingatkan
- 💬 **Chatbot API** - Siap untuk diintegrasikan dengan aplikasi mobile (React Native/LynxJS)
- 🗄️ **Database Terorganisir** - Semua data tersimpan rapi di PostgreSQL

## 🛠️ Teknologi yang Digunakan

Kami menggunakan teknologi modern dan terpercaya:

- **Backend**: Node.js dengan Express dan TypeScript (type-safe, lebih aman!)
- **AI/ML**: LangChain dengan OpenAI atau OpenRouter (pilih yang sesuai budget)
- **Scraping**: Firecrawl API (handal untuk web scraping)
- **Database**: PostgreSQL dengan Prisma ORM (mudah dikelola)
- **Scheduling**: node-cron (untuk jadwal otomatis)
- **Social Media**: Twitter API & LinkedIn API

## 🚀 Mulai Menggunakan

### Langkah 1: Install Dependencies

Pertama, install semua package yang dibutuhkan:

```bash
npm install
```

### Langkah 2: Setup Database

Anda punya beberapa pilihan untuk database:

**Opsi A: PostgreSQL Lokal**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/agent_backend?schema=public"
```

**Opsi B: SQLite (Lebih Mudah untuk Development)**
```bash
DATABASE_URL="file:./dev.db"
```

**Opsi C: Cloud Database (Supabase, Neon, dll)**
- Buat akun di [Supabase](https://supabase.com) (gratis!)
- Copy connection string
- Paste ke `.env`

### Langkah 3: Setup API Keys

Buat file `.env` di root folder dan isi dengan API keys Anda:

```env
# Database
DATABASE_URL="file:./dev.db"  # atau PostgreSQL URL

# Firecrawl (untuk scraping)
FIRECRAWL_API_KEY=your_key_here
# Dapatkan di: https://firecrawl.dev

# AI Content Generation (pilih salah satu)
OPENAI_API_KEY=your_key_here
# ATAU
OPENROUTER_API_KEY=your_key_here

# Social Media (opsional, tapi recommended!)
TWITTER_BEARER_TOKEN=your_token
LINKEDIN_ACCESS_TOKEN=your_token
LINKEDIN_PERSON_URN=urn:li:person:your_id

# Server
PORT=3000
```

> 💡 **Tips**: Minimal butuhkan `FIRECRAWL_API_KEY` dan `OPENAI_API_KEY` untuk mulai. Social media bisa ditambahkan nanti!

### Langkah 4: Setup Database

Jalankan perintah ini untuk membuat tabel di database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database
npm run db:push
```

### Langkah 5: Jalankan Aplikasi

Sekarang tinggal jalankan aplikasinya:

```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Jika berhasil, Anda akan melihat:
```
API running on 3000
Scheduler initialized. Will run every 2 hours (cron: 0 */2 * * *)
```

🎉 **Selamat! Aplikasi Anda sudah berjalan!**

## 📡 API Endpoints

Sistem ini menyediakan beberapa endpoint yang bisa Anda gunakan:

### Health Check
- `GET /api/health` - Cek apakah API berjalan dengan baik

### Posts
- `GET /api/posts` - Lihat semua posts yang sudah dibuat
- `GET /api/posts/:id` - Lihat detail satu post
- `POST /api/posts/create` - Buat post baru secara manual
- `GET /api/posts/:id/social-media` - Lihat link social media dari post

### Hotels
- `GET /api/hotels` - Lihat semua hotel yang sudah di-scrape
- `POST /api/hotels/scrape` - Scrape hotel baru dari URL Expedia

### Chatbot (untuk Mobile App)
- `POST /api/chat` - Chat dengan AI assistant
- `GET /api/chat/recommendations` - Dapatkan rekomendasi hotel

## 💡 Cara Menggunakan

### Test dengan Halaman HTML (Paling Mudah!)

1. Buka file `test-api.html` di browser
2. Klik tombol-tombol untuk test semua fitur
3. Lihat hasilnya langsung di browser

### Scrape Hotel Pertama

```bash
curl -X POST http://localhost:3000/api/hotels/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.expedia.com/hotel/..."}'
```

### Buat Post Manual

```bash
curl -X POST http://localhost:3000/api/posts/create
```

### Test Chatbot

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend a hotel"}'
```

## ⚙️ Bagaimana Sistem Bekerja?

Sistem ini berjalan otomatis setiap 2 jam:

1. **Pilih Hotel** - Sistem memilih hotel yang belum pernah digunakan
2. **Generate Konten** - AI membuat konten menarik (judul, deskripsi, gambar)
3. **Simpan ke Database** - Post disimpan dan ditandai sebagai published
4. **Post ke Social Media** - Otomatis posting ke Twitter & LinkedIn
5. **Simpan Link** - Link postingan disimpan untuk referensi

Semuanya otomatis! Anda tinggal duduk manis dan lihat hasilnya. 😊

## 🎛️ Konfigurasi

### Ubah Jadwal Scheduler

Edit file `.env`:

```env
# Setiap 2 jam (default)
CRON_SCHEDULE="0 */2 * * *"

# Setiap 1 jam
CRON_SCHEDULE="0 * * * *"

# Setiap hari jam 9 pagi
CRON_SCHEDULE="0 9 * * *"

# Test langsung saat startup
RUN_ON_STARTUP=true
```

### Social Media Platforms

Saat ini mendukung:
- ✅ Twitter/X
- ✅ LinkedIn

Ingin tambah platform lain? Edit file `src/services/socialMediaService.ts`!

## 📊 Database Schema

Database memiliki 3 tabel utama:

- **Hotel** - Menyimpan data hotel yang sudah di-scrape
- **Post** - Menyimpan konten yang sudah dibuat
- **SocialMediaPost** - Melacak postingan ke social media

Lihat detailnya di `prisma/schema.prisma`

## 🛠️ Development

Beberapa command yang berguna:

```bash
# Development dengan auto-reload
npm run dev

# Buka Prisma Studio (GUI untuk database)
npm run db:studio

# Build untuk production
npm run build

# Jalankan production build
npm start
```

## 🚢 Deployment

Untuk production:

1. Setup PostgreSQL database (jangan pakai SQLite!)
2. Isi semua environment variables
3. Run migrations: `npm run db:migrate`
4. Build: `npm run build`
5. Start: `npm start`

> 💡 **Tips**: Gunakan PM2 atau systemd untuk menjalankan aplikasi di production

## 📚 Dokumentasi Lengkap

- 📖 **CARA_JALANKAN.md** - Panduan lengkap dalam bahasa Indonesia
- 🚀 **QUICKSTART.md** - Quick start guide
- 📱 **lynx-rn-example.md** - Contoh integrasi dengan mobile app
- 🔗 **SOCIAL_MEDIA_LINKS.md** - Cara melihat link social media
- 📋 **PROJECT_SUMMARY.md** - Ringkasan project

## ⚠️ Catatan Penting

- Firecrawl scraper mungkin perlu disesuaikan tergantung struktur website
- Social media APIs memerlukan setup OAuth yang benar
- Image generation menggunakan DALL-E atau OpenRouter
- Chatbot adalah implementasi sederhana - bisa ditingkatkan untuk production

## 📝 License

ISC

---

**Selamat menggunakan! Jika ada pertanyaan, jangan ragu untuk bertanya! 😊**
