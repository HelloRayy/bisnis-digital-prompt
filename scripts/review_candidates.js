import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CANDIDATES_FILE = path.join(rootDir, 'src', 'data', 'raw_candidates.json');
const PROMPTS_FILE = path.join(rootDir, 'src', 'data', 'prompts.json');
const IMAGES_DIR = path.join(rootDir, 'public', 'images', 'prompts');

// Pastikan folder gambar ada
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Unduh gambar preview ke folder lokal
 */
async function downloadImage(url, destPath) {
  if (!url) return false;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!response.ok) return false;
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    return true;
  } catch (err) {
    console.error(`  ❌ Gagal unduh gambar: ${err.message}`);
    return false;
  }
}

/**
 * Helper Readline Prompt
 */
function askQuestion(rl, query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Main Interactive CLI Reviewer
 */
async function main() {
  console.log('\n============================================================');
  console.log('📌 INTERACTIVE PROMPT CANDIDATE REVIEWER');
  console.log('============================================================\n');

  if (!fs.existsSync(CANDIDATES_FILE)) {
    console.log('⚠️ Belum ada file kandidat `src/data/raw_candidates.json`.');
    console.log('👉 Jalankan `npm run discover` terlebih dahulu untuk mencari kandidat!');
    process.exit(0);
  }

  let candidates = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf-8'));
  let pendingCandidates = candidates.filter(c => c.status === 'pending');

  if (pendingCandidates.length === 0) {
    console.log('🎉 Tidak ada kandidat pending yang perlu ditinjau!');
    console.log('💡 Jalankan `npm run discover` untuk mencari kandidat prompt baru.');
    process.exit(0);
  }

  // Load prompts.json
  let dataset = [];
  if (fs.existsSync(PROMPTS_FILE)) {
    try {
      dataset = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf-8'));
    } catch (e) {
      dataset = [];
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let approvedCount = 0;
  let rejectedCount = 0;

  for (let i = 0; i < pendingCandidates.length; i++) {
    const item = pendingCandidates[i];

    console.log('\n' + '='.repeat(64));
    console.log(`📌 KANDIDAT PROMPT [${i + 1} / ${pendingCandidates.length}]`);
    console.log('='.repeat(64));
    console.log(`🔗 Link Sumber : ${item.source_url}`);
    console.log(`👤 Author      : ${item.author_name} (@${item.author})`);
    console.log(`❤️ Likes       : ${item.likes.toLocaleString()} | 👁️ Views: ${item.views.toLocaleString()}`);
    console.log(`🤖 Model AI    : ${item.detected_model}`);
    console.log(`🏷️ Kategori    : ${item.detected_categories.join(', ')}`);
    console.log(`📸 Gambar      : ${item.raw_image_url || '(Tidak ada gambar)'}`);
    console.log('-'.repeat(64));
    console.log('📝 PROMPT TEXT:');
    console.log(`"${item.prompt}"`);
    console.log('='.repeat(64));

    let action = '';
    while (!['a', 'e', 'r', 's', 'q'].includes(action)) {
      const answer = await askQuestion(
        rl,
        '\nPilih Tindakan: [A]pprove | [E]dit | [R]eject | [S]kip | [Q]uit : '
      );
      action = answer.trim().toLowerCase();
    }

    if (action === 'q') {
      console.log('\n🚪 Keluar dari sesi peninjauan.');
      break;
    }

    if (action === 's') {
      console.log('⏭️ Dilewati sementara.');
      continue;
    }

    if (action === 'r') {
      item.status = 'rejected';
      rejectedCount++;
      console.log('🗑️ Candidate ditolak (Rejected).');
      continue;
    }

    let finalPromptText = item.prompt;
    let finalModel = item.detected_model;
    let finalCategories = item.detected_categories;

    if (action === 'e') {
      console.log('\n--- ✏️ EDIT PROMPT CANDIDATE ---');
      const editedText = await askQuestion(rl, `Teks Prompt (${item.prompt.slice(0, 30)}...): `);
      if (editedText.trim()) finalPromptText = editedText.trim();

      const editedModel = await askQuestion(rl, `Model AI (${finalModel}): `);
      if (editedModel.trim()) finalModel = editedModel.trim();

      const editedCat = await askQuestion(rl, `Kategori (pisah koma) (${finalCategories.join(', ')}): `);
      if (editedCat.trim()) {
        finalCategories = editedCat.split(',').map(c => c.trim()).filter(Boolean);
      }
    }

    // Process Approve
    console.log('  📸 Mengunduh gambar preview...');
    const filename = `${item.id}_0.jpg`;
    const localImgPath = path.join(IMAGES_DIR, filename);
    const relativeImgUrl = `/images/prompts/${filename}`;

    let mainImage = relativeImgUrl;
    if (item.raw_image_url) {
      const downloaded = await downloadImage(item.raw_image_url, localImgPath);
      if (!downloaded) mainImage = item.raw_image_url;
    }

    const likes = item.likes || 100;
    const views = item.views || 1000;
    const score = Number(((likes * 0.7) + ((views / 100) * 0.3)).toFixed(2));
    const rating = score > 60 ? 3 : score > 30 ? 2 : 1;
    const dateStr = new Date().toISOString().split('T')[0];

    const newPromptItem = {
      rank: dataset.length + 1,
      id: item.id,
      prompt: finalPromptText,
      author: item.author,
      author_name: item.author_name,
      likes,
      views,
      image: mainImage,
      images: [mainImage],
      model: finalModel,
      categories: finalCategories,
      rating,
      score,
      date: dateStr,
      source_url: item.source_url,
      isPremium: true,
      cost: 400
    };

    // Update or Insert to dataset
    const existIdx = dataset.findIndex(d => d.id === item.id);
    if (existIdx >= 0) {
      dataset[existIdx] = { ...dataset[existIdx], ...newPromptItem };
    } else {
      dataset.push(newPromptItem);
    }

    item.status = 'approved';
    approvedCount++;
    console.log('✅ Approved & ditambahkan ke dataset!');
  }

  rl.close();

  // Re-index ranks
  dataset.sort((a, b) => (b.score || 0) - (a.score || 0));
  dataset.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  // Save changes
  fs.writeFileSync(PROMPTS_FILE, JSON.stringify(dataset, null, 2), 'utf-8');
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), 'utf-8');

  console.log(`\n============================================================`);
  console.log(`🎉 Sesi Peninjauan Selesai!`);
  console.log(`✅ Approved : ${approvedCount} item`);
  console.log(`🗑️ Rejected : ${rejectedCount} item`);
  console.log(`📁 Dataset Updated: ${PROMPTS_FILE} (Total: ${dataset.length} items)`);
  console.log(`============================================================\n`);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
