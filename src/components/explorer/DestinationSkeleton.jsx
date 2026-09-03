// ============================================================
// DestinationSkeleton.jsx — Shimmer loading placeholder for
// destination cards while images and data load.
// ============================================================

import React from 'react';

const DestinationSkeleton = () => (
  <article
    className="glass-card rounded-2xl overflow-hidden"
    aria-hidden="true"
    aria-label="Loading destination"
  >
    {/* Image placeholder */}
    <div className="h-52 shimmer" />

    <div className="p-5 space-y-3">
      {/* Title & location */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 shimmer rounded-lg w-3/5" />
          <div className="h-3.5 shimmer rounded w-2/5" />
        </div>
        <div className="h-6 w-14 shimmer rounded-full ml-3" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 pt-1">
        <div className="h-3 shimmer rounded w-full" />
        <div className="h-3 shimmer rounded w-4/5" />
      </div>

      {/* Tags row */}
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-14 shimmer rounded-full" />
        <div className="h-5 w-16 shimmer rounded-full" />
        <div className="h-5 w-12 shimmer rounded-full" />
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 shimmer rounded w-1/3" />
        <div className="h-8 shimmer rounded-lg w-24" />
      </div>
    </div>
  </article>
);

export const DestinationSkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading destinations">
    {Array.from({ length: count }).map((_, i) => (
      <DestinationSkeleton key={i} />
    ))}
  </div>
);

export default DestinationSkeleton;
