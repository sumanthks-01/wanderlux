// ============================================================
// ItinerarySkeleton.jsx — Shimmer loading for the itinerary
// timeline while Gemini AI generates the response.
// ============================================================

import React from 'react';

const ItinerarySkeleton = () => (
  <div className="space-y-4" aria-hidden="true" aria-label="Loading itinerary">
    {/* Summary block */}
    <div className="glass-card rounded-2xl p-6 space-y-3">
      <div className="h-6 shimmer rounded w-1/3" />
      <div className="h-4 shimmer rounded w-full" />
      <div className="h-4 shimmer rounded w-4/5" />
    </div>

    {/* Day tabs */}
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-9 w-20 shimmer rounded-xl" />
      ))}
    </div>

    {/* Timeline items */}
    {[...Array(5)].map((_, i) => (
      <div key={i} className="glass-card rounded-2xl p-5 flex gap-4">
        <div className="w-14 h-14 shimmer rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 shimmer rounded w-1/3" />
          <div className="h-3 shimmer rounded w-full" />
          <div className="h-3 shimmer rounded w-3/4" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-16 shimmer rounded-full" />
            <div className="h-5 w-12 shimmer rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ItinerarySkeleton;
