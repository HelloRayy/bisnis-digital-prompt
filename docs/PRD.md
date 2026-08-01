# Product Requirements Document (PRD)

## 1. Ringkasan Eksekutif (Executive Summary)
**Lorem Ipsum** adalah platform agregator dan galeri prompt AI interaktif berbasis web yang memadukan inspirasi desain visual dengan ekosistem bisnis digital berbasis kredit. Produk ini memecahkan masalah kesulitan pembuatan prompt AI bagi kreator pemula dengan menyediakan template prompt siap pakai, kustomisasi variabel dinamis, dan sistem monetisasi yang transparan.

## 2. Target Pengguna (Target Audience)
- **AI Content Creators**: Desainer, pemasar, dan pembuat konten yang membutuhkan prompt berkualitas tinggi secara cepat.
- **Prompt Engineers**: Pengguna yang ingin mencari inspirasi variabel prompt terbaik untuk Midjourney, Flux, atau GPT Image.
- **Mahasiswa & Evaluator Bisnis Digital**: Pihak yang menguji demonstrasi alur bisnis digital, sistem kredit, dan monetisasi aplikasi web.

## 3. Ruang Lingkup MVP (Minimum Viable Product v1.0)
- [x] **Curated Gallery**: 399+ prompt terstruktur berbasis Pinterest-like grid.
- [x] **Filter & Search**: Pencarian real-time berdasarkan kata kunci dan kategori (UI & Graphic, Product & Brand, Photography, Illustration & 3D, Poster Design, Food & Drink).
- [x] **Variable Customizer**: Form dinamis untuk mengubah placeholder `[VARIABLE]` secara instan.
- [x] **Credit Economy**: Sistem saldo kredit virtual, tarif salin 100 kredit untuk prompt premium, dan simulasi top-up (Rp 5.000 = 1.500 kredit).
- [x] **Local Persistence**: Sinkronisasi saldo kredit pengguna menggunakan `localStorage`.

## 4. Future Roadmap (Pengembangan Selanjutnya)
- [ ] **Auth Real (Supabase/Firebase)**: Registrasi pengguna berbasis email/OAuth.
- [ ] **Payment Gateway (Midtrans/Stripe)**: Integrasi transaksi riil dengan QRIS/Kartu Kredit.
- [ ] **User Prompt Submission**: Fitur bagi pengguna untuk mengunggah prompt ciptaan sendiri dan menjualnya di marketplace.
- [ ] **AI Generation Direct API**: Integrasi API langsung untuk menghasilkan gambar di dalam platform tanpa keluar aplikasi.

## 5. Kriteria Kesuksesan (Success Metrics)
- Pengguna dapat memilih, mengedit variabel, dan menyalin prompt tanpa kesalahan format.
- Pengulangan transaksi top-up kredit berjalan stabil tanpa kegagalan sinkronisasi state.
