// Formatting & Styling utilities for CLI Scraping Engine using native ANSI escape codes
import readline from 'node:readline';

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Bright colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background colors
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgDark: '\x1b[40m'
};

export function printBanner() {
  console.clear();
  const asciiTitle = `
${colors.brightCyan} ╔══════════════════════════════════════════════════════════════════╗${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗         ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝         ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║            ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║            ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║            ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset}                                                                ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}███████╗███████╗██████╗  █████╗ ██████╗ ███████╗██╗██████╗    ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}██╔════╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██║██╔══██╗   ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}███████╗██║     ██████╔╝███████║██████╔╝█████╗  ██║██████╔╝   ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}╚════██║██║     ██╔══██╗██╔══██║██╔═══╝ ██╔══╝  ██║██╔══██╗   ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset} ${colors.brightYellow}███████║╚██████╗██║  ██║██║  ██║██║     ███████╗██║██║  ██║   ${colors.reset} ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset}                                                                ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ║${colors.reset}  ${colors.brightGreen}⚡ SOCIAL MEDIA PROMPT SCRAPER CLI v2.4.0 ⚡${colors.reset}                  ${colors.brightCyan}║${colors.reset}
${colors.brightCyan} ╚══════════════════════════════════════════════════════════════════╝${colors.reset}
`;
  console.log(asciiTitle);
}

/**
 * Word Wrap Helper untuk memutus baris panjang agar selalu pas di dalam border CLI
 */
export function wordWrapText(text, maxLen = 76) {
  const lines = text.split('\n');
  const wrappedLines = [];

  lines.forEach(rawLine => {
    const visibleLen = stripAnsi(rawLine).length;
    if (visibleLen <= maxLen) {
      wrappedLines.push(rawLine);
    } else {
      const words = rawLine.split(' ');
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (stripAnsi(testLine).length <= maxLen) {
          currentLine = testLine;
        } else {
          if (currentLine) wrappedLines.push(currentLine);
          
          if (stripAnsi(word).length > maxLen) {
            let chunked = word;
            while (stripAnsi(chunked).length > maxLen) {
              wrappedLines.push(chunked.substring(0, maxLen));
              chunked = chunked.substring(maxLen);
            }
            currentLine = chunked;
          } else {
            currentLine = word;
          }
        }
      });

      if (currentLine) wrappedLines.push(currentLine);
    }
  });

  return wrappedLines.join('\n');
}

/**
 * Menggambar Kotak CLI dengan Word Wrap Otomatis & Border Presisi
 */
export function drawBox(title, content, color = colors.brightCyan, width = 84) {
  const innerWidth = width - 4;
  const horizontal = '═'.repeat(width - 2);
  
  const wrappedContent = wordWrapText(content, innerWidth);
  const lines = wrappedContent.split('\n');

  let result = `\n${color}╔═ ${colors.brightWhite}${title} ${color}${'═'.repeat(Math.max(0, width - title.length - 5))}╗${colors.reset}\n`;
  
  lines.forEach(line => {
    const visibleLength = stripAnsi(line).length;
    const paddingLength = Math.max(0, innerWidth - visibleLength);
    result += `${color}║${colors.reset} ${line}${' '.repeat(paddingLength)} ${color}║${colors.reset}\n`;
  });
  
  result += `${color}╚${horizontal}╝${colors.reset}\n`;
  return result;
}

