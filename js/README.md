# Prompt Miner Engine & Scraper CLI

Folder ini berisi modul & skrip CLI Scraping Engine untuk ekstraksi data prompt AI media sosial:

- `js/cli.js`: Entry point utama CLI dengan menu interaktif Arrow Keys, Parameter Input Box, & Stepper.
- `js/scraper_tools.js`: Engine scraper pipeline, keyword matching relevance, multi-stage extraction, & disk storage sync.
- `js/banner.js`: Komponen styling ANSI terminal, banner ASCII, word-wrap box, progress bar, & custom input controllers.

### Cara Menjalankan:
```bash
npm run scrape:visualize
```
*atau:*
```bash
node js/cli.js
```
