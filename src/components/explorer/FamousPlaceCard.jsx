// ============================================================
// FamousPlaceCard.jsx — Rich interactive card for famous
// places within a destination, with image, tags, and must-see.
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, Zap } from 'lucide-react';
import { fetchDestinationImage } from '../../services/imageService';

const CATEGORY_COLORS = {
  Temple:       'bg-amber-500/15 text-amber-300 border-amber-500/25',
  Shrine:       'bg-rose-500/15 text-rose-300 border-rose-500/25',
  Beach:        'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  Nature:       'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  Museum:       'bg-purple-500/15 text-purple-300 border-purple-500/25',
  Landmark:     'bg-blue-500/15 text-blue-300 border-blue-500/25',
  Village:      'bg-orange-500/15 text-orange-300 border-orange-500/25',
  Activity:     'bg-green-500/15 text-green-300 border-green-500/25',
  Mountain:     'bg-slate-500/15 text-slate-300 border-slate-500/25',
  Hiking:       'bg-teal-500/15 text-teal-300 border-teal-500/25',
  Park:         'bg-lime-500/15 text-lime-300 border-lime-500/25',
  'National Park': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  Glacier:      'bg-sky-500/15 text-sky-300 border-sky-500/25',
  Waterfall:    'bg-blue-500/15 text-blue-300 border-blue-500/25',
  Heritage:     'bg-amber-500/15 text-amber-300 border-amber-500/25',
  Urban:        'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  Spa:          'bg-pink-500/15 text-pink-300 border-pink-500/25',
  Archaeology:  'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
  'Cultural District': 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  Culture:      'bg-violet-500/15 text-violet-300 border-violet-500/25',
  Town:         'bg-slate-500/15 text-slate-300 border-slate-500/25',
  Route:        'bg-blue-500/15 text-blue-300 border-blue-500/25',
  Region:       'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
};

const FamousPlaceCard = ({ place, index = 0 }) => {
  const { id, name, description, query, mustSee, duration, category } = place;
  const [imgData, setImgData] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDestinationImage(query, id).then(img => {
      if (!cancelled) setImgData(img);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [id, query]);

  const catClass = CATEGORY_COLORS[category] || 'bg-slate-500/15 text-slate-300 border-slate-500/25';

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group glass-card rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setExpanded(e => !e)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(v => !v); } }}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      aria-label={`${name} — ${mustSee ? 'Must see' : 'Worth visiting'}`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-dark-700">
        {!imgLoaded && <div className="absolute inset-0 shimmer" aria-hidden="true" />}
        {imgData && (
          <img
            src={imgData.url}
            alt={imgData.alt || name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" aria-hidden="true" />

        {/* Must-see badge */}
        {mustSee && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-accent text-2xs px-2.5 py-1 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" aria-hidden="true" />
              Must See
            </span>
          </div>
        )}

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className={`badge text-2xs px-2 py-1 border ${catClass}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-white font-bold text-base mb-1 leading-snug group-hover:text-primary-300 transition-colors">
          {name}
        </h4>

        <p className={`text-slate-400 text-sm leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
          {description}
        </p>

        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {duration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" aria-hidden="true" />
            {expanded ? 'Show less' : 'Show more'}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default FamousPlaceCard;
