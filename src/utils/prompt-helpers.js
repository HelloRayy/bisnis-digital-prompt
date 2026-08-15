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

/**
 * Detects real aspect ratio class from prompt parameters or prompt description.
 * Ensures zero content layout shift (0 CLS) and identical aspect ratios across Home & Detail views.
 */
export const getPromptAspectRatioClass = (promptObj) => {
  if (!promptObj) return 'aspect-[3/4]';

  // 1. Direct aspect ratio field on object
  if (promptObj.aspect_ratio) {
    const ar = String(promptObj.aspect_ratio).replace(':', '/').trim();
    return `aspect-[${ar}]`;
  }
  if (promptObj.aspectRatio) {
    const ar = String(promptObj.aspectRatio).replace(':', '/').trim();
    return `aspect-[${ar}]`;
  }

  const text = (promptObj.prompt || '').toLowerCase();

  // 2. Midjourney / AI aspect ratio parameter: --ar X:Y or --aspect X:Y
  const arParamMatch = text.match(/--(?:ar|aspect)\s+(\d+[:/]\d+)/i);
  if (arParamMatch && arParamMatch[1]) {
    const ar = arParamMatch[1].replace(':', '/');
    return `aspect-[${ar}]`;
  }

  // 3. Aspect ratio in JSON structure or explicit tags
  const jsonArMatch = text.match(/"aspect_ratio"\s*:\s*"([^"]+)"/i);
  if (jsonArMatch && jsonArMatch[1]) {
    const ar = jsonArMatch[1].replace(':', '/');
    return `aspect-[${ar}]`;
  }

  // 4. Exact aspect ratio dimensions
  if (text.includes('1080×1080') || text.includes('1080x1080') || text.includes('1:1') || text.includes('1/1') || text.includes('square')) {
    return 'aspect-[1/1]';
  }
  if (text.includes('9:16') || text.includes('9/16') || text.includes('story') || text.includes('reel') || text.includes('tiktok')) {
    return 'aspect-[9/16]';
  }
  if (text.includes('16:9') || text.includes('16/9') || text.includes('widescreen 16:9') || text.includes('cinematic 16:9')) {
    return 'aspect-[16/9]';
  }
  if (text.includes('2:3') || text.includes('2/3')) {
    return 'aspect-[2/3]';
  }
  if (text.includes('4:5') || text.includes('4/5')) {
    return 'aspect-[4/5]';
  }
  if (text.includes('3:4') || text.includes('3/4')) {
    return 'aspect-[3/4]';
  }
  if (text.includes('4:3') || text.includes('4/3')) {
    return 'aspect-[4/3]';
  }

  // 5. Default consistent portrait ratio
  return 'aspect-[3/4]';
};

export { getOptimizedImageUrl, getCleanShortSlug };

