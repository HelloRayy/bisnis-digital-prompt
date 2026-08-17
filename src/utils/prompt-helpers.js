import { getOptimizedImageUrl } from './image-optimizer';
import { getCleanShortSlug } from './slug';

/**
 * Extracts a short, concise 1-line title for a prompt item
 */
export const getShortTitle = (promptObj) => {
  if (!promptObj) return 'Untitled Artwork';
  const cleanPrompt = (promptObj.prompt || '').replace(/^\{.*?\}/, '').trim();
  if (cleanPrompt.length <= 26) return cleanPrompt || 'Untitled Artwork';
  
  const words = cleanPrompt.split(' ');
  if (words.length > 3) {
    const shortSnippet = words.slice(0, 3).join(' ');
    if (shortSnippet.length > 26) return shortSnippet.slice(0, 25) + '...';
    return shortSnippet;
  }
  return cleanPrompt.slice(0, 25) + '...';
};

/**
 * Calculates prompt credit cost
 */
export const getPromptCost = (promptObj) => {
  if (!promptObj) return 400;
  return promptObj.cost ?? (promptObj.prompt?.length >= 1533 ? 500 : 400);
};

/**
 * Detects real aspect ratio class or assigns an organic asymmetric ratio.
 * Mimics Behance / Pinterest asymmetric visual masonry feed with organic proportions.
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

  // 4. Exact aspect ratio keywords
  if (text.includes('1080×1080') || text.includes('1080x1080') || text.includes('1:1') || text.includes('square')) {
    return 'aspect-[1/1]';
  }
  if (text.includes('9:16') || text.includes('9/16') || text.includes('story') || text.includes('reel') || text.includes('tiktok')) {
    return 'aspect-[9/16]';
  }
  if (text.includes('16:9') || text.includes('16/9') || text.includes('widescreen') || text.includes('cinematic')) {
    return 'aspect-[16/9]';
  }
  if (text.includes('2:3') || text.includes('2/3')) {
    return 'aspect-[2/3]';
  }
  if (text.includes('4:5') || text.includes('4/5')) {
    return 'aspect-[4/5]';
  }

  // 5. Rich Organic Asymmetric Masonry fallback (based on item id/hash for Behance/Pinterest look)
  const organicRatios = [
    'aspect-[9/16]',   // Ultra-tall vertical poster (like Behance leftmost card)
    'aspect-[3/4]',    // Classic portrait
    'aspect-[1/1]',    // Balanced square
    'aspect-[4/5]',    // Medium tall portrait
    'aspect-[2/3]',    // Extra tall artwork
    'aspect-[9/14]',   // Editorial tall
    'aspect-[16/11]',  // Horizontal wide
    'aspect-[3/5]'     // Slender vertical
  ];

  const hashId = typeof promptObj.id === 'number' 
    ? promptObj.id 
    : (String(promptObj.id || promptObj.prompt || '').length);
  
  return organicRatios[hashId % organicRatios.length];
};

export { getOptimizedImageUrl, getCleanShortSlug };
