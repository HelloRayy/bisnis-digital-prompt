import promptsData from '../data/prompts.json';
import { getCleanShortSlug } from '../utils/slug';

// Pre-computed O(1) Map Indexing for instant lookups
const promptByIdMap = new Map();
const promptBySlugMap = new Map();

promptsData.forEach((item, index) => {
  const itemWithId = { ...item, _stableId: item.id || `prompt_idx_${index}` };
  promptByIdMap.set(String(item.id), itemWithId);
  
  const slug = getCleanShortSlug(item);
  promptBySlugMap.set(slug, itemWithId);
});

export const getPromptsData = () => promptsData;

export const findPromptById = (id) => {
  if (!id) return null;
  return promptByIdMap.get(String(id)) || null;
};

export const findPromptBySlugOrId = (slugOrId) => {
  if (!slugOrId) return null;
  
  // 1. Direct match by slug
  if (promptBySlugMap.has(slugOrId)) {
    return promptBySlugMap.get(slugOrId);
  }
  
  // 2. Direct match by ID if URL contains ID at end
  const parts = slugOrId.split('-');
  const idFromSlug = parts[parts.length - 1];
  if (promptByIdMap.has(idFromSlug)) {
    return promptByIdMap.get(idFromSlug);
  }

  // 3. Fallback fuzzy scan
  const rawSlug = slugOrId.replace('/view/', '').toLowerCase();
  return promptsData.find(p => (p.title || p.prompt || '').toLowerCase().includes(rawSlug.slice(0, 15))) || null;
};
