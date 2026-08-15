import React from 'react';
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from 'hugeicons-react';
import { getOptimizedImageUrl } from '@/utils/image-optimizer';

export default function PromptImageGallery({
  allImages = [],
  selectedIndex = 0,
  onSelectIndex = () => {},
  isLightboxOpen = false,
  onCloseLightbox = () => {},
  onOpenLightbox = () => {},
  alt = ''
}) {
  if (allImages.length === 0) return null;

  return (
    <>
      {/* Thumbnail Nav Selector */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {allImages.map((imgUrl, idx) => (
            <button
              key={`thumb_${idx}`}
              onClick={() => onSelectIndex(idx)}
              className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                idx === selectedIndex 
                  ? 'border-purple-600 scale-105 shadow-sm' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={getOptimizedImageUrl(imgUrl, 160, 70)} 
                alt={`${alt} thumbnail ${idx}`} 
                decoding="async"
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150 select-none">
          <button
            onClick={onCloseLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            title="Tutup (Esc)"
          >
            <Cancel01Icon size={20} />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img
              src={getOptimizedImageUrl(allImages[selectedIndex] || allImages[0], 1600, 85)}
              alt={alt}
              decoding="async"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => onSelectIndex((selectedIndex > 0 ? selectedIndex - 1 : allImages.length - 1))}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer z-50"
                >
                  <ArrowLeft01Icon size={20} />
                </button>
                <button
                  onClick={() => onSelectIndex((selectedIndex < allImages.length - 1 ? selectedIndex + 1 : 0))}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer z-50"
                >
                  <ArrowRight01Icon size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
