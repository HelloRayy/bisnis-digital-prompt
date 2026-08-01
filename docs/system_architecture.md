# Dokumentasi Arsitektur & Logika Sistem (Lorem Ipsum - AI Prompt Platform)

Dokumen ini berisi dokumentasi teknis dan alur logika bisnis menyeluruh dari aplikasi web **Lorem Ipsum (AI Prompt Platform)**, diperbarui dengan 6 sistem logika backend Supabase tingkat lanjut.

---

## 1. Ikhtisar Produk (Product Overview)
**Lorem Ipsum** adalah platform agregator dan galeri prompt AI interaktif berbasis model **Freemium & Pay-As-You-Go (Credit-Based)**. 

### Key Value Propositions:
1. **Curated Prompt Gallery**: 399+ prompt AI pilihan dari berbagai kategori.
2. **Dynamic Variable Editor**: Mengubah variabel dinamis `[PLACEHOLDER]` secara instan.
3. **Monetisasi & Cloud Credits Engine**: Pengelolaan akun & saldo kredit terpusat di cloud Supabase.

---

## 2. Fitur & Logika Sistem Terbaru (6 Upgrades)

### 1. Atomic Transaction Audit Trail (`credit_transactions`)
- Setiap aktivitas penambahan/pemotongan kredit dicatat secara *atomic* di dalam tabel `credit_transactions`.
- Tipe transaksi: `WELCOME_BONUS`, `TOPUP`, `USAGE`.
- Pengguna dapat melihat audit log riwayat transaksi lengkap dari navbar profil.

### 2. Fitur Unlock Sekali Bayar (`user_purchases`)
- Prompt premium yang sudah dibeli dicatat di tabel `user_purchases (user_id, prompt_id)`.
- Pemotongan kredit hanya terjadi pada pembelian pertama. Penyalinan berikutnya untuk prompt yang sama bersifat **GRATIS** (Terbuka selamanya).

### 3. Automatic Welcome Bonus (50 Kredit Gratis)
- Trigger PostgreSQL `handle_new_user()` memberikan **50 kredit gratis** secara otomatis saat pendaftaran akun baru.
- Langsung mencatat log `WELCOME_BONUS` ke audit trail.

### 4. Idempotency Key pada Transaksi DB
- Mengirimkan `idempotency_key` (UUID v4) pada setiap panggilan RPC `topup_credits` dan `deduct_credits`.
- Mencegah duplikasi pemotongan kredit / top-up akibat pencetan ganda atau retry jaringan.

### 5. Bookmark & Sync Favorit (`user_favorites`)
- Pengguna dapat menandai prompt favorit yang tersinkronisasi langsung ke database Supabase `user_favorites`.
- Filter khusus kategori `Favorites` pada dashboard gallery.

### 6. Row-Level Security & Concurrency Safety
- Row-Level Locking (`FOR UPDATE`) pada fungsi `deduct_credits()` di PostgreSQL.
- Mencegah race-condition dan saldo negatif saat transaksi simultan.

---

## 3. Spesifikasi Database Supabase (`supabase/schema.sql`)

```sql
-- Tabel Utama
user_credits      : Stores balance per user (default 50 credits)
user_purchases    : Tracks unlocked premium prompts (one-time buy)
user_favorites    : Stores bookmarked prompt IDs
credit_transactions: Complete audit trail (id, user_id, amount, type, idempotency_key)

-- Atomic RPC Functions
topup_credits(add_amount, p_description, p_idempotency_key)
deduct_credits(cost_amount, p_prompt_id, p_description, p_idempotency_key)
```

---

## 4. Model Bisnis & Monetisasi Digital

```
[ Registrasi User Baru ] 
        │
        ├── Bonus Awal: 50 Kredit Gratis (Automatic Trigger)
        │
        ├── Prompt Gratis (0 Kredit) ──> Salin Langsung
        │
        └── Prompt Premium (100 Kredit) 
                │
                ├── Sudah Pernah Dibeli (user_purchases) ──> Gratis Salin Berulang Kali
                │
                ├── Belum Dibeli & Saldo Cukup ──> Potong 100 Kredit ──> Unlock Selamanya
                │
                └── Belum Dibeli & Saldo Kurang ──> Modal Top-Up Kredit
```
