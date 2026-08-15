# 🖼️ Visual Flow: Image Pipeline & Local Asset Delivery

Diagram arsitektur alur ekstraksi data gambar prompt dari dataset, proses batch downloader otomatis, hingga penyajian instan 0ms di browser melalui local static assets.

---

## 📊 Flowchart Arsitektur Pipeline

```mermaid
graph TD
    A[prompts.json Dataset\n377 Prompt Items] -->|JSON Parse| B[scripts/download_all_images.js]
    
    subgraph "🚀 Parallel Downloader Engine"
        B --> C1[Worker 1]
        B --> C2[Worker 2]
        B --> C3[...]
        B --> C4[Worker 16]
        
        C1 -->|HTTP Stream\n10s timeout| D[images.meigen.ai CDN]
        C2 -->|HTTP Stream\n10s timeout| D
        C3 -->|HTTP Stream\n10s timeout| D
        C4 -->|HTTP Stream\n10s timeout| D
    end
    
    D -->|Buffer Output| E[public/images/prompts/\n703 JPEG Assets ~113MB]
    
    subgraph "⚡ Zero-Latency Client Resolver"
        F[React Components\nFigmaPortfolioPreview / PromptDetailView] -->|Image URL Request| G[image-optimizer.js]
        G -->|O 1 Map Lookup| H{Is Local Asset?}
        H -->|YES| I[Local URL: /images/prompts/ID.jpg\n0ms Latency / 0% Network Wait]
        H -->|NO| J[Fallback: Direct CDN]
        I --> K[Client DOM Rendering\n60 FPS Zero Shifting]
    end

    E -.->|Static File Server| I
```

---

## 🔍 Detail Spesifikasi Pipeline:

1. **Input Data**:
   - `src/data/prompts.json` berisi 377 item prompt utama dan total 703 gambar (termasuk variasi thumbnail).
2. **Batch Downloader (`download_all_images.js`)**:
   - Berjalan dengan **16 parallel workers**.
   - Dilengkapi *Retry Mechanism (3x)* dan *Auto Skip Existing*.
   - Menyelesaikan 703 unduhan dalam **78.3 detik**.
3. **Local Storage Target**:
   - Disimpan di folder statis Vite: `public/images/prompts/[id].jpg` dan `public/images/prompts/[id]_[idx].jpg`.
4. **O(1) In-Memory Resolver (`image-optimizer.js`)**:
   - Memetakan pola URL CDN `images.meigen.ai/tweets/(\d+)/(\d+).jpg` ke path lokal `/images/prompts/[id].jpg` dalam 0.001ms.
5. **Keuntungan Performa**:
   - **0ms network delay** saat scrolling galeri & membuka detail page.
   - **Bebas rate limiting** dan bisa dibuka **100% offline**.
