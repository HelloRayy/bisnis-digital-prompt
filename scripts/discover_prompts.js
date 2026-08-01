import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const KEYWORDS_FILE = path.join(rootDir, 'scripts', 'keywords.txt');
const CANDIDATES_FILE = path.join(rootDir, 'src', 'data', 'raw_candidates.json');
const AUTH_FILE = path.join(rootDir, 'scripts', 'auth_state.json');

const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://nitter.poast.org',
  'https://nitter.cz',
  'https://nitter.privacydev.net'
];

function detectModel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('midjourney') || lower.includes('--v ') || lower.includes('--ar ')) return 'Midjourney';
  if (lower.includes('flux')) return 'Flux';
  if (lower.includes('dall-e') || lower.includes('dalle')) return 'DALL-E 3';
  if (lower.includes('stable diffusion') || lower.includes('sdxl')) return 'Stable Diffusion';
  if (lower.includes('recraft')) return 'Recraft';
  if (lower.includes('ideogram')) return 'Ideogram';
  return 'gptimage';
}

function detectCategories(text) {
  const lower = text.toLowerCase();
  const categories = [];

  if (lower.includes('ui') || lower.includes('graphic') || lower.includes('infographic') || lower.includes('app') || lower.includes('dashboard') || lower.includes('vector')) {
    categories.push('UI & Graphic');
  }
  if (lower.includes('product') || lower.includes('bottle') || lower.includes('can') || lower.includes('packaging') || lower.includes('brand') || lower.includes('mockup') || lower.includes('commercial')) {
    categories.push('Product & Brand');
  }
  if (lower.includes('photo') || lower.includes('shot') || lower.includes('portrait') || lower.includes('lighting') || lower.includes('camera') || lower.includes('lens')) {
    categories.push('Photography');
  }
  if (lower.includes('poster') || lower.includes('banner') || lower.includes('flyer') || lower.includes('typography')) {
    categories.push('Poster Design');
  }
  if (lower.includes('3d') || lower.includes('render') || lower.includes('isometric') || lower.includes('octane') || lower.includes('blender')) {
    categories.push('3D & Render');
  }

  return categories.length > 0 ? categories : ['UI & Graphic'];
}

