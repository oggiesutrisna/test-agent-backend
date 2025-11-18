# 📖 Panduan Penggunaan Agent Backend

## 🎯 Apa itu Project Ini?

**Agent Backend** adalah sistem otomatis yang:
1. **Scraping Hotel** - Mengambil data hotel dari Expedia menggunakan Firecrawl
2. **Generate Konten AI** - Membuat konten menarik (teks + gambar) menggunakan AI (OpenAI/LangChain)
3. **Posting ke Social Media** - Otomatis posting ke Twitter dan LinkedIn
4. **Chatbot API** - Menyediakan API chatbot untuk aplikasi mobile (Lynx/RN)
5. **Scheduler** - Berjalan otomatis setiap 2 jam untuk membuat dan publish post baru

## 🚀 Cara Melihat Hasil

### 1. Pastikan Aplikasi Berjalan

Jalankan aplikasi dengan:
```bash
npm run dev
```

Anda akan melihat:
```
API running on 3000
Scheduler initialized. Will run every 2 hours (cron: 0 */2 * * *)
```

### 2. Test dengan Halaman HTML (Paling Mudah!)

Buka file `test-api.html` di browser Anda:
- Double-click file `test-api.html` di folder project
- Atau buka di browser: `file:///C:/backup kerja/web/agent-backend/test-api.html`

Halaman ini akan:
- ✅ Cek apakah API berjalan (Health Check)
- ✅ Tampilkan semua endpoint yang tersedia
- ✅ Bisa test semua fitur dengan klik tombol

### 3. Test dengan Browser

Buka browser dan kunjungi:
- **Health Check**: http://localhost:3000/api/health
- **Semua Posts**: http://localhost:3000/api/posts
- **Semua Hotels**: http://localhost:3000/api/hotels

### 4. Test dengan Command Line (PowerShell)

```powershell
# Health Check
Invoke-WebRequest -Uri http://localhost:3000/api/health | Select-Object -ExpandProperty Content

# Get All Posts
Invoke-WebRequest -Uri http://localhost:3000/api/posts | Select-Object -ExpandProperty Content

# Get All Hotels
Invoke-WebRequest -Uri http://localhost:3000/api/hotels | Select-Object -ExpandProperty Content

# Test Chatbot
$body = @{ message = "Recommend a hotel" } | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/chat -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 5. Test dengan Postman atau Insomnia

Import endpoint berikut:
- `GET http://localhost:3000/api/health`
- `GET http://localhost:3000/api/posts`
- `GET http://localhost:3000/api/hotels`
- `POST http://localhost:3000/api/chat` (Body: `{"message": "Recommend a hotel"}`)
- `POST http://localhost:3000/api/posts/create`
- `POST http://localhost:3000/api/hotels/scrape` (Body: `{"url": "https://www.expedia.com/hotel/..."}`)

## 📊 Endpoint yang Tersedia

### Health Check
- **GET** `/api/health` - Cek status API

### Posts
- **GET** `/api/posts` - Lihat semua posts yang sudah dibuat
- **GET** `/api/posts/:id` - Lihat detail satu post
- **POST** `/api/posts/create` - Buat post baru secara manual

### Hotels
- **GET** `/api/hotels` - Lihat semua hotel yang sudah di-scrape
- **POST** `/api/hotels/scrape` - Scrape hotel baru dari URL Expedia

### Chatbot
- **POST** `/api/chat` - Chat dengan bot (untuk aplikasi mobile)
- **GET** `/api/chat/recommendations` - Dapatkan rekomendasi hotel

## 🔍 Cara Melihat Data di Database

### Menggunakan Prisma Studio (GUI)

Jalankan:
```bash
npm run db:studio
```

Ini akan membuka browser dengan interface visual untuk melihat:
- Tabel `Hotel` - Data hotel yang sudah di-scrape
- Tabel `Post` - Post yang sudah dibuat
- Tabel `SocialMediaPost` - Postingan ke social media

### Menggunakan SQL Query

Jika menggunakan PostgreSQL, bisa query langsung:
```sql
-- Lihat semua hotel
SELECT * FROM "Hotel";

-- Lihat semua posts
SELECT * FROM "Post";

-- Lihat posts yang sudah publish
SELECT * FROM "Post" WHERE published = true;
```

## 🎬 Workflow Lengkap

### 1. Scrape Hotel Pertama

```bash
# Via PowerShell
$body = @{ url = "https://www.expedia.com/hotel/..." } | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/hotels/scrape -Method POST -Body $body -ContentType "application/json"
```

Atau gunakan halaman `test-api.html` - lebih mudah!

### 2. Buat Post dari Hotel

```bash
# Via PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/posts/create -Method POST -ContentType "application/json"
```

Atau klik tombol "Create Post" di `test-api.html`

### 3. Lihat Hasil

- Buka http://localhost:3000/api/posts untuk lihat post yang sudah dibuat
- Atau buka Prisma Studio: `npm run db:studio`

## ⚙️ Konfigurasi

### File `.env`

Pastikan file `.env` sudah ada dan berisi minimal:
```env
DATABASE_URL="file:./dev.db"  # atau PostgreSQL URL
FIRECRAWL_API_KEY=your_key
OPENAI_API_KEY=your_key
PORT=3000
```

### Scheduler (Cron Job)

Aplikasi otomatis akan:
- Setiap 2 jam: Buat post baru dari hotel yang belum digunakan
- Generate konten AI
- Publish ke database
- Post ke social media (jika dikonfigurasi)

Untuk test langsung saat startup, set di `.env`:
```env
RUN_ON_STARTUP=true
```

## 🐛 Troubleshooting

### API tidak merespon

1. Pastikan aplikasi berjalan: `npm run dev`
2. Cek port: Pastikan port 3000 tidak digunakan aplikasi lain
3. Cek `.env`: Pastikan semua API key sudah diisi

### Database Error

1. Generate Prisma client: `npm run db:generate`
2. Push schema: `npm run db:push`
3. Cek `DATABASE_URL` di `.env`

### Tidak ada data

1. Scrape hotel dulu: POST `/api/hotels/scrape`
2. Buat post: POST `/api/posts/create`
3. Cek database: `npm run db:studio`

## 📝 Tips

1. **Gunakan `test-api.html`** - Cara termudah untuk test semua fitur
2. **Prisma Studio** - Cara terbaik untuk lihat data di database
3. **Health Check** - Selalu cek `/api/health` dulu untuk pastikan API berjalan
4. **Logs** - Perhatikan console output untuk debug

## 🎯 Quick Test

1. Buka `test-api.html` di browser
2. Klik "Test" pada Health Check
3. Jika status OK, berarti API berjalan!
4. Test endpoint lainnya dengan klik tombol-tombol yang ada

---

**Selamat menggunakan! 🚀**

