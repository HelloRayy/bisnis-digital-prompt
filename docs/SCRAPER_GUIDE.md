# Panduan Penggunaan Bot Scraping Prompt (Playwright Engine)

Dokumen ini menjelaskan cara menggunakan bot scraper otomatis untuk mengambil data prompt dan gambar preview dari postingan sosial media (**X / Twitter** dan **Threads**), lalu membentuk file dataset [prompts.json](file:///home/rayhan/Windows-D/project/tugas-bisnisdigital-prompt/src/data/prompts.json).

---

## 1. Persiapan Dependencies

Bot ini menggunakan **Playwright** untuk menangani halaman web berbasis JavaScript dinamis.

Install Playwright di project dengan perintah:
```bash
npm install -D playwright
```

*(Opsional)* Jika browser Playwright belum terinstall di OS Anda:
```bash
npx playwright install chromium
```

---

## 2. Cara Menjalankan Bot

### Metode A: Menggunakan File `scripts/urls.txt` (Rekomendasi)
1. Buka file [scripts/urls.txt](file:///home/rayhan/Windows-D/project/tugas-bisnisdigital-prompt/scripts/urls.txt).
2. Masukkan link/URL postingan X atau Threads yang berisi prompt (1 URL per baris).
3. Jalankan perintah:
```bash
npm run scrape
```

### Metode B: Menjalankan Langsung via CLI Argument
Anda bisa memberikan satu atau beberapa URL langsung di terminal:
```bash
node scripts/scrape_prompts.js https://x.com/TechieBySA/status/2017928823497453789 https://www.threads.net/@user/post/xyz123
```

---

## 3. Hasil Output & Alur Kerja Bot

Ketika bot dijalankan:
1. **Fetching**: Playwright membuka halaman postingan (secara headless).
2. **Ekstraksi Teks**: Mengambil teks prompt, nama author, username, serta statistik engagement (likes & views).
3. **Ekstraksi Gambar**: Mengunduh gambar preview beresolusi tinggi dan menyimpannya di folder:
   `public/images/prompts/{post_id}_0.jpg`
4. **Auto Tagging**:
   - **Model AI**: Mendeteksi otomatis apakah prompt ditujukan untuk `Midjourney`, `Flux`, `DALL-E 3`, `Stable Diffusion`, atau `gptimage`.
   - **Kategori**: Mendeteksi otomatis kategori seperti `UI & Graphic`, `Product & Brand`, `Photography`, `3D & Render`, `Poster Design`.
5. **Update Dataset**: Objek baru ditambahkan atau diperbarui di [src/data/prompts.json](file:///home/rayhan/Windows-D/project/tugas-bisnisdigital-prompt/src/data/prompts.json) dan peringkat kepopuleran (`rank`) akan disortir ulang secara otomatis.

---

## 4. Struktur Output JSON

Setiap item yang dihasilkan mengikuti skema `PromptItem`:

```json
{
  "rank": 1,
  "id": "2017928823497453789",
  "prompt": "Create a technical infographic of [OBJECT]...",
  "author": "TechieBySA",
  "author_name": "TechieSA",
  "likes": 3567,
  "views": 159772,
  "image": "/images/prompts/2017928823497453789_0.jpg",
  "images": [
    "/images/prompts/2017928823497453789_0.jpg"
  ],
  "model": "gptimage",
  "categories": [
    "UI & Graphic"
  ],
  "rating": 3,
  "score": 67.76,
  "date": "2026-07-31",
  "source_url": "https://x.com/TechieBySA/status/2017928823497453789",
  "isPremium": true,
  "cost": 400
}
```
