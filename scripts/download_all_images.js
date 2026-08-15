import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPTS_FILE = path.join(__dirname, '../src/data/prompts.json');
const OUTPUT_DIR = path.join(__dirname, '../public/images/prompts');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read prompts dataset
const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));

// Build download task list
const tasks = [];
const seenFiles = new Set();

prompts.forEach((p) => {
  const promptId = String(p.id);
  
  // Main image
  if (p.image && typeof p.image === 'string') {
    const fileName = `${promptId}.jpg`;
    if (!seenFiles.has(fileName)) {
      seenFiles.add(fileName);
      tasks.push({
        url: p.image,
        dest: path.join(OUTPUT_DIR, fileName),
        name: fileName,
        promptId
      });
    }
  }

  // Sub images in gallery
  if (Array.isArray(p.images)) {
    p.images.forEach((imgUrl, idx) => {
      if (imgUrl && typeof imgUrl === 'string') {
        const fileName = idx === 0 ? `${promptId}.jpg` : `${promptId}_${idx}.jpg`;
        if (!seenFiles.has(fileName)) {
          seenFiles.add(fileName);
          tasks.push({
            url: imgUrl,
            dest: path.join(OUTPUT_DIR, fileName),
            name: fileName,
            promptId
          });
        }
      }
    });
  }
});

console.log(`====================================================`);
console.log(`🚀 Memulai Download Otomatis ${tasks.length} Gambar Prompt`);
console.log(`📁 Lokasi Output: ${OUTPUT_DIR}`);
console.log(`====================================================\n`);

let completed = 0;
let skipped = 0;
let failed = 0;
const total = tasks.length;
const startTime = Date.now();

// Download a single file with retries
async function downloadFile(task, retries = 3) {
  // Check if file exists and has valid size
  try {
    if (fs.existsSync(task.dest)) {
      const stat = fs.statSync(task.dest);
      if (stat.size > 2000) {
        skipped++;
        completed++;
        return;
      }
    }
  } catch (e) {}

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(task.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(task.dest, buffer);
      completed++;
      return;
    } catch (err) {
      if (attempt === retries) {
        failed++;
        completed++;
        console.error(`❌ Gagal download [${task.name}]: ${err.message}`);
      } else {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }
}

// Concurrency pool runner
const CONCURRENCY = 16;
let taskIndex = 0;

async function worker() {
  while (taskIndex < tasks.length) {
    const current = tasks[taskIndex++];
    await downloadFile(current);
    
    // Print progress every 20 items or on completion
    if (completed % 20 === 0 || completed === total) {
      const percent = ((completed / total) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r⚡ Progress: ${completed}/${total} (${percent}%) | Waktu: ${elapsed}s | Skipped: ${skipped} | Failed: ${failed} `);
    }
  }
}

async function run() {
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  
  // Calculate total folder size
  let totalBytes = 0;
  const files = fs.readdirSync(OUTPUT_DIR);
  files.forEach(f => {
    try {
      totalBytes += fs.statSync(path.join(OUTPUT_DIR, f)).size;
    } catch (e) {}
  });

  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  console.log(`\n\n====================================================`);
  console.log(`✅ SEMUA GAMBAR BERHASIL DIUNDUH!`);
  console.log(`📊 Total File: ${files.length} gambar`);
  console.log(`💾 Total Ukuran Folder: ${totalMB} MB`);
  console.log(`⏱️ Waktu Eksekusi: ${totalTime} detik`);
  console.log(`====================================================\n`);
}

run();
