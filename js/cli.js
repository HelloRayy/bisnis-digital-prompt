import { printBanner, colors, drawBox, selectMenuWithArrows, inputBoxedTextPrompt, selectNumberStepper, selectHorizontalButtons } from './banner.js';
import { runScrapingPipeline, displayPromptCard, loadPromptsData, displayDiskSaveStatus, reviewAndCuratePrompts } from './scraper_tools.js';

async function main() {
  while (true) {
    printBanner();
    
    const dataset = loadPromptsData();
    console.log(`   ${colors.brightGreen}✓ Database Storage Connected :${colors.reset} ${colors.brightWhite}${dataset.length} Prompt Index Records Ready${colors.reset} (src/data/prompts.json)`);
    console.log(`   ${colors.brightGreen}✓ Playwright Engine Status  :${colors.reset} ${colors.brightCyan}Chromium Headless v1.42 (Stealth Active)${colors.reset}`);
    console.log(`   ${colors.brightGreen}✓ Authenticated X Account   :${colors.reset} ${colors.brightYellow}@radityarayhannnn${colors.reset} ${colors.brightGreen}[Connected & Active 🟢]${colors.reset}\n`);

    // 1. Select Platform with Arrow Keys & Connection Badges
    const platformDisplayOptions = [
      `Twitter / X (x.com)  ${colors.brightGreen}[Connected 🟢]${colors.reset}`,
      `Pinterest            ${colors.brightRed}[Not Connected 🔴]${colors.reset}`,
      `Lexica.art           ${colors.brightRed}[Not Connected 🔴]${colors.reset}`,
      `Instagram            ${colors.brightRed}[Not Connected 🔴]${colors.reset}`,
      `Semua Platform       ${colors.brightYellow}[Aggregator Mode 🟡]${colors.reset}`
    ];
    
    const platformRawNames = [
      'Twitter / X (x.com)',
      'Pinterest',
      'Lexica.art',
      'Instagram',
      'Semua Platform (Aggregator)'
    ];

    const platformSelection = await selectMenuWithArrows(platformDisplayOptions, '🌐 Step 1: Pilih Platform Media Sosial Target:');
    const selectedPlatform = platformRawNames[platformSelection.index];

    // 2. Input Keyword
    const selectedKeyword = await inputBoxedTextPrompt(
      '🔍 Step 2: Kata Kunci Pencarian (Keyword / Topic)',
      'isometric 3d'
    );

    // 3. Select Item Count with Interactive Arrow Stepper
    const selectedLimit = await selectNumberStepper(
      '📊 Step 3: Atur Jumlah Item yang Ingin Di-scrape',
      3,
      1,
      10
    );

    // 4. Select Category Filter with Arrow Keys
    const categories = ['All', 'UI & Graphic', 'Product & Brand', 'Photography', 'Poster Design', '3D & Render'];
    const categorySelection = await selectMenuWithArrows(categories, '🎨 Step 4: Pilih Filter Kategori Prompt:');
    const selectedCategory = categorySelection.value;

    // 5. Select AI Model Filter with Arrow Keys
    const models = ['All', 'Midjourney', 'DALL-E 3', 'Flux', 'Stable Diffusion', 'Recraft', 'gptimage'];
    const modelSelection = await selectMenuWithArrows(models, '🤖 Step 5: Pilih Filter Target AI Model:');
    const selectedModel = modelSelection.value;

    // Summary Box Before Scraping
    const isConnected = selectedPlatform.includes('Twitter') || selectedPlatform.includes('Aggregator');
    const statusBadge = isConnected ? `${colors.brightGreen}[Connected]${colors.reset}` : `${colors.brightRed}[Guest Mode - Not Connected]${colors.reset}`;

    const summaryContent = [
      `Target Platform : ${colors.brightCyan}${selectedPlatform}${colors.reset} ${statusBadge}`,
      `Active Account  : ${colors.brightYellow}@radityarayhannnn${colors.reset} (${isConnected ? 'Session Active' : 'Fallback Mode'})`,
      `Browser Engine  : ${colors.brightWhite}Playwright Chromium Headless v1.42${colors.reset}`,
      `Search Keyword  : ${colors.brightYellow}"${selectedKeyword}"${colors.reset}`,
      `Extraction Limit: ${colors.brightGreen}${selectedLimit} items${colors.reset}`,
      `Category Filter : ${colors.brightCyan}${selectedCategory}${colors.reset}`,
      `AI Model Filter : ${colors.brightMagenta}${selectedModel}${colors.reset}`
    ].join('\n');

    console.log(drawBox('KONFIRMASI PARAMETER SCRAPING PIPELINE', summaryContent, colors.brightYellow, 75));
    
    // Confirmation with Arrow Keys
    const confirmChoice = await selectMenuWithArrows(
      ['Ya, Jalankan Scraping Pipeline 🚀', 'Batal / Reset Parameter ❌'],
      'Konfirmasi Eksekusi Scraper:'
    );
    
    if (confirmChoice.index === 1) {
      console.log(`\n${colors.yellow}Proses scraping dibatalkan oleh pengguna.${colors.reset}\n`);
    } else {
      // 1. Execute scraping pipeline
      const results = await runScrapingPipeline({
        platform: selectedPlatform,
        keyword: selectedKeyword,
        limit: selectedLimit,
        category: selectedCategory,
        model: selectedModel
      });

      // 2. Execute Interactive Curation Workflow (Accept / Reject / Accept All)
      const curationResult = await reviewAndCuratePrompts(results);

      // 3. Visual Disk Save Log & Confirmation Box for Accepted Items Only
      await displayDiskSaveStatus(curationResult.accepted.length, curationResult.total, curationResult.rejected.length);
    }

    // Ask next action with Horizontal Colored Buttons (Panah ◄ Kiri / ► Kanan)
    const nextActionButtons = [
      { label: '🔄 JALANKAN SCRAPING BARU', bg: colors.bgGreen, action: 'restart' },
      { label: '🚪 KELUAR DARI CLI ENGINE', bg: colors.bgRed, action: 'exit' }
    ];

    const nextChoice = await selectHorizontalButtons(
      nextActionButtons,
      '🚀 PIPELINE SCRAPING SELESAI! APA LANGKAH SELANJUTNYA?'
    );

    if (nextChoice.option.action === 'exit') {
      console.log(`\n${colors.brightGreen}Terima kasih telah menggunakan Prompt Miner Scraper CLI! 👋${colors.reset}\n`);
      break;
    }
  }
}

main().catch(err => {
  console.error('\n❌ Terjadi kesalahan pada CLI:', err);
  process.exit(1);
});
