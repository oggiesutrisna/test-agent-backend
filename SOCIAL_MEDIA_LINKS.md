# 📱 Social Media Shared Post Links - Panduan Lengkap

Halo! Setelah post dibuat dan di-share ke social media (Twitter & LinkedIn), link-link postingan tersebut akan otomatis disimpan di database. Panduan ini akan membantu Anda mengakses dan menggunakan link-link tersebut! 😊

## 🎯 Apa yang Akan Anda Pelajari?

Di panduan ini, Anda akan belajar:
- ✅ Cara mendapatkan link social media setelah post dibuat
- ✅ Cara melihat link untuk post tertentu
- ✅ Cara menggunakan link-link tersebut
- ✅ Troubleshooting jika link tidak muncul

## 🚀 Cara Menggunakan

### 1. Setelah Create Post (Otomatis!)

Ketika Anda membuat post baru menggunakan `POST /api/posts/create`, response akan **otomatis include social media links**:

```json
{
  "id": "post-id",
  "title": "Amazing Hotel in Bali",
  "content": "Experience the ultimate luxury...",
  "socialMediaLinks": {
    "twitter": "https://twitter.com/user/status/123456",
    "linkedin": "https://www.linkedin.com/feed/update/abc123"
  },
  "socialMediaPosts": [
    {
      "platform": "twitter",
      "postUrl": "https://twitter.com/user/status/123456",
      "status": "published"
    },
    {
      "platform": "linkedin",
      "postUrl": "https://www.linkedin.com/feed/update/abc123",
      "status": "published"
    }
  ]
}
```

> 💡 **Tips**: Link akan muncul otomatis jika social media credentials sudah dikonfigurasi!

### 2. Get Social Media Links untuk Post Tertentu

Ingin melihat link untuk post yang sudah dibuat sebelumnya? Gunakan endpoint ini:

```bash
GET /api/posts/:id/social-media
```

**Contoh:**
```bash
GET http://localhost:3000/api/posts/clx123abc/social-media
```

**Response yang Anda dapatkan:**
```json
{
  "postId": "clx123abc",
  "postTitle": "Amazing Hotel in Bali",
  "socialMediaLinks": {
    "twitter": "https://twitter.com/user/status/123456",
    "linkedin": "https://www.linkedin.com/feed/update/abc123"
  },
  "socialMediaPosts": [
    {
      "id": "sm1",
      "platform": "twitter",
      "postUrl": "https://twitter.com/user/status/123456",
      "status": "published",
      "publishedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "sm2",
      "platform": "linkedin",
      "postUrl": "https://www.linkedin.com/feed/update/abc123",
      "status": "published",
      "publishedAt": "2024-01-15T10:30:05Z"
    }
  ]
}
```

### 3. Get All Posts (dengan Social Media Links)

Endpoint `GET /api/posts` juga sudah include social media links di setiap post:

```json
[
  {
    "id": "post-1",
    "title": "Hotel 1",
    "content": "...",
    "socialMediaPosts": [
      {
        "platform": "twitter",
        "postUrl": "https://twitter.com/...",
        "status": "published"
      },
      {
        "platform": "linkedin",
        "postUrl": "https://www.linkedin.com/...",
        "status": "published"
      }
    ]
  }
]
```

## 🖥️ Menggunakan Halaman Test HTML (Paling Mudah!)

Cara termudah untuk melihat social media links:

1. **Buka `test-api.html`** di browser (double-click file)
2. **Klik tombol "Create Post"** - setelah post dibuat, social media links akan ditampilkan dengan jelas di bagian bawah response dengan format yang mudah dibaca
3. **Atau gunakan "Get Social Media Links"** - masukkan Post ID dan klik tombol untuk melihat links post tertentu

> 🎨 **Bonus**: Link-link di halaman test HTML bisa langsung diklik untuk membuka di browser baru!

## 📊 Status Social Media Post

Setiap social media post memiliki status yang bisa Anda cek:

- **`pending`** - Sedang dalam proses posting
- **`published`** - ✅ Berhasil di-publish (ada link yang bisa digunakan)
- **`failed`** - ❌ Gagal publish (ada error message yang bisa dilihat)