export function drawProgressBar(current, total, barLength = 28) {
  const percent = Math.min(100, Math.round((current / total) * 100));
  const filledLength = Math.round((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  return `${colors.brightCyan}[${bar}]${colors.reset} ${colors.brightYellow}${percent}%${colors.reset} (${current}/${total})`;
}

/**
 * Progress bar incremental (0% -> 100%) dengan status teks dinamis
 */
export function drawDetailedProgressBar(percent, barLength = 28, statusText = '') {
  const p = Math.min(100, Math.max(0, Math.round(percent)));
  const filledLength = Math.round((barLength * p) / 100);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  const color = p >= 100 ? colors.brightGreen : (p >= 50 ? colors.brightCyan : colors.brightYellow);
  const statusStr = statusText ? ` ${colors.dim}${statusText}${colors.reset}` : '';
  return `${color}[${bar}]${colors.reset} ${colors.brightWhite}${p.toString().padStart(3, ' ')}%${colors.reset}${statusStr}`;
}

function stripAnsi(string) {
  return string.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Menu Interaktif dengan Indikator Color Dot (● / ○) & Navigasi Panah Estetik
 */
export function selectMenuWithArrows(options, title = 'Gunakan panah Atas/Bawah untuk memilih:') {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    const totalLines = options.length + 1;

    process.stdout.write('\x1b[?25l');

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    const render = (isFirst = false) => {
      if (!isFirst) {
        readline.moveCursor(process.stdout, 0, -totalLines);
      }

      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${colors.brightYellow}${title}${colors.reset} ${colors.dim}(Gunakan Panah ^ / v & Enter)${colors.reset}\n`);

      options.forEach((opt, idx) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        if (idx === selectedIndex) {
          process.stdout.write(`  ${colors.brightCyan}❯${colors.reset} ${colors.brightGreen}●${colors.reset} ${colors.brightGreen}${colors.brightWhite}${opt}${colors.reset}\n`);
        } else {
          process.stdout.write(`    ${colors.dim}○ ${opt}${colors.reset}\n`);
        }
      });
    };

    render(true);

    const onKeypress = (chunk, key) => {
      const keyName = key ? key.name : null;
      const rawStr = chunk ? chunk.toString() : '';

      if ((key && key.ctrl && key.name === 'c') || rawStr === '\u0003') {
        cleanup();
        process.exit(0);
      }

      if (keyName === 'up' || keyName === 'k' || rawStr === '\u001b[A') {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
      } else if (keyName === 'down' || keyName === 'j' || rawStr === '\u001b[B') {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
      } else if (keyName === 'return' || keyName === 'enter' || rawStr === '\r' || rawStr === '\n') {
        cleanup();
        console.log(`  ${colors.brightGreen}✔ Terpilih:${colors.reset} ${colors.brightCyan}● ${colors.brightWhite}${options[selectedIndex]}${colors.reset}\n`);
        resolve({ index: selectedIndex, value: options[selectedIndex] });
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.removeListener('data', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdout.write('\x1b[?25h');
    };

    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', onKeypress);
  });
}

/**
 * Text Input Interaktif Cyberpunk Thin-Line Dock (Option 3 Design)
 */
export function inputBoxedTextPrompt(titleText, defaultValue = '', width = 72) {
  return new Promise((resolve) => {
    let userInput = '';
    let isFirstRender = true;

    console.log(`\n${colors.brightYellow}${titleText}${colors.reset}`);
    if (defaultValue) {
      console.log(`  ${colors.dim}(Default: "${defaultValue}" — Tekan Enter jika ingin default)${colors.reset}`);
    }

    const innerWidth = width - 4;
    process.stdout.write('\x1b[?25l');

    const render = () => {
      if (!isFirstRender) {
        readline.moveCursor(process.stdout, 0, -3);
      }
      isFirstRender = false;

      // Baris 1: Cyberpunk Top Dock
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${colors.brightCyan}┌─── INPUT SEARCH ${'─'.repeat(Math.max(0, width - 20))}┐${colors.reset}\n`);

      // Baris 2: Input Field dengan Kursor '█'
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      const textToShow = userInput || (defaultValue ? `e.g. ${defaultValue}` : '');
      const visibleInputLen = stripAnsi(textToShow).length;
      const paddingLen = Math.max(0, innerWidth - visibleInputLen - 4);

      if (userInput) {
        process.stdout.write(`${colors.brightCyan}│${colors.reset} ${colors.brightGreen}❯${colors.reset} ${colors.brightWhite}${userInput}${colors.reset}${colors.brightGreen}█${colors.reset}${' '.repeat(paddingLen)} ${colors.brightCyan}│${colors.reset}\n`);
      } else {
        process.stdout.write(`${colors.brightCyan}│${colors.reset} ${colors.brightGreen}❯${colors.reset} ${colors.brightGreen}█${colors.reset} ${colors.dim}e.g. ${defaultValue}${colors.reset}${' '.repeat(paddingLen)} ${colors.brightCyan}│${colors.reset}\n`);
      }

      // Baris 3: Cyberpunk Bottom Dock
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${colors.brightCyan}└─── Search Term ${'─'.repeat(Math.max(0, width - 19))}┘${colors.reset}\n`);
    };

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    render();

    const onKeypress = (chunk, key) => {
      const keyName = key ? key.name : null;
      const rawStr = chunk ? chunk.toString() : '';

      if ((key && key.ctrl && key.name === 'c') || rawStr === '\u0003') {
        cleanup();
        process.exit(0);
      }

      if (keyName === 'return' || keyName === 'enter' || rawStr === '\r' || rawStr === '\n') {
        cleanup();
        const finalResult = userInput.trim() || defaultValue;
        console.log(`  ${colors.brightGreen}✔ Parameter Settled:${colors.reset} ${colors.brightYellow}"${finalResult}"${colors.reset}\n`);
        resolve(finalResult);
      } else if (keyName === 'backspace' || rawStr === '\x08' || rawStr === '\x7f') {
        if (userInput.length > 0) {
          userInput = userInput.slice(0, -1);
          render();
        }
      } else if (chunk && !key?.ctrl && !key?.meta && rawStr.length === 1 && rawStr >= ' ') {
        userInput += rawStr;
        render();
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.removeListener('data', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdout.write('\x1b[?25h');
    };

    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', onKeypress);
  });
}

/**
 * Interactive Cyberpunk Capacity Dial (Option 3 Design)
 */
export function selectNumberStepper(titleText, initialValue = 3, min = 1, max = 10) {
  return new Promise((resolve) => {
    let currentValue = Math.max(min, Math.min(max, initialValue));
    let isFirstRender = true;

    console.log(`\n${colors.brightYellow}${titleText}${colors.reset}`);
    console.log(`  ${colors.dim}(Gunakan Panah ◄ Kiri / ► Kanan & Enter untuk konfirmasi)${colors.reset}\n`);

    process.stdout.write('\x1b[?25l');

    const render = () => {
      if (!isFirstRender) {
        readline.moveCursor(process.stdout, 0, -1);
      }
      isFirstRender = false;

      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      const leftBtn = currentValue > min ? `${colors.brightGreen}◄${colors.reset}` : `${colors.dim}◄${colors.reset}`;
      const rightBtn = currentValue < max ? `${colors.brightGreen}►${colors.reset}` : `${colors.dim}►${colors.reset}`;
      
      const filledBlocks = '█ '.repeat(currentValue).trim();
      const emptyBlocks = '░ '.repeat(max - currentValue).trim();
      const dialDisplay = `${colors.brightGreen}${filledBlocks}${colors.reset} ${colors.dim}${emptyBlocks}${colors.reset}`;

      const tag = `${colors.brightCyan}❮❮ CAPACITY DIAL ❯❯${colors.reset}`;
      const countStr = `${colors.brightYellow}( ${colors.brightWhite}${currentValue}${colors.brightYellow} / ${max} Items )${colors.reset}`;

      process.stdout.write(`  ${tag}  ${leftBtn} [ ${dialDisplay} ] ${rightBtn}  ${countStr}\n`);
    };

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    render();

    const onKeypress = (chunk, key) => {
      const keyName = key ? key.name : null;
      const rawStr = chunk ? chunk.toString() : '';

      if ((key && key.ctrl && key.name === 'c') || rawStr === '\u0003') {
        cleanup();
        process.exit(0);
      }

      if (keyName === 'left' || keyName === 'down' || rawStr === '\u001b[D' || rawStr === '\u001b[B') {
        if (currentValue > min) {
          currentValue--;
          render();
        }
      } else if (keyName === 'right' || keyName === 'up' || rawStr === '\u001b[C' || rawStr === '\u001b[A') {
        if (currentValue < max) {
          currentValue++;
          render();
        }
      } else if (keyName === 'return' || keyName === 'enter' || rawStr === '\r' || rawStr === '\n') {
        cleanup();
        console.log(`  ${colors.brightGreen}✔ Limit Settled:${colors.reset} ${colors.brightYellow}${currentValue} Items${colors.reset}\n`);
        resolve(currentValue);
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.removeListener('data', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdout.write('\x1b[?25h');
    };

    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', onKeypress);
  });
}

/**
 * Menu Interaktif Horizontal Row dengan Tombol Colored Background (Panah ◄ / ► dan Enter)
 */
export function selectHorizontalButtons(options, title = 'Pilih Action:') {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    const width = 84;
    const innerWidth = width - 4;
    let isFirstRender = true;

    // Print Title sekali saja di luar render agar tidak membuat \n tambahan saat geser
    console.log(`\n${colors.brightYellow}${title}${colors.reset} ${colors.dim}(Gunakan Panah ◄ Kiri / ► Kanan & Enter)${colors.reset}`);

    process.stdout.write('\x1b[?25l');

    const render = () => {
      if (!isFirstRender) {
        readline.moveCursor(process.stdout, 0, -3);
      }
      isFirstRender = false;

      // Baris 1: Top Border Box
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${colors.brightCyan}╔═ ${colors.brightWhite}ACTION BAR${colors.brightCyan} ${'═'.repeat(Math.max(0, width - 15))}╗${colors.reset}\n`);

      // Baris 2: Content Baris Tombol Horizontal
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      const renderedButtons = options.map((opt, idx) => {
        if (idx === selectedIndex) {
          return `${opt.bg}${colors.brightWhite}${colors.bright} ${opt.label} ${colors.reset}`;
        } else {
          return `${colors.dim} ${opt.label} ${colors.reset}`;
        }
      });

      const buttonsLine = '   ' + renderedButtons.join('       ');
      const visibleLength = stripAnsi(buttonsLine).length;
      const paddingLen = Math.max(0, innerWidth - visibleLength);

      process.stdout.write(`${colors.brightCyan}║${colors.reset}${buttonsLine}${' '.repeat(paddingLen)} ${colors.brightCyan}║${colors.reset}\n`);

      // Baris 3: Bottom Border Box
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${colors.brightCyan}╚${'═'.repeat(width - 2)}╝${colors.reset}\n`);
    };

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    render();

    const onKeypress = (chunk, key) => {
      const keyName = key ? key.name : null;
      const rawStr = chunk ? chunk.toString() : '';

      if ((key && key.ctrl && key.name === 'c') || rawStr === '\u0003') {
        cleanup();
        process.exit(0);
      }

      if (keyName === 'left' || keyName === 'a' || rawStr === '\u001b[D') {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
      } else if (keyName === 'right' || keyName === 'd' || rawStr === '\u001b[C') {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
      } else if (keyName === 'return' || keyName === 'enter' || rawStr === '\r' || rawStr === '\n') {
        cleanup();
        resolve({ index: selectedIndex, option: options[selectedIndex] });
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.removeListener('data', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdout.write('\x1b[?25h');
    };

    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', onKeypress);
  });
}
