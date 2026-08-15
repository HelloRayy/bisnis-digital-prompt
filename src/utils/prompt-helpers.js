import { getOptimizedImageUrl } from './image-optimizer';
import { getCleanShortSlug } from './slug';

/**
 * Extracts a short, concise 1-line title for a prompt item
 */
export const getShortTitle = (promptObj) => {
  if (!promptObj) return 'Untitled Artwork';
  const cleanPrompt = (promptObj.prompt || '').replace(/^\{.*?\}/, '').trim();
  if (cleanPrompt.length <= 24) return cleanPrompt || 'Untitled Artwork';
  
  const words = cleanPrompt.split(' ');
  if (words.length > 3) {
    const shortSnippet = words.slice(0, 3).join(' ');
    if (shortSnippet.length > 24) return shortSnippet.slice(0, 23) + '...';
    return shortSnippet;
  }
  return cleanPrompt.slice(0, 23) + '...';
};

/**
 * Calculates prompt credit cost
 */
export const getPromptCost = (promptObj) => {
  if (!promptObj) return 400;
  return promptObj.cost ?? (promptObj.prompt?.length >= 1533 ? 500 : 400);
};

export { getOptimizedImageUrl, getCleanShortSlug };
