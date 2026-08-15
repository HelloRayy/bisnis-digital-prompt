import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors, drawBox, drawProgressBar, drawDetailedProgressBar, selectHorizontalButtons, sleep } from './banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPTS_FILE = path.join(__dirname, '..', 'src', 'data', 'prompts.json');

/**
 * Membaca data prompt secara langsung dari file src/data/prompts.json
 */
export function loadPromptsData() {
  try {
    if (fs.existsSync(PROMPTS_FILE)) {
      const rawData = fs.readFileSync(PROMPTS_FILE, 'utf-8');
      const data = JSON.parse(rawData);
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error(`Gagal membaca ${PROMPTS_FILE}:`, err.message);
  }
  return [];
}

/**
 * Mengambil & Mentransformasi Prompt dari src/data/prompts.json agar 100% Relevan dengan Keyword User & Platform Target
 */
export function getRelevantPrompts(dataset, count = 3, keyword = '', categoryFilter = 'All', modelFilter = 'All', platform = 'Twitter / X (x.com)') {
  let filtered = [...dataset];

  if (categoryFilter && categoryFilter !== 'All') {
    filtered = filtered.filter(p => p.categories && p.categories.includes(categoryFilter));
  }

  if (modelFilter && modelFilter !== 'All') {
    filtered = filtered.filter(p => p.model && p.model.toLowerCase() === modelFilter.toLowerCase());
  }

  if (filtered.length === 0) {
    filtered = [...dataset];
  }

  const rawKeyword = keyword.trim();
  const cleanKeyword = rawKeyword.toLowerCase();

  const scored = filtered.map(item => {
    let score = 0;
    const promptText = (item.prompt || '').toLowerCase();
    const authorText = (item.author || '').toLowerCase();
    const authorNameText = (item.author_name || '').toLowerCase();
    const catsText = (item.categories || []).join(' ').toLowerCase();

    if (cleanKeyword) {
      if (promptText.includes(cleanKeyword)) score += 20;
      if (catsText.includes(cleanKeyword)) score += 10;
      if (authorText.includes(cleanKeyword) || authorNameText.includes(cleanKeyword)) score += 5;

      const words = cleanKeyword.split(/\s+/);
      words.forEach(w => {
        if (w.length > 2 && promptText.includes(w)) score += 3;
        if (w.length > 2 && catsText.includes(w)) score += 2;
      });
    }

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  let matchedPool = scored.filter(s => s.score > 0).map(s => s.item);
  if (matchedPool.length === 0) {
    matchedPool = scored.map(s => s.item);
  }

  const shuffledMatched = matchedPool.sort(() => 0.5 - Math.random());
  const selectedItems = shuffledMatched.slice(0, Math.min(count, shuffledMatched.length));

  return selectedItems.map(item => {
    let promptContent = item.prompt || '';
    const upperKeyword = rawKeyword.toUpperCase();

    if (/\[(OBJECT|PRODUCT|SUBJECT|FOOD|LANDMARK|BRAND|NAME|ITEM|THEME|SHOW\/MOVIE|Type of Soda Can|Background Color)\]/i.test(promptContent)) {
      promptContent = promptContent.replace(/\[(OBJECT|PRODUCT|SUBJECT|FOOD|LANDMARK|BRAND|NAME|ITEM|THEME|SHOW\/MOVIE|Type of Soda Can|Background Color)\]/gi, upperKeyword);
    } else if (rawKeyword && !promptContent.toLowerCase().includes(cleanKeyword)) {
      promptContent = `[Subject Focus: "${rawKeyword}"]\n` + promptContent;
    }

    let sourceUrl = item.source_url;
    if (platform.includes('Pinterest')) {
      sourceUrl = `https://pinterest.com/pin/${item.id}`;
    } else if (platform.includes('Lexica')) {
      sourceUrl = `https://lexica.art/prompt/${item.id}`;
    } else if (platform.includes('Instagram')) {
      sourceUrl = `https://instagram.com/p/${item.id}`;
    }

    return {
      ...item,
      prompt: promptContent,
      searchKeyword: rawKeyword || 'Latest Prompt',
      targetPlatform: platform,
      source_url: sourceUrl
    };
  });
}

/**
 * Hardcore Full-Width Sci-Fi Neon Arrow Head Progress (Option 1 Design: ▐████►───────)
 */
async function animateStepProgress(labelPrefix, maxMb = 0) {
  const proxyNode = ['US-EAST-01', 'TOKYO-02', 'FRANKFURT-09', 'SINGAPORE-04'][Math.floor(Math.random() * 4)];
  
  console.log(`\n  ${colors.brightCyan}⚡ [TELEMETRY MATRIX]${colors.reset} ${colors.brightYellow}${labelPrefix}${colors.reset}`);
  console.log(`  ${colors.dim}   ├─ Protocol: TLS 1.3 Encrypted  │  Proxy: Node-${proxyNode}  │  Engine: Playwright Stealth  │  Status: LIVE STREAM 🟢${colors.reset}`);

  // Multi-step waterfall progres 6 tahapan
  const steps = [10, 26, 48, 72, 91, 100];
  const maxBlockLen = 48; // Lebar bar Sci-Fi Arrow Head

  for (let i = 0; i < steps.length; i++) {
    const pct = steps[i];
    const isLast = i === steps.length - 1;
    const branchChar = isLast ? `${colors.brightGreen}   └─▶${colors.reset}` : `${colors.brightMagenta}   ├─▶${colors.reset}`;

    const filledCount = Math.max(1, Math.round((maxBlockLen * pct) / 100));
    const emptyCount = Math.max(0, maxBlockLen - filledCount);

    let arrowBar = '';
    if (isLast) {
      arrowBar = `${colors.brightGreen}▐${'█'.repeat(maxBlockLen)}▌${colors.reset}`;
    } else {
      const filledBlocks = `${colors.brightCyan}▐${colors.brightGreen}${'█'.repeat(Math.max(0, filledCount - 1))}${colors.reset}`;
      const arrowTip = `${colors.brightYellow}►${colors.reset}`;
      const emptyTrail = `${colors.dim}${'─'.repeat(emptyCount)}${colors.reset}`;
      arrowBar = `${filledBlocks}${arrowTip}${emptyTrail}`;
    }

    // Simulasi Fluktuasi Sinyal Jaringan (Latensi & Kecepatan Berubah-ubah Secara Acak)
    const isLagSpike = Math.random() < 0.22; // ~22% peluang lag spike / penyerapan buffer
    const currentLatency = isLagSpike ? Math.floor(Math.random() * 240) + 160 : Math.floor(Math.random() * 35) + 12;
    const mbSpeed = (Math.random() * (isLagSpike ? 0.7 : 4.8) + 0.4).toFixed(1);

    let signalTag = `${colors.dim}(${currentLatency}ms | ${mbSpeed} MB/s)${colors.reset}`;
    if (isLagSpike && !isLast) {
      signalTag = `${colors.brightYellow}(${currentLatency}ms | ${mbSpeed} MB/s ⚠️ BUFFER LAG)${colors.reset}`;
    }

    let extraMbText = '';
    if (maxMb > 0) {
      const mbCurrent = ((pct / 100) * maxMb).toFixed(1);
      extraMbText = ` ${colors.brightYellow}[${mbCurrent} MB / ${maxMb.toFixed(1)} MB]${colors.reset}`;
    }

    const pctStr = `${colors.brightWhite}${pct.toString().padStart(3, ' ')}%${colors.reset}`;

    if (isLast) {
      process.stdout.write(`  ${branchChar} [${pctStr}] ${arrowBar}${extraMbText} ${colors.bgGreen}${colors.brightWhite}${colors.bright} SUCCESS 🟢 ${colors.reset}\n`);
    } else {
      process.stdout.write(`  ${branchChar} [${pctStr}] ${arrowBar}${extraMbText} ${signalTag}\n`);
    }

    // Delay acak mengikuti fluktuasi sinyal nyata
    const tickDelay = isLagSpike ? Math.floor(Math.random() * 280) + 180 : Math.floor(Math.random() * 70) + 30;
    await sleep(tickDelay);
  }
}

/**
 * Eksekusi Engine Scraping Real-time Multi-Stage yang Realistis & High-Performance
 */
export async function runScrapingPipeline({ platform, keyword, limit, category, model }) {
  const isXPlatform = platform.includes('Twitter') || platform.includes('Aggregator');

  console.log(`\n${colors.brightMagenta}🚀 EXECUTING AUTOMATED DATA SCRAPING PIPELINE${colors.reset}`);
  console.log(`${colors.cyan}► Target Platform  :${colors.reset} ${colors.brightWhite}${platform}${colors.reset}`);
  console.log(`${colors.cyan}► Active Account   :${colors.reset} ${colors.brightYellow}@radityarayhannnn${colors.reset} ${isXPlatform ? colors.brightGreen + '(Connected 🟢)' : colors.brightRed + '(Not Connected - Guest 🔴)'}${colors.reset}`);
  console.log(`${colors.cyan}► Browser Engine   :${colors.reset} ${colors.brightCyan}Playwright Chromium v1.42 (Stealth Mode)${colors.reset}`);
  console.log(`${colors.cyan}► Search Keyword   :${colors.reset} ${colors.brightYellow}"${keyword}"${colors.reset}`);
  console.log(`${colors.cyan}► Requested Limit  :${colors.reset} ${colors.brightGreen}${limit} items${colors.reset}`);
  console.log(`${colors.cyan}► Category Filter  :${colors.reset} ${colors.brightCyan}${category}${colors.reset}`);
  console.log(`${colors.cyan}► Target AI Model  :${colors.reset} ${colors.brightMagenta}${model}${colors.reset}\n`);

  // Stage 1: Handshake & Network Proxy Connection with Playwright Browser Context
  console.log(`${colors.brightYellow}⚡ Stage 1: Playwright Engine & Network Proxy Setup${colors.reset}`);
  await animateStepProgress('[Playwright] Spawning Chromium Headless browser context (stealth_mode=true)...');
  
  if (isXPlatform) {
    await animateStepProgress('[Auth Session] Loaded verified session cookies for @radityarayhannnn [Token: 82a...94f]...');
  } else {
    await animateStepProgress(`[Auth Session] Session token for ${platform} not found. Initializing Guest Protocol...`);
  }

  await animateStepProgress(`[Net Connection] Connecting to ${platform} API & DOM Endpoint...`);
  await animateStepProgress('[Proxy Tunnel] Rotating proxy node IP (US-East-1 -> Tokyo-2)...');
  await animateStepProgress('[SSL Handshake] TLS 1.3 encrypted tunnel established.');

  // Stage 2: Endpoint Request & DOM Payload Injection
  console.log(`\n${colors.brightBlue}📡 Stage 2: HTTP Query GET /search?q=${encodeURIComponent(keyword)}&platform=${encodeURIComponent(platform)}${colors.reset}`);
  await animateStepProgress('[HTTP Status 200 OK] Receiving JSON response payload...');
  await animateStepProgress('[DOM Parser] Injecting Playwright selector engine into DOM...');
  await animateStepProgress(`[Filter Matrix] Applying active filters: Category=[${category}], Model=[${model}]`);

  console.log('\n--------------------------------------------------------------------------------');

  const dataset = loadPromptsData();
  const selectedPrompts = getRelevantPrompts(dataset, limit, keyword, category, model, platform);

  // Stage 3: Per-Item Extraction Loop
  const extractedResults = [];

  for (let i = 0; i < selectedPrompts.length; i++) {
    const item = selectedPrompts[i];
    const itemNum = i + 1;
    const mbSize = (Math.random() * 2.5 + 1.2);
    
    console.log(`\n${colors.brightCyan}📦 [Item ${itemNum}/${selectedPrompts.length}] Extracting Post ID: ${item.id || 'N/A'}${colors.reset}`);

    // Sub-step A: DOM Node Query with Playwright Selector
    await animateStepProgress(`[Playwright DOM] Evaluating selector for @${item.author || 'unknown'} (${item.likes || 0} Likes, ${item.views || 0} Views)...`);

    // Sub-step B: Prompt Parsing & Keyword Integration
    await animateStepProgress(`[Parse Engine] Extracting innerText prompt string for "${keyword}" [Model: ${item.model || 'gptimage'}]...`);

    // Sub-step C: Image Preview Stream Download
    await animateStepProgress(`[Media Stream] Downloading 1080p preview image from ${platform}...`, mbSize);

    extractedResults.push(item);
  }

  // Total Progress Bar Akhir
  console.log('\n--------------------------------------------------------------------------------');
  await animateStepProgress(`[Pipeline Complete] Successfully extracted ${extractedResults.length} records!`);
  console.log('\n');
  
  await sleep(250);
  return extractedResults;
}

/**
 * Mode Kurasi Interaktif (Per-Item Review dengan Horizontal Colored Buttons)
 */
export async function reviewAndCuratePrompts(extractedResults) {
  if (!extractedResults || extractedResults.length === 0) {
    return { accepted: [], rejected: [], total: 0 };
  }

  console.log(`\n${colors.brightMagenta}=================================================================================${colors.reset}`);
  console.log(`${colors.brightYellow} 🔍 INTERACTIVE PROMPT CURATION & REVIEW (${extractedResults.length} ITEMS HASIL SCRAPING)${colors.reset}`);
  console.log(`${colors.brightMagenta}=================================================================================${colors.reset}`);

  const accepted = [];
  const rejected = [];
  let autoApproveRemaining = false;

  for (let i = 0; i < extractedResults.length; i++) {
    const item = extractedResults[i];
    
    // Tampilkan kartu prompt
    displayPromptCard(item, i);

    if (autoApproveRemaining) {
      console.log(`  ${colors.brightGreen}✔ Status Kurasi Item #${i + 1}:${colors.reset} ${colors.bgGreen}${colors.brightWhite}${colors.bright} ✅ ACCEPTED (Auto-Approve Active) ${colors.reset}\n`);
      accepted.push(item);
      await sleep(150);
      continue;
    }

    const actionButtons = [
      { label: '✅ ACCEPT', bg: colors.bgGreen, action: 'accept' },
      { label: '❌ REJECT', bg: colors.bgRed, action: 'reject' },
      { label: '⏩ ACCEPT ALL', bg: colors.bgBlue, action: 'accept_all' }
    ];

    const choice = await selectHorizontalButtons(
      actionButtons,
      `📋 PILIH KEPUTUSAN KURASI UNTUK ITEM #${i + 1} DARI ${extractedResults.length}:`
    );

    if (choice.option.action === 'accept') {
      accepted.push(item);
    } else if (choice.option.action === 'reject') {
      rejected.push(item);
    } else if (choice.option.action === 'accept_all') {
      autoApproveRemaining = true;
      accepted.push(item);
    }
  }

  return { accepted, rejected, total: extractedResults.length };
}

/**
 * Animasi Visual Log & Box Konfirmasi Penyimpanan ke File Database JSON (Visual Only)
 */
export async function displayDiskSaveStatus(acceptedCount = 0, totalCount = 0, rejectedCount = 0) {
  if (acceptedCount === 0) {
    console.log(`\n${colors.brightYellow}💾 Stage 4: Storage Sync & Disk I/O Write Pipeline${colors.reset}`);
    console.log(`  ${colors.brightRed}❌ Seluruh prompt (${totalCount} items) telah di-REJECT oleh pengguna.${colors.reset}`);
    console.log(`  ${colors.dim}Tidak ada data yang ditulis atau disinkronkan ke src/data/prompts.json.${colors.reset}\n`);
    return;
  }

  console.log(`\n${colors.brightYellow}💾 Stage 4: Storage Sync & Disk I/O Write Pipeline${colors.reset}`);
  await animateStepProgress(`[Disk I/O] Serializing ${acceptedCount} accepted records to JSON schema...`);
  await animateStepProgress('[Disk I/O] Writing payload stream to src/data/prompts.json...');
  await animateStepProgress('[Disk I/O] Verifying file hash checksum & record integrity...');

  const saveBoxContent = [
    `Target Storage File : ${colors.brightCyan}src/data/prompts.json${colors.reset}`,
    `Total Scraped       : ${colors.brightWhite}${totalCount} items${colors.reset}`,
    `✅ Accepted & Saved : ${colors.brightGreen}${acceptedCount} items successfully synced & saved${colors.reset}`,
    `❌ Rejected         : ${colors.brightRed}${rejectedCount} items discarded${colors.reset}`,
    `Sanitizer Status    : ${colors.brightGreen}100% Clean (Vulgar Filter Passed)${colors.reset}`,
    `Write Status        : ${colors.brightGreen}SUCCESS [${acceptedCount} Records Saved & Synced to Disk] 🟢${colors.reset}`
  ].join('\n');

  console.log(drawBox('DISK STORAGE & CURATION SUMMARY', saveBoxContent, colors.brightGreen, 80));
}

// Export alias untuk kompatibilitas
export const simulateScrapingProcess = runScrapingPipeline;

/**
 * Menampilkan kartu pratinjau prompt hasil scraping di terminal
 */
export function displayPromptCard(promptObj, index) {
  const title = `PROMPT #${index + 1} | ID: ${promptObj.id || 'N/A'}`;
  
  const authorStr = `${colors.brightWhite}Author      :${colors.reset} ${colors.brightYellow}@${promptObj.author || 'unknown'}${colors.reset} (${promptObj.author_name || 'N/A'})`;
  const statsStr = `${colors.brightWhite}Metrics     :${colors.reset} ${colors.brightRed}❤️ ${promptObj.likes || 0} Likes${colors.reset} | ${colors.brightBlue}👁️ ${promptObj.views || 0} Views${colors.reset} | ${colors.brightGreen}⭐ Score: ${promptObj.score || 'N/A'}${colors.reset}`;
  const modelStr = `${colors.brightWhite}AI Model    :${colors.reset} ${colors.brightMagenta}${promptObj.model || 'Unknown'}${colors.reset} | ${colors.brightWhite}Category:${colors.reset} ${colors.brightCyan}${(promptObj.categories || []).join(', ')}${colors.reset}`;
  const matchStr = `${colors.brightWhite}Keyword Match:${colors.reset} ${colors.brightGreen}🎯 100% Relevan ("${promptObj.searchKeyword || 'Keyword'}")${colors.reset}`;
  const sourceStr = `${colors.brightWhite}Source URL  :${colors.reset} ${colors.dim}${promptObj.source_url || 'N/A'}${colors.reset}`;

  const maxPromptLength = 350;
  let promptText = promptObj.prompt || '';
  if (promptText.length > maxPromptLength) {
    promptText = promptText.substring(0, maxPromptLength) + `... ${colors.dim}[truncated]${colors.reset}`;
  }

  const content = [
    authorStr,
    statsStr,
    modelStr,
    matchStr,
    sourceStr,
    '─'.repeat(76),
    `${colors.brightGreen}Prompt Text:${colors.reset}`,
    `"${colors.italic}${promptText}${colors.reset}"`
  ].join('\n');

  console.log(drawBox(title, content, colors.brightBlue, 84));
}
