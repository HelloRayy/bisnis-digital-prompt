# Data Schema Specifications

## 1. Database Schema (`src/data/prompts.json`)

```typescript
interface PromptItem {
  rank: number;           // Peringkat kepopuleran prompt (1 - N)
  id: string;             // Unique Identifier ID
  prompt: string;         // String template prompt (berisi [VARIABLE])
  author: string;         // Username pembuat
  author_name?: string;    // Nama lengkap pembuat
  likes: number;          // Jumlah likes
  views: number;          // Jumlah tayangan/views
  image: string;          // Direct URL gambar visualisasi
  images?: string[];      // Array URL gambar tambahan jika ada
  model: string;          // Model AI (e.g., 'gptimage', 'Midjourney', 'Flux')
  categories: string[];   // Kategori (e.g., ['UI & Graphic', 'Product & Brand'])
  rating?: number;        // Rating skor
  score?: number;         // Score engagement
  date?: string;          // Tanggal rilis (YYYY-MM-DD)
  source_url?: string;    // Link sumber asli (Twitter/X)
  isPremium: boolean;     // Status apakah memerlukan kredit (true/false)
}
```

## 2. Supabase Auth User Schema (`auth.users` & `public.profiles`)
Secara bawaan Supabase menyimpan pendaftaran akun di tabel terproteksi **`auth.users`**.

- **Public View (`public.profiles`)**:
  Setiap pendaftaran otomatis tercermin pada view `public.profiles` (kolom: `id`, `email`, `created_at`, `last_sign_in_at`).
- **PostgreSQL Trigger (`handle_new_user`)**:
  Saat user baru mendaftar di `auth.users`, trigger PostgreSQL secara otomatis membuatkan baris saldo kredit baru di tabel `public.user_credits` dengan `user_id = auth.users.id`.


## 2. Local Storage Schema

| Key | Type | Example | Description |
|---|---|---|---|
| `meigen_credits` | `string` (Integer) | `"1500"` | Menyimpan saldo kredit pengguna saat ini |

## 3. Package Tariff Schema

```typescript
interface CreditPackage {
  id: 'starter' | 'pro';
  name: string;
  price: number;          // IDR
  credits: number;        // Jumlah kredit yang didapat
  popular?: boolean;
}
```