> 💡 **Tips**: Jika status `failed`, cek error message untuk tahu penyebabnya!

## ⚙️ Konfigurasi yang Diperlukan

Untuk mendapatkan social media links, pastikan credentials sudah dikonfigurasi di `.env`:

### Twitter Configuration

```env
# Opsi 1: Bearer Token (lebih sederhana)
TWITTER_BEARER_TOKEN=your_token

# Opsi 2: Full OAuth (lebih lengkap)
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_token
TWITTER_ACCESS_TOKEN_SECRET=your_secret
```

### LinkedIn Configuration

```env
LINKEDIN_ACCESS_TOKEN=your_token
LINKEDIN_PERSON_URN=urn:li:person:your_id
```

> ⚠️ **Catatan Penting**: 
> - Jika credentials **tidak dikonfigurasi**, post tetap akan dibuat tapi social media links akan `null`
> - Pastikan credentials masih valid dan tidak expired
> - Restart aplikasi setelah mengubah credentials

## 🔍 Melihat di Database (Advanced)

Anda juga bisa melihat social media posts langsung di database menggunakan Prisma Studio:

```bash
npm run db:studio
```

Lalu:
1. Buka browser (otomatis terbuka)
2. Klik tabel `SocialMediaPost`
3. Lihat semua postingan dan link-linknya

> 💡 **Tips**: Prisma Studio sangat membantu untuk debugging dan melihat data secara visual!

## 📝 Contoh Response Lengkap

Berikut contoh response lengkap yang akan Anda dapatkan:

```json
{
  "id": "clx123abc",
  "hotelId": "hotel-xyz",
  "title": "Discover Paradise: Luxury Resort in Bali",
  "content": "Experience the ultimate luxury at this stunning resort...",
  "imageUrl": "https://example.com/image.jpg",
  "published": true,
  "publishedAt": "2024-01-15T10:30:00Z",
  "socialMediaLinks": {
    "twitter": "https://twitter.com/user/status/1234567890",
    "linkedin": "https://www.linkedin.com/feed/update/urn:li:activity:123456"
  },
  "hotel": {
    "name": "Bali Paradise Resort",
    "location": "Bali, Indonesia",
    "rating": 4.8
  },
  "socialMediaPosts": [
    {
      "id": "sm-twitter-1",
      "platform": "twitter",
      "postUrl": "https://twitter.com/user/status/1234567890",
      "status": "published",
      "publishedAt": "2024-01-15T10:30:01Z"
    },
    {
      "id": "sm-linkedin-1",
      "platform": "linkedin",
      "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:123456",
      "status": "published",
      "publishedAt": "2024-01-15T10:30:05Z"
    }
  ]
}
```

## 🐛 Troubleshooting

### Link Tidak Muncul (null)

**Kemungkinan penyebab:**
1. Social media credentials belum dikonfigurasi
2. Credentials sudah expired
3. Posting gagal (cek status di database)

**Solusi:**
- Pastikan credentials sudah diisi di `.env`
- Cek apakah credentials masih valid
- Lihat error di database tabel `SocialMediaPost`

### Status "failed"

**Solusi:**
- Cek error message di database
- Pastikan credentials benar
- Cek apakah API permissions sudah cukup
- Restart aplikasi

### Link Twitter/LinkedIn Tidak Bisa Dibuka

**Kemungkinan:**
- Link sudah expired (jarang terjadi)
- Post sudah dihapus
- URL format salah

**Solusi:**
- Cek langsung di platform social media
- Buat post baru untuk test

## 💡 Tips & Best Practices

1. **Simpan Link**: Link-link ini berguna untuk tracking dan analytics
2. **Monitor Status**: Selalu cek status untuk memastikan posting berhasil
3. **Error Handling**: Jika posting gagal, cek error message untuk troubleshooting
4. **Backup**: Link tersimpan di database, jadi aman!

## 🎯 Use Cases

Link-link ini bisa digunakan untuk:
- ✅ Tracking engagement di social media
- ✅ Analytics dan reporting
- ✅ Share ulang di platform lain
- ✅ Monitoring dan quality control

---

**Selamat menggunakan! Semoga link-link social media Anda selalu muncul dengan sempurna! 🚀**
