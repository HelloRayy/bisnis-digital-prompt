# Implementation Plan: 9-Step Progressive Upgrade (From Easiest to Most Complex)

## Overview
Implementasi 9 fitur baru yang diurutkan secara ketat dari tingkat kesulitan paling rendah (quick UI & local state) hingga paling tinggi (Full Admin Dashboard Subsystem). Setiap tahap dibangun secara vertikal, mandiri, dan dapat diverifikasi secara bertahap.

---

## Architecture Decisions
- **Optimistic State Updates**: Pengurangan saldo (`userCredits`) diproses secara instan di state React sebelum sinkronisasi async ke storage/DB untuk menjamin respon UI 0ms.
- **Dynamic Badge Tokens**: Badge kredit menggunakan conditional styling berbasis nilai threshold (`> 10,000` -> purple glow & ambient background).
- **Voucher Engine**: Validasi voucher `KEPAL2` di sisi klien yang mereduksi harga paket menjadi Rp0 dan langsung mengkreditkan saldo pengguna.
- **Local Fallback Storage**: Lapisan abstraksi data `ResilientDataLayer` yang secara otomatis mengalihkan penyimpanan ke `localStorage` jika Supabase free-tier sedang *paused* atau offline.
- **Admin Subsystem**: Modul `/admin` mandiri dengan proteksi role, visualisasi metrik subscriber, manajemen CRUD prompt dengan persistensi lokal + Supabase, dan pengatur paket langganan.

---

## Task List

### 🟢 Phase 1: Level 1 - SANGAT MUDAH (Quick UI & Local State Tweaks)

#### Task 1: Fix UI Label Badge Contrast & Instant Real-Time Saldo Deduction
- **Description**: Memperbaiki kontras teks label badge pada semua varian tema (dark/light) dan memastikan `setUserCredits` langsung terpotong secara instan di UI tanpa delay asinkron.
- **Acceptance criteria**:
  - [ ] Teks label badge memiliki kontras tajam (WCAG AA compliant).
  - [ ] Saat user membuka prompt premium, saldo berkurang seketika di header, dock, dan detail modal tanpa jeda.
- **Files**: `src/components/PromptDetailView.jsx`, `src/App.jsx`, `src/components/FigmaPortfolioPreview.jsx`
- **Scope**: S (3 files)

#### Task 2: Dynamic Purple Glow Badge saat Kredit > 10,000
- **Description**: Menambahkan kondisi visual pada badge kredit di mana jika saldo pengguna melebihi 10,000 kredit, badge berubah warna menjadi ungu menyala (*purple glow*).
- **Acceptance criteria**:
  - [ ] Saldo <= 10,000: Tampilan standar (zinc/dark pill).
  - [ ] Saldo > 10,000: Tampilan ungu premium (`bg-purple-600 text-white shadow-purple-500/30 border-purple-400/50`).
- **Files**: `src/components/FigmaPortfolioPreview.jsx`, `src/components/PromptDetailView.jsx`, `src/components/nav-user.jsx`
- **Scope**: S (3 files)

#### Task 3: Voucher `KEPAL2` di `/subscription` (Diskon 100% / Gratis)
- **Description**: Menambahkan form input voucher di `SubscriptionView.jsx` dan `CheckoutView.jsx`. Memasukkan kode `KEPAL2` akan mengubah total harga menjadi Rp0 dan memberikan kredit instan.
- **Acceptance criteria**:
  - [ ] Input kode voucher interaktif dengan tombol "Terapkan".
  - [ ] Kode `KEPAL2` (case-insensitive) memotong harga ke Rp0 / Free.
  - [ ] Menampilkan alert sukses dan langsung mengkreditkan saldo ke akun pengguna.
- **Files**: `src/components/SubscriptionView.jsx`, `src/components/CheckoutView.jsx`
- **Scope**: S (2 files)

#### Task 4: Dokumentasi Visual Flow Image Pipeline (Excalidraw/Architecture Flow)
- **Description**: Membuat dokumentasi visual diagram arsitektur alur batch image downloader ke `public/images/prompts/` dan pemetaan O(1) di `image-optimizer.js`.
- **Acceptance criteria**:
  - [ ] Diagram alur komprehensif tersimpan di artifact markdown dengan diagram Mermaid/Excalidraw terstruktur.
- **Files**: `tasks/image_pipeline_flow.md`
- **Scope**: XS (1 file)

---

### 🟡 Phase 2: Level 2 - MENENGAH (Komponen & Form Logic)

#### Task 5: Audit Placeholder & Ekstraksi Parameter Prompt
- **Description**: Memperbaiki algoritma ekstraksi variabel `{variabel}` dan `[variabel]` pada `PromptParameterCustomizer.jsx` agar memberikan contoh placeholder kontekstual yang ramah pengguna.
- **Acceptance criteria**:
  - [ ] Parser mampu mengenali variabel kurung kurawal `{OBJECT}` dan kurung siku `[product name]`.
  - [ ] Input placeholder menampilkan contoh kontekstual yang jelas.
  - [ ] Nilai custom langsung mengubah kompilasi teks prompt secara real-time.
