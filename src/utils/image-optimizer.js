/**
 * Optimize image URLs for fast web delivery.
 * Automatically adds webp/format & responsive width parameters for Unsplash images.
 */
export function getOptimizedImageUrl(url, width = 500, quality = 75) {
  if (!url || typeof url !== 'string') return url;

  // Unsplash Optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('q', quality.toString());
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
}
