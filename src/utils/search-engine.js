import { getShortTitle } from './prompt-helpers';

// Curated Popular Search Tags for quick exploration
export const POPULAR_SEARCH_TAGS = [
  { label: 'Cyberpunk', query: 'cyberpunk' },
  { label: 'Photography', query: 'photography' },
  { label: '3D Render', query: '3D' },
  { label: 'Poster Design', query: 'poster' },
  { label: 'Food & Drink', query: 'food' },
  { label: 'Fashion', query: 'fashion' },
  { label: 'Logo & UI', query: 'UI' },
  { label: 'Anime & Manga', query: 'anime' }
];

const RECENT_SEARCHES_KEY = 'prompt_hub_recent_searches';

/**
 * Normalizes text for clean search comparison
 */
export function normalizeSearchText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[#@_.-]/g, ' ')       // replace symbols with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Scores a prompt item against search query tokens
 * Returns a numerical score (> 0 if matches, higher is more relevant)
 */
export function scorePromptSearch(item, rawQuery) {
  if (!item || !rawQuery) return 0;
  const cleanQuery = normalizeSearchText(rawQuery);
  if (!cleanQuery) return 0;

  const tokens = cleanQuery.split(' ').filter(t => t.length > 0);
  if (tokens.length === 0) return 0;

  const title = normalizeSearchText(getShortTitle(item) || item.title || '');
  const author = normalizeSearchText(`${item.author || ''} ${item.author_name || ''}`);
  const categories = normalizeSearchText((item.categories || []).join(' '));
  const tags = normalizeSearchText(Array.isArray(item.tags) ? item.tags.join(' ') : (item.tags || ''));
  const model = normalizeSearchText(item.model || '');
  const prompt = normalizeSearchText(item.prompt || '');

  let totalScore = 0;
  let matchedTokensCount = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    // 1. Exact Match in Title / Short Title
    if (title.includes(token)) {
      tokenScore += title.startsWith(token) ? 120 : 100;
    }

    // 2. Match in Category / Tag
    if (categories.includes(token) || tags.includes(token)) {
      tokenScore += 80;
    }

    // 3. Match in Author Handle or Name
    if (author.includes(token)) {
      tokenScore += 70;
    }

    // 4. Match in AI Model
    if (model.includes(token)) {
      tokenScore += 60;
    }

    // 5. Match in Prompt Description / Body
    if (prompt.includes(token)) {
      tokenScore += 40;
    }

    if (tokenScore > 0) {
      matchedTokensCount++;
      totalScore += tokenScore;
    }
  }

  // Require at least all tokens to match for multi-word queries (AND logic)
  if (matchedTokensCount < tokens.length) {
    return 0;
  }

  // Exact whole phrase bonus
  if (title.includes(cleanQuery)) totalScore += 150;
  if (prompt.includes(cleanQuery)) totalScore += 50;

  return totalScore;
}

/**
 * Filters and sorts prompts using the smart scoring search engine
 */
export function searchPrompts(prompts, query) {
  if (!Array.isArray(prompts)) return [];
  if (!query || !query.trim()) return prompts;

  const scored = [];
  for (let i = 0; i < prompts.length; i++) {
    const item = prompts[i];
    const score = scorePromptSearch(item, query);
    if (score > 0) {
      scored.push({ item, score, originalIndex: i });
    }
  }

  // Sort by highest relevance score first, then maintain original order
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.originalIndex - b.originalIndex;
  });

  return scored.map(s => s.item);
}

/**
 * Checks if a single prompt matches a search query
 */
export function matchesPromptSearch(item, query) {
  if (!query || !query.trim()) return true;
  return scorePromptSearch(item, query) > 0;
}

/**
 * LocalStorage Recent Searches Management
 */
export function getRecentSearches() {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecentSearch(query) {
  if (!query || typeof query !== 'string') return;
  const clean = query.trim();
  if (clean.length < 2) return;

  try {
    const current = getRecentSearches();
    const filtered = current.filter(item => item.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...filtered].slice(0, 6);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (e) {
    // Ignore storage quota errors
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {
    // Ignore
  }
}
