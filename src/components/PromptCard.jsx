import React, { useState } from 'react';
import { ViewIcon, FavouriteIcon, Coins01Icon, CircleUnlock01Icon } from 'hugeicons-react';
import { getCleanShortSlug } from '../utils/slug';

export default function PromptCard({ 
  prompt, 
  onOpenDetail, 
  isFavorite, 
  isUnlocked, 
  onToggleFavorite 
}) {
  const { rank, likes, views, image, categories, model, isPremium, author } = prompt;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    if (onOpenDetail) {
      onOpenDetail(prompt, getCleanShortSlug(prompt));
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{ contentVisibility: 'auto' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl glassmorphism transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
    >
      {/* Category Tag (Top Left) */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
        {categories.map((cat, i) => (
          <span 
            key={i} 
            className="text-[10px] font-semibold px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Model & Premium Tag (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-600/90 text-white border border-purple-400/30 shadow-lg">
          {model}
        </span>
        {isPremium && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md ${
            isUnlocked ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black'
          }`}>
            {isUnlocked ? <CircleUnlock01Icon size={10} /> : <Coins01Icon size={10} />}
            {isUnlocked ? 'Unlocked' : 'Premium'}
          </span>
        )}
      </div>

      {/* Image Area */}
      <div className="relative aspect-3/4 overflow-hidden bg-zinc-900">
        {!isLoaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        )}
        <img 
          src={image} 
          alt={prompt.prompt} 
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
          }`}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="mb-3">
          <p className="text-xs text-zinc-500">@{author}</p>
          <p className="text-sm font-medium text-zinc-200 line-clamp-2 mt-1 leading-snug">
            {prompt.prompt.startsWith('{') ? 'Structured JSON Prompt' : prompt.prompt}
          </p>
        </div>

        {/* Foot Stats & Favorite Toggle */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-zinc-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id);
            }}
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
          >
            <FavouriteIcon size={14} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-zinc-500'} />
            <span>{(likes + (isFavorite ? 1 : 0)).toLocaleString()}</span>
          </button>
          <div className="flex items-center gap-1">
            <ViewIcon size={14} className="text-zinc-500" />
            <span>{views.toLocaleString()}</span>
          </div>
          <div className="font-mono text-purple-400">
            Rank #{rank}
          </div>
        </div>
      </div>
    </div>
  );
}