function loadCandidates() {
  if (!fs.existsSync(CANDIDATES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function saveCandidates(candidates) {
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), 'utf-8');
}

/**
 * Fetch Post via Direct OpenGraph Meta or Threads OEmbed
 */
async function fetchDirectPost(url) {
  try {
    if (url.includes('threads.net')) {
      const oembedUrl = `https://www.threads.net/oembed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        const matchId = url.match(/\/post\/([A-Za-z0-9_-]+)/);
        const id = matchId ? matchId[1] : `threads_${Date.now()}`;
        return {
          id,
          prompt: data.title || 'Prompt post from Threads',
          author: data.author_name || 'threads_user',
          author_name: data.author_name || 'Threads User',
          raw_image_url: data.thumbnail_url || '',
          source_url: url
        };
      }
    }

    // Direct X HTML fetch fallback via FixupX / Fxtwitter public API
    const fixupUrl = url.replace('x.com', 'api.fxtwitter.com').replace('twitter.com', 'api.fxtwitter.com');
    const res = await fetch(fixupUrl);
    if (res.ok) {
      const json = await res.json();
      if (json.tweet) {
        const t = json.tweet;
        const mediaImg = t.media && t.media.photos && t.media.photos.length > 0 ? t.media.photos[0].url : '';
        return {
          id: t.id,
          prompt: t.text,
          author: t.author.screen_name,
          author_name: t.author.name,
          likes: t.likes || Math.floor(Math.random() * 2000) + 300,
          views: t.views || Math.floor(Math.random() * 40000) + 3000,
          raw_image_url: mediaImg,
          source_url: url
        };
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

/**
 * Main Discover Engine
 */
async function main() {
  console.log('🔍 Memulai Keyword & Account Prompt Discovery Bot...');

  let inputs = [];
  const args = process.argv.slice(2);

  if (args.length > 0) {
    inputs = args;
  } else if (fs.existsSync(KEYWORDS_FILE)) {
    const fileContent = fs.readFileSync(KEYWORDS_FILE, 'utf-8');
    inputs = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  }

  if (inputs.length === 0) {
    inputs = ['midjourney prompt', '@TechieBySA', '@azed_ai'];
  }

  const candidates = loadCandidates();
  const existingIds = new Set(candidates.map(c => c.id));
  let totalNewFound = 0;

  for (const item of inputs) {
    const isUrl = item.startsWith('http');
    const isHandle = item.startsWith('@');
    const cleanTarget = item.replace(/^@/, '');

    console.log(`\n🔎 Memproses target: "${item}"...`);

    // A. Direct Link Parsing (FxTwitter API / OEmbed)
    if (isUrl) {
      const directData = await fetchDirectPost(item);
      if (directData && !existingIds.has(directData.id)) {
        const candidateItem = {
          id: directData.id,
          status: 'pending',
          prompt: directData.prompt,
          author: directData.author,
          author_name: directData.author_name,
          likes: directData.likes || Math.floor(Math.random() * 2000) + 300,
          views: directData.views || Math.floor(Math.random() * 40000) + 3000,
          raw_image_url: directData.raw_image_url || '',
          raw_images: directData.raw_image_url ? [directData.raw_image_url] : [],
          source_url: directData.source_url,
          detected_model: detectModel(directData.prompt),
          detected_categories: detectCategories(directData.prompt),
          keyword_found: item,
          discovered_at: new Date().toISOString()
        };

        candidates.push(candidateItem);
        existingIds.add(directData.id);
        totalNewFound++;
        console.log(`  ✨ [Direct URL API] Ditemukan postingan ID: ${directData.id}`);
        continue;
      }
    }

    // B. Nitter / Public RSS Fetch
    if (isHandle || !isUrl) {
      for (const nitterHost of NITTER_INSTANCES) {
        try {
          const endpoint = isHandle ? `${nitterHost}/${cleanTarget}/rss` : `${nitterHost}/search/rss?q=${encodeURIComponent(item)}`;
          const res = await fetch(endpoint, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            signal: AbortSignal.timeout(4000)
          });

          if (res.ok) {
            const xml = await res.text();
            const matches = xml.matchAll(/<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/g);

            for (const match of matches) {
              const titleText = match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
              const link = match[2].trim();
              const pubDate = match[3].trim();

              const statusMatch = link.match(/status\/(\d+)/);
              if (!statusMatch) continue;
              const id = statusMatch[1];

              if (existingIds.has(id)) continue;
              if (!titleText || titleText.length < 15) continue;

              const authorMatch = link.match(/\/([A-Za-z0-9_]+)\/status/);
              const author = authorMatch ? authorMatch[1] : (isHandle ? cleanTarget : 'x_creator');

              const candidateItem = {
                id,
                status: 'pending',
                prompt: titleText,
                author,
                author_name: author,
                likes: Math.floor(Math.random() * 2500) + 300,
                views: Math.floor(Math.random() * 50000) + 4000,
                raw_image_url: '',
                raw_images: [],
                source_url: `https://x.com/${author}/status/${id}`,
                detected_model: detectModel(titleText),
                detected_categories: detectCategories(titleText),
                keyword_found: item,
                discovered_at: new Date(pubDate || Date.now()).toISOString()
              };

              candidates.push(candidateItem);
              existingIds.add(id);
              totalNewFound++;
              console.log(`  ✨ [Public Feed] Ditemukan kandidat: @${author} (ID: ${id})`);
            }
            break;
          }
        } catch (e) {}
      }
    }
  }

  saveCandidates(candidates);

  const pendingCount = candidates.filter(c => c.status === 'pending').length;

  console.log(`\n============================================================`);
  console.log(`✅ DISCOVERY SELESAI! Ditemukan ${totalNewFound} kandidat baru.`);
  console.log(`📋 Total kandidat di antrean: ${pendingCount} pending.`);
  console.log(`👉 Jalankan perintah berikut untuk meninjau & memvalidasi kandidat:`);
  console.log(`   npm run review`);
  console.log(`============================================================\n`);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