- **Files**: `src/components/prompt-detail/PromptParameterCustomizer.jsx`, `src/components/PromptDetailView.jsx`
- **Scope**: S (2 files)

#### Task 6: Section "Cara Pakai Prompt" (Copy Prompt & Copy Image Reference) di `/view/:slug`
- **Description**: Menambahkan modul instruksi penggunaan prompt lengkap dengan tombol 1-klik *Copy Prompt*, tombol *Copy Image Reference URL*, dan tips workflow AI image generation.
- **Acceptance criteria**:
  - [ ] Terdapat panduan langkah demi langkah penggunaan di Midjourney / Stable Diffusion / ChatGPT.
  - [ ] Tombol *Salin Prompt* dan *Salin Image Reference URL* berfungsi dengan toast notifikasi sukses.
- **Files**: `src/components/PromptDetailView.jsx`
- **Scope**: S (1 file)

---

### 🟠 Phase 3: Level 3 - MENENGAH KE ATAS (Global Layout & Resiliency)

#### Task 7: Full Mobile Responsiveness Across All Views (360px - 1024px)
- **Description**: Mengaudit dan menyempurnakan responsivitas seluruh komponen (Header, Masonry Grid, Bottom Dock, Detail Modal, dan Checkout) pada layar HP & Tablet.
- **Acceptance criteria**:
  - [ ] Galeri 1-2 kolom rapi pada viewport HP (<640px).
  - [ ] Bottom Dock pas di layar HP tanpa overflow horizontal.
  - [ ] Detail page Stage 1 & Stage 2 nyaman dibaca dan di-scroll di mobile.
- **Files**: `src/components/FigmaPortfolioPreview.jsx`, `src/components/PromptDetailView.jsx`, `src/components/ui/dock-two.jsx`, `src/components/SubscriptionView.jsx`
- **Scope**: M (4 files)

#### Task 8: Solusi Supabase Free-Tier Auto-Pause (Resilient Storage Fallback)
- **Description**: Membangun mekanisme fallback otomatis ke `localStorage` jika Supabase free-tier mengalami auto-pause atau gagal koneksi, sehingga seluruh fitur login, kredit, dan pembelian tetap berjalan tanpa error.
- **Acceptance criteria**:
  - [ ] Web mendeteksi status kegagalan koneksi Supabase tanpa melempar fatal error ke UI.
  - [ ] Transaksi kredit dan status prompt yang telah dibuka tetap tersimpan dan persisten di browser.
- **Files**: `src/hooks/useUserCredits.js`, `src/hooks/useAuth.js`, `src/lib/prompts-service.js`, `src/App.jsx`
- **Scope**: M (4 files)

---

### 🔴 Phase 4: Level 4 - PALING SUSAH (Full Admin Dashboard Subsystem)

#### Task 9: Dashboard Admin Lengkap (`/admin`)
- **Description**: Membangun modul Admin Dashboard komprehensif dengan 3 fitur inti:
  1. **User Analytics**: Total user, perbandingan Subscriber vs Non-Subscriber, dan statistik transaksi.
  2. **Prompt Management (CRUD)**: Tambah prompt baru, edit prompt yang ada, ubah harga kredit, dan hapus prompt.
  3. **Subscription & Voucher Management**: Atur harga paket langganan, buat diskon, dan kelola kode voucher.
- **Acceptance criteria**:
  - [ ] Rute `/admin` dengan proteksi akses (Admin PIN / Auth Switch).
  - [ ] Tab Analitik menampilkan diagram/kartu metrik pengguna.
  - [ ] Tab CRUD Card Prompt dapat menambah, mengedit, dan menghapus prompt dengan persistensi.
  - [ ] Tab Kelola Subs dapat mengubah harga dan mengaktifkan voucher diskon.
- **Files**: `src/components/admin/AdminDashboard.jsx`, `src/components/admin/UserAnalyticsTab.jsx`, `src/components/admin/PromptCrudTab.jsx`, `src/components/admin/SubscriptionConfigTab.jsx`, `src/App.jsx`
- **Scope**: L (5 files)

---

## Checkpoints
- **Checkpoint 1 (After Phase 1)**: Verifikasi badge contrast, saldo instan, badge ungu >10k, voucher `KEPAL2`, dan flow diagram.
- **Checkpoint 2 (After Phase 2)**: Verifikasi placeholder parameter & section cara pakai prompt di detail page.
- **Checkpoint 3 (After Phase 3)**: Verifikasi mobile responsive & Supabase auto-pause fallback.
- **Checkpoint 4 (After Phase 4)**: Verifikasi modul Admin Dashboard lengkap (Analytics, CRUD, Subs Management) + Build check + Git Auto-Push.
