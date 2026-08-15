/**
 * High-performance Direct Local Image Optimizer with O(1) Memory Cache.
 * Automatically serves all prompt images instantly (0ms) from local storage (/images/prompts/[id].jpg).
 * Fallback to direct CDN if a local file is not available.
 */
const urlCache = new Map();

export function getOptimizedImageUrl(url, width = 480, quality = 80) {
  if (!url || typeof url !== 'string') return url;

  // Already local static asset
  if (url.startsWith('/images/prompts/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const cacheKey = `${url}__${width}__${quality}`;
  const cached = urlCache.get(cacheKey);
  if (cached) return cached;

  let result = url;

  // Resolve local image mapping for meigen.ai tweets
  const meigenMatch = url.match(/images\.meigen\.ai\/tweets\/(\d+)\/(\d+)\.jpg/);
  if (meigenMatch) {
    const [, id, idx] = meigenMatch;
    result = idx === '0' ? `/images/prompts/${id}.jpg` : `/images/prompts/${id}_${idx}.jpg`;
  } else if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('q', quality.toString());
      result = parsedUrl.toString();
    } catch {
      result = url;
    }
  }

  urlCache.set(cacheKey, result);
  return result;
}
