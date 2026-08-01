import React from 'react';

export function SkeletonCard({ aspectClass = "aspect-3/4" }) {
  return (
    <div className="break-inside-avoid flex flex-col gap-2.5 mb-6 rounded-2xl overflow-hidden animate-pulse">
      {/* Image Skeleton with Shimmer Wave */}
      <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Title & Badge Skeleton */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full w-12" />
      </div>
    </div>
  );
}
