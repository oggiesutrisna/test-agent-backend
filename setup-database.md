# 🗄️ Setup Database - Panduan Lengkap

Halo! Panduan ini akan membantu Anda setup database untuk project ini. Jangan khawatir, kami sediakan beberapa opsi yang mudah! 😊

## 🎯 Pilih Opsi Database Anda

Anda punya 3 pilihan, pilih yang paling sesuai dengan kebutuhan:

### Opsi 1: PostgreSQL Lokal (Recommended untuk Production)

**Keuntungan**: Powerful, scalable, cocok untuk production

#### Windows:
1. Download dari: https://www.postgresql.org/download/windows/
2. Install dengan default settings
3. **Ingat password** yang dibuat untuk user `postgres` (penting!)
4. Update file `.env` dengan password yang benar:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/agent_backend?schema=public"
```

#### Setelah Install:

Buat database baru:

```bash
# Via command line
createdb agent_backend

# Atau via psql (interactive)
psql -U postgres
CREATE DATABASE agent_backend;
\q
```

### Opsi 2: Docker (Paling Mudah!)

**Keuntungan**: Tidak perlu install, langsung jalan, mudah dihapus

Jalankan PostgreSQL di Docker:

```bash
docker run --name postgres-agent \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=agent_backend \
  -p 5432:5432 \
  -d postgres
```

Update `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agent_backend?schema=public"
```

**Selesai!** Database sudah jalan. 🎉

> 💡 **Tips**: Jika container sudah ada, gunakan:
> ```bash
> docker start postgres-agent
> ```

### Opsi 3: Cloud Database (Paling Praktis!)

**Keuntungan**: Tidak perlu install, bisa diakses dari mana saja, gratis untuk development

#### Menggunakan Supabase (Recommended - Gratis!)

1. Buat akun di https://supabase.com (gratis!)
2. Klik "New Project"
3. Isi nama project dan password database
4. Tunggu sampai project siap (1-2 menit)
5. Klik "Settings" → "Database"
6. Copy "Connection string" (pilih "URI")
7. Paste ke file `.env`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

**Ganti `[YOUR-PASSWORD]` dengan password yang Anda buat!**

#### Alternatif Cloud Database Lainnya:

- **Neon**: https://neon.tech (gratis tier tersedia)
- **Railway**: https://railway.app (gratis tier tersedia)
- **Render**: https://render.com (gratis tier tersedia)

Semuanya memberikan connection string yang bisa langsung dipakai!

### Opsi 4: SQLite (Paling Simple untuk Development!)

**Keuntungan**: Tidak perlu install apapun, file-based, perfect untuk testing

Cukup set di `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Prisma akan otomatis membuat file `dev.db` saat pertama kali run!

> ⚠️ **Catatan**: SQLite tidak recommended untuk production, tapi perfect untuk development dan testing!

## 🚀 Setup Database Schema

Setelah database siap, jalankan perintah ini:

```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Push schema ke database (membuat tabel)
npm run db:push
```

**Selesai!** Tabel sudah dibuat. 🎊

### Atau Gunakan Migration (Recommended untuk Production)

```bash
# Create migration
npm run db:migrate

# Nanti saat deploy, jalankan:
npm run db:migrate deploy
```

## ✅ Test Koneksi Database

### Cara 1: Prisma Studio (GUI - Paling Mudah!)

Jalankan:

```bash
npm run db:studio
```

Ini akan membuka browser dengan interface visual untuk:
- ✅ Lihat semua tabel
- ✅ Lihat data
- ✅ Edit data
- ✅ Tambah data manual

**Sangat membantu untuk debugging!** 😊

### Cara 2: Test via Aplikasi

Jalankan aplikasi:

```bash
npm run dev
```

Jika tidak ada error, berarti database connection berhasil!

### Cara 3: Test via psql (PostgreSQL)

```bash
psql -U postgres -d agent_backend

# Lihat tabel
\dt

# Lihat data
SELECT * FROM "Hotel";

# Keluar
\q
```

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Solusi:**
- Pastikan PostgreSQL service berjalan
- Cek apakah port 5432 tidak digunakan aplikasi lain
- Untuk Docker: pastikan container berjalan (`docker ps`)

### Error: "password authentication failed"

**Solusi:**
- Pastikan password di `.env` benar
- Untuk Supabase: pastikan password di connection string benar
- Coba reset password jika perlu

### Error: "database does not exist"

**Solusi:**
- Buat database dulu: `CREATE DATABASE agent_backend;`
- Atau gunakan SQLite untuk development

### Error: "relation does not exist"

**Solusi:**
- Jalankan `npm run db:push` untuk membuat tabel
- Atau `npm run db:migrate` untuk migration

## 💡 Tips & Best Practices

1. **Development**: Gunakan SQLite atau Docker PostgreSQL
2. **Production**: Gunakan cloud database (Supabase, Neon, dll)
3. **Backup**: Selalu backup database sebelum major changes
4. **Migration**: Gunakan migration untuk production, bukan `db:push`
5. **Environment**: Jangan commit `.env` ke git!

## 📚 Next Steps

Setelah database setup:

1. ✅ Test koneksi dengan `npm run db:studio`
2. ✅ Scrape hotel pertama untuk test
3. ✅ Buat post pertama untuk test
4. ✅ Lihat hasilnya di Prisma Studio

---

**Database sudah siap! Selamat menggunakan! 🎉**
