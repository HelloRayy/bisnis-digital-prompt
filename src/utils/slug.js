// Clean, short URL slug generator for prompts (max 3 words + ID)
export function getCleanShortSlug(promptObj) {
  if (!promptObj) return '/view/prompt-1';
  const idStr = String(promptObj.id || '1');
  const title = promptObj.title || promptObj.prompt || '';
  
  // Clean special chars & remove JSON/formatting clutter
  const cleanTitle = title
    .toLowerCase()
    .replace(/^\{.*?\}/, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
  
  // Stopwords to filter out for concise slugs
  const stopwords = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'and', 'or', 'ultra', 'high', 'quality', 'definition']);
  const words = cleanTitle.split(/\s+/).filter(w => w.length > 1 && !stopwords.has(w));
  
  // Pick top 2-3 clean words
  const shortSlug = words.slice(0, 3).join('-') || 'prompt';
  
  return `/view/${shortSlug}-${idStr}`;
}
