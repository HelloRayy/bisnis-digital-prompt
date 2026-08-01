# Panduan Prompt Engineering (AI Prompt Guide)

Dokumen ini berisi panduan teknis penulisan prompt untuk menghasilkan gambar/media berkualitas tinggi menggunakan model AI seperti Midjourney, Stable Diffusion, dan Flux.

---

## 1. Pemahaman Dasar Prompting
Prompting adalah cara mengomunikasikan instruksi kepada model AI. Prompt yang baik umumnya terdiri dari elemen-elemen berikut:
- **Subjek**: Apa objek utama dalam gambar? (e.g., *a futuristic car*, *a cyberpunk warrior*)
- **Gaya (Style)**: Bagaimana tampilan visualnya? (e.g., *photorealistic*, *3D render*, *watercolor*)
- **Detail Lingkungan**: Di mana lokasinya? Bagaimana cuacanya? (e.g., *neon-lit streets*, *rainy night*)
- **Pencahayaan (Lighting)**: Bagaimana arah dan kualitas cahaya? (e.g., *cinematic lighting*, *golden hour*, *volumetric fog*)
- **Sudut Kamera / Komposisi**: Sudut pengambilan gambar (e.g., *isometric 3D perspective*, *macro close-up*, *low-angle shot*)

---

## 2. Menggunakan Variabel Dinamis (Variable Tags)
Situs seperti Meigen.ai menggunakan tag variabel seperti `[OBJECT]` atau `[SUBJECT]` agar prompt dapat digunakan kembali dengan mudah. 

### Contoh Penggunaan:
* **Template**:
  > "Low-angle fashion campaign photograph of a model holding a [product name] close to the camera, clean pure white studio background, sharp focus."
* **Hasil Remix**:
  - Ganti `[product name]` dengan **luxury leather handbag**.
  - Ganti `[product name]` dengan **neon glowing perfume bottle**.

---

## 3. JSON-Style Prompting (Advanced)
JSON-style prompting adalah teknik menyusun prompt menggunakan format JSON terstruktur. Teknik ini sangat populer untuk model canggih seperti **Flux** and **Midjourney v6** karena memberikan kontrol yang sangat presisi terhadap detail objek dan layout.

### Contoh Template JSON:
```json
{
  "global_settings": {
    "resolution": "8K ultra-high-definition",
    "style": "commercial product photography",
    "lighting": "cinematic studio lighting"
  },
  "subject": {
    "type": "[PRODUCT_TYPE]",
    "color": "[COLOR]",
    "surface_details": "condensation droplets"
  },
  "background": {
    "color_gradient": "dark blue to warm amber",
    "bokeh": "soft circular particles"
  }
}
```

---

## 4. Tips Mengoptimalkan Model AI
* **Midjourney**: Gunakan parameter seperti `--ar 16:9` (aspect ratio) atau `--stylize 250` untuk meningkatkan estetika visual.
* **Flux**: Model ini sangat bagus dalam merender teks. Pastikan teks yang ingin ditampilkan diletakkan di dalam tanda kutip dua (e.g., `text "NEW LOOK" on label`).
* **DALL-E 3**: Sangat patuh pada detail teks panjang, namun performa estetikanya terkadang terlalu artifisial tanpa arahan gaya yang spesifik.
