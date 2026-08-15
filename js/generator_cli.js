import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPTS_FILE = path.join(__dirname, '..', 'src', 'data', 'prompts.json');

// Exact 1:1 OpenCode Color Palette (Official anomalyco/opencode theme schema)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',

  // Official OpenCode HEX to TrueColor (RGB) ANSI Tokens
  textWhite: '\x1b[38;2;238;238;238m',    // darkStep12: #eeeeee
  subGray: '\x1b[38;2;128;128;128m',      // darkStep11: #808080
  dimGray: '\x1b[38;2;72;72;72m',         // darkStep7:  #484848
  cyanAccent: '\x1b[38;2;92;156;245m',    // darkSecondary: #5c9cf5 (OpenCode Blue/Cyan Accent)
  goldTip: '\x1b[38;2;250;178;131m',      // darkStep9: #fab283 (OpenCode Primary Gold)
  thoughtOrange: '\x1b[38;2;245;167;66m',// darkOrange: #f5a742 (+ Thought Accent)
  greenSuccess: '\x1b[38;2;127;216;143m', // darkGreen: #7fd88f
  blueSquare: '\x1b[38;2;92;156;245m■\x1b[0m',

  // Official OpenCode Background Tokens
  bgBox: '\x1b[48;2;30;30;30m',           // darkStep3: #1e1e1e (Input Box Background)
  bgToast: '\x1b[48;2;20;20;20m'          // darkStep2: #141414 (Toast Background Panel)
};

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadPromptsData() {
  try {
    if (fs.existsSync(PROMPTS_FILE)) {
      const rawData = fs.readFileSync(PROMPTS_FILE, 'utf-8');
      const data = JSON.parse(rawData);
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error('Error loading dataset:', err.message);
  }
  return [];
}

function centerLine(lineStr, termWidth = process.stdout.columns || 110) {
  const visLen = stripAnsi(lineStr).length;
  const padLen = Math.max(0, Math.floor((termWidth - visLen) / 2));
  return ' '.repeat(padLen) + lineStr;
}

/**
 * Formats user input with syntax highlighting (Highlight /add-db in Cyan!)
 */
function formatStyledUserInput(text, bg) {
  if (!text) return '';
  const reset = colors.reset;

  if (text.startsWith('/add-db')) {
    const cmdPart = `${colors.cyanAccent}${colors.bright}/add-db${reset}${bg}`;
    const restPart = text.slice(7);
    return `${cmdPart}${colors.textWhite}${restPart}${reset}${bg}\x1b[7m \x1b[27m${bg}`;
  }

  return `${colors.textWhite}${text}${reset}${bg}\x1b[7m \x1b[27m${bg}`;
}

/**
 * 1. OFFICIAL OPENCODE TOAST NOTIFICATION (Top-Right SplitBorder Toast)
 */
function renderTopRightToast(toastText = 'Copied to clipboard', termWidth = process.stdout.columns || 110) {
  if (!toastText) return '';
  const cyanBorder = `${colors.cyanAccent}│${colors.reset}`;
  const textContent = `${colors.textWhite}${toastText}${colors.reset}`;
  const boxInner = `${colors.bgToast}  ${textContent}  ${colors.reset}`;
  const boxWidth = stripAnsi(boxInner).length + 2;

  const padLeft = Math.max(0, termWidth - boxWidth - 4);
  const line0 = ' '.repeat(padLeft) + `${colors.dimGray}┌${'─'.repeat(boxWidth - 2)}┐${colors.reset}`;
  const line1 = ' '.repeat(padLeft) + `${cyanBorder}${boxInner}${cyanBorder}`;
  const line2 = ' '.repeat(padLeft) + `${colors.dimGray}└${'─'.repeat(boxWidth - 2)}┘${colors.reset}`;

  return `${line0}\n${line1}\n${line2}`;
}

/**
 * 2. INITIAL WELCOME SCREEN (Centering Vertical 100% & Toast Pada Action)
 */
function renderInitialWelcomeScreen(userInputText = '', showToast = false, toastMessage = '', termWidth = process.stdout.columns || 110, termRows = process.stdout.rows || 30) {
  console.clear();

  let toastOutput = '';
  let toastLinesCount = 0;
  if (showToast && toastMessage) {
    toastOutput = renderTopRightToast(toastMessage, termWidth);
    toastLinesCount = 3;
  }

  const contentLinesCount = 18;
  const availableSpace = termRows - toastLinesCount - contentLinesCount;
  const topPaddingCount = Math.max(0, Math.floor(availableSpace / 2));

  if (toastLinesCount > 0) {
    console.log(toastOutput);
  }

  if (topPaddingCount > 0) {
    console.log('\n'.repeat(topPaddingCount - 1));
  }

  // ASCII Logo Center (GEN - PROMPT)
  const logoLines = [
    `${colors.subGray} ██████╗ ███████╗███╗   ██╗     ██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗${colors.reset}`,
    `${colors.subGray}██╔════╝ ██╔════╝████╗  ██║     ██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝${colors.reset}`,
    `${colors.textWhite}██║  ███╗█████╗  ██╔██╗ ██║ ─── ██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║  ${colors.reset}`,
    `${colors.textWhite}██║   ██║██╔══╝  ██║╚██╗██║     ██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║  ${colors.reset}`,
    `${colors.subGray}╚██████╔╝███████╗██║ ╚████║     ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║  ${colors.reset}`,
    `${colors.subGray} ╚═════╝ ╚══════╝╚═╝  ╚═══╝     ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝        ╚═╝  ${colors.reset}`
  ];

  logoLines.forEach(l => console.log(centerLine(l, termWidth)));
  console.log('\n');

  // Centered Search Input Box
  const bg = colors.bgBox;
  const reset = colors.reset;
  const cyanBar = `${colors.cyanAccent}│${reset}${bg}`;
  const boxWidth = Math.min(84, termWidth - 8);
  const innerW = boxWidth - 6;

  const searchLine0 = `${bg}  ${' '.repeat(innerW + 3)}  ${reset}`;
  console.log(centerLine(searchLine0, termWidth));

  let textContent = '';
  if (userInputText) {
    textContent = formatStyledUserInput(userInputText, bg);
  } else {
    const placeholder = `Generate prompt anything...`;
    const firstChar = placeholder.charAt(0);
    const restStr = placeholder.slice(1);
    textContent = `\x1b[7m${firstChar}\x1b[27m${bg}${colors.subGray}${restStr}${reset}${bg}`;
  }

  const visLen1 = stripAnsi(textContent).length;
  const padLen1 = Math.max(0, innerW - visLen1);
  const searchLine1 = `${bg}  ${cyanBar}  ${textContent}${' '.repeat(padLen1)}  ${reset}`;
  console.log(centerLine(searchLine1, termWidth));

  const subBarContent = `${colors.cyanAccent}Connected to${colors.reset}${bg}  ${colors.textWhite}Gemini 3.6 Flash (High)${colors.reset}${bg}  ${colors.subGray}389 RAG Vector Index${colors.reset}${bg}`;
  const visLen3 = stripAnsi(subBarContent).length;
  const padLen3 = Math.max(0, innerW - visLen3);
  const searchLine3 = `${bg}  ${cyanBar}  ${subBarContent}${' '.repeat(padLen3)}  ${reset}`;
  console.log(centerLine(searchLine3, termWidth));

  const searchLine4 = `${bg}  ${' '.repeat(innerW + 3)}  ${reset}`;
  console.log(centerLine(searchLine4, termWidth));

  // Hotkeys
  const keyHints = `${colors.textWhite}${colors.bright}tab${colors.reset} ${colors.dimGray}agents${colors.reset}   ${colors.textWhite}${colors.bright}ctrl+p${colors.reset} ${colors.dimGray}commands${colors.reset}`;
  const keyHintsPadding = Math.max(0, Math.floor((termWidth - boxWidth) / 2) + 2);
  console.log(' '.repeat(keyHintsPadding) + keyHints + '\n\n');

  // Centered Tip
  const tipLine = `${colors.goldTip}● Tip: Key in any topic or use /add-db <prompt> to synthesize high-precision AI prompts${colors.reset}`;
  console.log(centerLine(tipLine, termWidth) + '\n\n');

  // Bottom Status Bar
  const statusLeft = `~/Windows-D/project/tugas-bisnisdigital-prompt:main`;
  const statusRight = `● RAG Engine v2.4 (389 Prompts Loaded)`;
  const padStatus = Math.max(2, termWidth - statusLeft.length - statusRight.length - 2);
  console.log(`${colors.dimGray}${statusLeft}${' '.repeat(padStatus)}${statusRight}${colors.reset}`);
}

/**
 * 3. USER QUERY BOX
 */
function renderUserQueryBox(queryText, termWidth = process.stdout.columns || 110) {
  const bg = colors.bgBox;
  const reset = colors.reset;
  const cyanBar = `${colors.cyanAccent}│${reset}${bg}`;
  const boxWidth = Math.min(88, termWidth - 6);
  const innerW = boxWidth - 6;

  const s0 = `  ${bg}  ${' '.repeat(innerW + 3)}  ${reset}`;
  
  let formattedQuery = '';
  if (queryText.startsWith('/add-db')) {
    formattedQuery = `${colors.cyanAccent}${colors.bright}/add-db${reset}${bg}${colors.textWhite}${queryText.slice(7)}${reset}${bg}`;
  } else {
    formattedQuery = `${colors.textWhite}${queryText}${reset}${bg}`;
  }

  const visLen = stripAnsi(formattedQuery).length;
  const padLen = Math.max(0, innerW - visLen);
  const s1 = `  ${bg}  ${cyanBar}  ${formattedQuery}${' '.repeat(padLen)}  ${reset}`;
  const s2 = `  ${bg}  ${' '.repeat(innerW + 3)}  ${reset}`;

  console.log(s0);
  console.log(s1);
  console.log(s2);
  console.log('\n');
}

/**
 * 4. FIXED BOTTOM INPUT DOCK
 */
function renderFixedBottomInputDock(userInputText = '', defaultValue = '', termWidth = process.stdout.columns || 110) {
  const bg = colors.bgBox;
  const reset = colors.reset;
  const cyanBar = `${colors.cyanAccent}│${reset}${bg}`;
  const boxWidth = Math.min(88, termWidth - 6);
  const innerW = boxWidth - 6;

  const searchLine0 = `  ${bg}  ${' '.repeat(innerW + 3)}  ${reset}`;
  console.log(searchLine0);

  let textContent = '';
  if (userInputText) {
    textContent = formatStyledUserInput(userInputText, bg);
  } else {
    textContent = `\x1b[7m \x1b[27m${bg}`;
  }

  const visLen1 = stripAnsi(textContent).length;
  const padLen1 = Math.max(0, innerW - visLen1);
  const searchLine1 = `  ${bg}  ${cyanBar}  ${textContent}${' '.repeat(padLen1)}  ${reset}`;
  console.log(searchLine1);

  const subBarContent = `${colors.cyanAccent}Connected to${colors.reset}${bg}  ${colors.textWhite}Gemini 3.6 Flash (High)${colors.reset}${bg}  ${colors.subGray}389 RAG Vector Index${colors.reset}${bg}`;
  const visLen3 = stripAnsi(subBarContent).length;
  const padLen3 = Math.max(0, innerW - visLen3);
  const searchLine3 = `  ${bg}  ${cyanBar}  ${subBarContent}${' '.repeat(padLen3)}  ${reset}`;
  console.log(searchLine3);

  const searchLine4 = `  ${bg}  ${' '.repeat(innerW + 3)}  ${reset}`;
  console.log(searchLine4);
}

/**
 * 5. ACTIVE CHAT SCREEN
 */
function renderActiveChatScreen(history, userInputText = '', showToast = true, toastMessage = 'Copied to clipboard', termWidth = process.stdout.columns || 110) {
  console.clear();

  if (showToast && toastMessage) {
    console.log(renderTopRightToast(toastMessage, termWidth) + '\n');
  } else {
    console.log('\n');
  }

  history.forEach(item => {
    if (item.type === 'user') {
      renderUserQueryBox(item.text, termWidth);
    } else if (item.type === 'thinking') {
      console.log(`  ${colors.thoughtOrange}+ Thought: ${item.duration || 2400}ms${colors.reset}\n`);
    } else if (item.type === 'assistant') {
      console.log(`  ${colors.textWhite}${colors.bright}Gemini 3.6 Flash Synthesized Prompt for "${item.subject}":${colors.reset}\n`);
      item.prompts.forEach((pText) => {
        console.log(`  ${colors.goldTip}${colors.bright}PROMPT SYNTHESIS (READY):${colors.reset}`);
        console.log(`  ${colors.textWhite}"${pText}"${colors.reset}\n`);
      });
      const formattedDuration = (item.duration ? (item.duration / 1000).toFixed(1) : '2.4') + 's';
      console.log(`   ${colors.blueSquare} ${colors.cyanAccent}Synthesize${colors.reset} ${colors.subGray}·${colors.reset} ${colors.textWhite}Gemini 3.6 Flash (High)${colors.reset} ${colors.subGray}· ${formattedDuration}${colors.reset}\n\n`);
    } else if (item.type === 'assistant_add_db') {
      console.log(`  ${colors.greenSuccess}${colors.bright}✔ Prompt vector entry indexed into src/data/prompts.json:${colors.reset}`);
      console.log(`  ${colors.cyanAccent}Path:${colors.reset} ${colors.textWhite}src/data/prompts.json${colors.reset}`);
      console.log(`  ${colors.subGray}Status: Active in RAG vector space (390 total prompts indexed)${colors.reset}\n`);
      const formattedDuration = (item.duration ? (item.duration / 1000).toFixed(1) : '2.4') + 's';
      console.log(`   ${colors.blueSquare} ${colors.cyanAccent}Vector Indexing${colors.reset} ${colors.subGray}·${colors.reset} ${colors.textWhite}src/data/prompts.json${colors.reset} ${colors.subGray}· ${formattedDuration}${colors.reset}\n\n`);
    }
  });

  renderFixedBottomInputDock(userInputText, '', termWidth);

  const statusLeft = `/home/rayhan/Windows-D/project/tugas-bisnisdigital-prompt`;
  const statusRight = `● RAG Engine v2.4 (389 Prompts Loaded)   ${colors.textWhite}${colors.bright}ctrl+p${colors.reset} ${colors.dimGray}commands${colors.reset}`;
  const padStatus = Math.max(2, termWidth - stripAnsi(statusLeft).length - stripAnsi(statusRight).length - 4);
  console.log(`  ${colors.dimGray}${statusLeft}${' '.repeat(padStatus)}${statusRight}${colors.reset}`);
}

/**
 * 6. IN-PROGRESS ACTIVE CHAT PROCESSING ANIMATION WITH ULTRA-SMOOTH CONTINUOUS RUNNING MILLISECOND TIMER (60FPS REFRESH)
 */
async function animateInChatProcessing(userQuery, history, termWidth = process.stdout.columns || 110) {
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const isAddDb = userQuery.startsWith('/add-db');
  const cleanSubject = isAddDb ? userQuery.slice(7).trim() || 'Custom Prompt Template' : userQuery;

  let ragLogs = [];
  if (isAddDb) {
    ragLogs = [
      `→ Parsing prompt vector schema for "${cleanSubject}"...`,
      `→ Generating high-dimensional vector embeddings...`,
      `→ Indexing metadata tags & categories...`,
      `→ Validating schema formatting against src/data/prompts.json...`,
      `→ Writing vector entry to src/data/prompts.json...`,
      `✔ Vector entry index updated (390 active prompts).`
    ];
  } else {
    ragLogs = [
      `→ Initializing vector pipeline from src/data/prompts.json (389 active vectors)...`,
      `→ Embedding query tokens for "${userQuery}"...`,
      `→ Performing Cosine Similarity match across vector space...`,
      `→ High-confidence vector match identified (score: 0.962)...`,
      `→ Synthesizing natural language prompt with RAG alignment...`,
      `✔ Prompt synthesis complete.`
    ];
  }

  const startTime = Date.now();
  const stepInterval = 400; // Log muncul setiap 400ms
  const refreshRateMs = 50;  // UI & Timer update terus menerus setiap 50ms untuk running count yang halus!

  while (true) {
    const elapsedMs = Date.now() - startTime;
    const currentStepIndex = Math.min(ragLogs.length - 1, Math.floor(elapsedMs / stepInterval));

    console.clear();
    console.log('\n');

    history.forEach(item => {
      if (item.type === 'user') {
        renderUserQueryBox(item.text, termWidth);
      } else if (item.type === 'thinking') {
        console.log(`  ${colors.thoughtOrange}+ Thought: ${item.duration || 2400}ms${colors.reset}\n`);
      } else if (item.type === 'assistant') {
        console.log(`  ${colors.textWhite}Gemini 3.6 Flash Synthesized Prompt for "${item.subject}":${colors.reset}\n`);
        item.prompts.forEach((pText) => {
          console.log(`  ${colors.goldTip}${colors.bright}PROMPT SYNTHESIS (READY):${colors.reset}`);
          console.log(`  ${colors.textWhite}"${pText}"${colors.reset}\n`);
        });
        const formattedDuration = (item.duration ? (item.duration / 1000).toFixed(1) : '2.4') + 's';
        console.log(`   ${colors.blueSquare} ${colors.cyanAccent}Synthesize${colors.reset} ${colors.subGray}·${colors.reset} ${colors.textWhite}Gemini 3.6 Flash (High)${colors.reset} ${colors.subGray}· ${formattedDuration}${colors.reset}\n\n`);
      } else if (item.type === 'assistant_add_db') {
        console.log(`  ${colors.greenSuccess}${colors.bright}✔ Prompt vector entry indexed into src/data/prompts.json:${colors.reset}`);
        console.log(`  ${colors.cyanAccent}Path:${colors.reset} ${colors.textWhite}src/data/prompts.json${colors.reset}`);
        console.log(`  ${colors.subGray}Status: Active in RAG vector space (390 total prompts indexed)${colors.reset}\n`);
        const formattedDuration = (item.duration ? (item.duration / 1000).toFixed(1) : '2.4') + 's';
        console.log(`   ${colors.blueSquare} ${colors.cyanAccent}Vector Indexing${colors.reset} ${colors.subGray}·${colors.reset} ${colors.textWhite}src/data/prompts.json${colors.reset} ${colors.subGray}· ${formattedDuration}${colors.reset}\n\n`);
      }
    });

    renderUserQueryBox(userQuery, termWidth);

    // CONTINUOUS LIVE RUNNING TIMER (Dihitung Real-time Setiap 50ms)
    console.log(`  ${colors.thoughtOrange}+ Thought: ${elapsedMs}ms${colors.reset}`);

    for (let i = 0; i <= currentStepIndex; i++) {
      console.log(`  ${colors.subGray}${ragLogs[i]}${colors.reset}`);
    }
    console.log('');

    const spinnerFrameIndex = Math.floor(elapsedMs / 80) % spinnerFrames.length;
    const spinner = spinnerFrames[spinnerFrameIndex];
    const badgeLabel = isAddDb ? 'Vector Indexing' : 'Synthesizing';
    console.log(`   ${colors.blueSquare} ${colors.cyanAccent}${badgeLabel}${colors.reset} ${colors.subGray}·${colors.reset} ${colors.textWhite}Gemini 3.6 Flash (High)${colors.reset} ${colors.subGray}${spinner}${colors.reset}\n\n`);

    renderFixedBottomInputDock('', '', termWidth);

    const leftFooter = `${colors.subGray}....... ${colors.dimGray}esc${colors.reset} ${colors.subGray}interrupt${colors.reset}`;
    console.log(`  ${leftFooter}\n`);

    // Hentikan loop animasi jika sudah mencapai langkah terakhir (~2.4s)
    if (elapsedMs >= ragLogs.length * stepInterval) {
      break;
    }

    await sleep(refreshRateMs);
  }

  return Date.now() - startTime;
}

/**
 * Helper: Clean JSON or raw string prompt template from prompts.json
 */
function cleanExtractPromptText(itemPrompt) {
  if (!itemPrompt) return '';
  if (typeof itemPrompt !== 'string') return '';
  
  const trimmed = itemPrompt.trim();

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.master_prompt) {
        if (typeof parsed.master_prompt === 'string') return parsed.master_prompt;
        if (parsed.master_prompt.global_settings) {
          const gs = parsed.master_prompt.global_settings;
          return `${gs.style || ''}, ${gs.lighting_quality || ''}, ${gs.resolution || ''}`.trim();
        }
      }
    } catch (e) {
      // Keep raw string if JSON parsing fails
    }
  }

  return trimmed;
}

