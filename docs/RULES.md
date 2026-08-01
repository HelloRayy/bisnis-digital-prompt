# System Business Rules & Constraints

## 1. Aturan Transaksi & Kredit (Credit Business Rules)
1. **Aturan Harga Copy**:
   - Prompt Non-Premium (`isPremium === false`): `0 Kredit` (Free for all).
   - Prompt Premium (`isPremium === true`): `100 Kredit` per aksi penyalinan.
2. **Aturan Pembelian (Top Up)**:
   - **Paket Starter**: Rp 5.000 = `1.500 Kredit`.
   - **Paket Pro**: Rp 12.000 = `4.000 Kredit`.
3. **Mekanisme Kegagalan Transaksi**:
   - Jika `userCredits < promptCost` saat menyalin prompt premium, proses copy dibatalkan (`abort`) dan sistem menampilkan modal peringatan top-up. Aturan ini fleksibel mengikuti besaran biaya masing-masing prompt (`promptCost`).

## 2. Aturan Kustomisasi Variabel (Variable Compilation Rules)
1. **Sintaks Placeholders**: Variabel wajib ditulis menggunakan kurung siku `[NAMA_VARIABEL]`.
2. **Parsing Regex**: Regex yang digunakan untuk ekstraksi adalah `/\[([^\]]+)\]/g`.
3. **Sensitivitas Huruf**: Ekstraksi bersifat case-sensitive untuk memastikan penggantian teks presisi pada template JSON maupun teks bebas.

## 3. Aturan Autentikasi & Database Cloud
1. **Identitas Akun**: Setiap pengguna wajib mendaftar/login melalui Supabase Auth (`auth.users`).
2. **Keterikatan Kredit**: Kredit disimpan di tabel `public.user_credits` yang terikat pada `user_id` masing-masing akun.
3. **Pemberihan Data**: Seluruh data testing lama di database telah dibersihkan (wiped clean). Setiap akun baru dimulai dari `0 Kredit`.