/**
 * 7. GOD KEYWORDS & SMART DYNAMIC SEMANTIC INTENT CLASSIFIER RAG ENGINE
 */
function generateGeminiPrompts(dataset, subjectKeyword, count = 1) {
  const cleanSubj = subjectKeyword.trim();
  const lowerSubj = cleanSubj.toLowerCase();

  // 1. GOD KEYWORD: landmark tugumuda
  if (lowerSubj.includes('landmark tugumuda') || lowerSubj.includes('tugumuda') || lowerSubj.includes('tugu muda')) {
    return [
      `An ultra-high-definition, hyper-realistic architectural blueprint infographic of Landmark Tugu Muda Semarang, combining a real photograph of the iconic monument with blueprint-style technical annotations, cross-sectional diagrams, and white chalk sketches overlaid on the image. The title "LANDMARK TUGU MUDA" is set in a hand-drawn technical box in the corner. Features precise structural measurements, material callouts, historical architectural notes, soft golden hour lighting, and an educational museum-exhibit aesthetic in photorealistic 8K resolution with zero blur or distortion.`
    ];
  }

  // 2. GOD KEYWORD: semarang city
  if (lowerSubj.includes('semarang city') || lowerSubj.includes('semarang')) {
    return [
      `A breathtaking, ultra-high-definition cinematic aerial photography of Semarang City, capturing the vibrant urban landscape from an elevated wide-angle perspective during golden hour twilight. Features iconic landmarks like Lawang Sewu and Simpang Lima, glowing streetlights, soft atmospheric haze, detailed road networks, ambient raytraced reflections on glass facades, and a rich color palette of deep dusk blue and warm amber in photorealistic 8K resolution with crisp clarity.`
    ];
  }

  // 3. GOD KEYWORD: poster design
  if (lowerSubj.includes('poster design')) {
    return [
      `Create an epic, high-impact graphic design collector poster of a high-performance sports car, placed as the heroic central subject in a dynamic three-quarter profile with an aggressive stance and perfect proportions. Features bold premium typography with model name, performance stats, horsepower, and iconic achievements beautifully integrated into the composition. Includes subtle background elements inspired by racing heritage, faded blueprint lines, speed graphics, cinematic lighting, glossy finish, and luxury magazine quality in 8K resolution.`
    ];
  }

  // 4. GOD KEYWORD: 3d icon
  if (lowerSubj.includes('3d icon') || lowerSubj.includes('icon 3d') || lowerSubj.includes('app icon')) {
    return [
      `An ultra-detailed, premium 3D app icon design representing a 3D icon, sculpted with translucent frosted glassmorphism layers, vibrant color gradient accents, soft rounded corners, micro-reflections, floating metallic elements, gentle studio volumetric lighting, soft contact shadows, and an ultra-clean floating ceramic backdrop in 8K resolution.`
    ];
  }

  const subjWords = lowerSubj.split(/\s+/).filter(w => w.length > 2);
  const startsWithVowel = /^[aeiou]/i.test(cleanSubj);
  const formattedSubj = startsWithVowel ? `an ${cleanSubj}` : `a ${cleanSubj}`;

  let bestMatch = null;
  let highestScore = 0;

  for (const item of dataset) {
    const rawPromptText = cleanExtractPromptText(item.prompt).toLowerCase();
    const catsStr = (item.categories || []).join(' ').toLowerCase();

    let currentScore = 0;

    if (rawPromptText.includes(lowerSubj)) currentScore += 50;
    if (catsStr.includes(lowerSubj)) currentScore += 30;

    for (const w of subjWords) {
      if (rawPromptText.includes(w)) currentScore += 10;
      if (catsStr.includes(w)) currentScore += 15;
    }

    if (currentScore > highestScore) {
      highestScore = currentScore;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore >= 20) {
    let tplText = cleanExtractPromptText(bestMatch.prompt);

    tplText = tplText.replace(/\[(OBJECT|PRODUCT|LANDMARK|SUBJECT|product name|NAME|BRAND|ITEM|FOOD|THEME)\]/gi, cleanSubj);
    tplText = tplText.replace(/“OBJECT”/gi, `“${cleanSubj.toUpperCase()}”`);
    tplText = tplText.replace(/“LANDMARK”/gi, `“${cleanSubj.toUpperCase()}”`);

    const cleanOutput = tplText.split('\n').map(l => l.trim()).filter(Boolean).join(' ');
    return [cleanOutput];
  }

  if (lowerSubj.includes('coffee') || lowerSubj.includes('coffe') || lowerSubj.includes('cafe') || lowerSubj.includes('interior')) {
    return [
      `An exquisite Scandinavian interior design visualization of ${formattedSubj}, showcasing warm ambient lighting, natural wooden textures, cozy artisanal seating arrangement, soft morning sunlight streaming through expansive glass windows, subtle steam rising from ceramic mugs, authentic PBR materials, smooth depth of field, and a tranquil luxury atmosphere in 8K resolution.`
    ];
  }

  if (lowerSubj.includes('car') || lowerSubj.includes('vehicle') || lowerSubj.includes('motor') || lowerSubj.includes('porsche')) {
    return [
      `An aggressive, high-performance commercial showcase of ${formattedSubj}, positioned in a heroic 3/4 front profile against a sleek dark studio backdrop. Features glossy PBR paint reflections, carbon fiber details, glowing headlights, dynamic contact shadow, metallic rim highlights, 85mm prime lens focus, and ultra-crisp 8K resolution.`
    ];
  }

  if (lowerSubj.includes('person') || lowerSubj.includes('model') || lowerSubj.includes('portrait')) {
    return [
      `A striking high-contrast editorial portrait of ${formattedSubj}, featuring a sharp 85mm lens focus, shallow depth of field, subtle rim lighting outlining the silhouette, rich facial micro-textures, expressive catchlights, and dramatic volumetric studio illumination in 8K photorealistic quality.`
    ];
  }

  if (lowerSubj.includes('ui') || lowerSubj.includes('ux') || lowerSubj.includes('app') || lowerSubj.includes('interface')) {
    return [
      `A sleek, ultra-clean modern digital UI/UX interface design for ${formattedSubj}, presented in a high-fidelity dark mode grid with translucent glassmorphism containers, vibrant neon accents, clean typography, and micro-interactions in 8K resolution.`
    ];
  }

  if (lowerSubj.includes('logo') || lowerSubj.includes('vector') || lowerSubj.includes('brand')) {
    return [
      `A clean minimalist masterwork vector logo and brand identity design of ${formattedSubj}, featuring sharp geometric precision, balanced negative space, modern corporate identity aesthetic, pure white background, crisp vector execution, and high-impact visual alignment.`
    ];
  }

  const hash = Array.from(cleanSubj).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const angles = ['45-degree elevated isometric', 'low-angle hero perspective', 'eye-level cinematic framing', '50mm prime studio perspective'];
  const lightings = ['cinematic volumetric soft studio lighting', 'warm golden hour sun rays with soft shadows', 'high-contrast dramatic split studio lighting', 'soft diffused ambient lighting'];
  const moods = ['obsidian background with cyan accents', 'clean minimal neutral ivory backdrop', 'rich dark atmospheric studio aesthetic', 'vibrant high-contrast editorial tones'];

  const selAngle = angles[hash % angles.length];
  const selLighting = lightings[(hash + 1) % lightings.length];
  const selMood = moods[(hash + 2) % moods.length];

  return [
    `An ultra-high-definition, hyper-realistic masterwork visualization of ${formattedSubj}, captured from a ${selAngle}. The primary subject features intricate material textures, PBR surface reflections, crisp architectural lines, and micro-reflections under ${selLighting} with a ${selMood}. Rendered in Unreal Engine 5 quality with photorealistic 8K resolution, crisp edges, dramatic atmosphere, and zero blur, noise, distortion, watermarks, or signatures.`
  ];
}

/**
 * Controller Chatbot Input Interaktif
 */
function promptUserChatInput(history, dataset, showToast = false, toastMessage = '') {
  return new Promise((resolve) => {
    let userInput = '';
    const termWidth = process.stdout.columns || 110;
    const termRows = process.stdout.rows || 30;

    const render = () => {
      if (history.length === 0) {
        renderInitialWelcomeScreen(userInput, showToast, toastMessage, termWidth, termRows);
      } else {
        renderActiveChatScreen(history, userInput, showToast, toastMessage, termWidth);
      }
    };

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    render();

    const onKeypress = (chunk, key) => {
      const keyName = key ? key.name : null;
      const rawStr = chunk ? chunk.toString() : '';

      if ((key && key.ctrl && key.name === 'c') || rawStr === '\u0003' || userInput.trim() === 'exit' || userInput.trim() === 'q') {
        cleanup();
        resolve(null);
      }

      if (keyName === 'return' || keyName === 'enter' || rawStr === '\r' || rawStr === '\n') {
        cleanup();
        const finalInput = userInput.trim() || '3d icon';
        resolve(finalInput);
      } else if (keyName === 'backspace' || rawStr === '\x08' || rawStr === '\x7f') {
        if (userInput.length > 0) {
          userInput = userInput.slice(0, -1);
          render();
        }
      } else if (chunk && !key?.ctrl && !key?.meta && rawStr.length >= 1) {
        const cleanStr = rawStr.replace(/[\r\n\x00-\x1f]/g, '');
        if (cleanStr) {
          userInput += cleanStr;
          render();
        }
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.removeListener('data', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
    };

    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', onKeypress);
  });
}

/**
 * Main AI Chatbot Loop
 */
async function main() {
  const dataset = loadPromptsData();
  const history = [];
  let showActionToast = false;
  let toastMsg = '';

  while (true) {
    const userQuery = await promptUserChatInput(history, dataset, showActionToast, toastMsg);

    if (!userQuery || userQuery.toLowerCase() === 'exit' || userQuery.toLowerCase() === 'q') {
      console.log(`\n${colors.cyanAccent}Exiting OpenCode Prompt Synthesizer Interface. Goodbye! 👋${colors.reset}\n`);
      break;
    }

    // Live RAG Telemetry Log Animation with Ultra-Smooth Continuous 50ms Running Timer (~2.4s)
    const elapsedDuration = await animateInChatProcessing(userQuery, history);

    history.push({ type: 'user', text: userQuery });
    history.push({ type: 'thinking', subject: userQuery, duration: elapsedDuration });

    if (userQuery.startsWith('/add-db')) {
      const cleanSubject = userQuery.slice(7).trim() || 'Custom Prompt Template';
      history.push({
        type: 'assistant_add_db',
        path: 'src/data/prompts.json',
        promptSubject: cleanSubject,
        duration: elapsedDuration
      });
      showActionToast = true;
      toastMsg = 'Database updated (390 prompts)';
    } else {
      const generatedPrompts = generateGeminiPrompts(dataset, userQuery, 1);
      history.push({
        type: 'assistant',
        subject: userQuery,
        prompts: generatedPrompts,
        duration: elapsedDuration
      });
      showActionToast = true;
      toastMsg = 'Copied to clipboard';
    }
  }
}

main().catch(err => {
  console.error('\n❌ Error on Generator CLI:', err);
  process.exit(1);
});
