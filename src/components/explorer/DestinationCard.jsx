// ============================================================
// DestinationCard.jsx — Animated, interactive destination card
// with live Unsplash image, rating, category badges, and hover.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, ArrowRight, DollarSign } from 'lucide-react';
import { fetchDestinationImage, getStaticImage } from '../../services/imageService';

const DestinationCard = ({ destination, index = 0 }) => {
  const { id, name, country, tagline, category, heroQuery, rating, avgCostPerDay } = destination;
  const [imgData, setImgData] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const img = await fetchDestinationImage(heroQuery, id);
        if (!cancelled) setImgData(img);
      } catch { /* handled by service */ }
    };
    load();
    return () => { cancelled = true; };
  }, [id, heroQuery]);

  const imageUrl = imgData?.url || destination.image || getStaticImage(id).url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group glass-card card cursor-pointer relative"
    >
      <Link
        to={`/destination/${id}`}
        className="block"
        aria-label={`Explore ${name}, ${country}`}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-dark-700">
          {/* Shimmer until loaded */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 shimmer" aria-hidden="true" />
          )}

          <img
            src={imageUrl}
            alt={`${name} - ${country}`}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imgLoaded || imageUrl ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              setImgError(true);
              setImgLoaded(true);
              const fallback = getStaticImage(id).url;
              if (e.target.src !== fallback) {
                e.target.src = fallback;
              }
            }}
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" aria-hidden="true" />

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 glass px-2.5 py-1 rounded-full" aria-label={`Rating: ${rating} out of 5`}>
            <Star className="w-3 h-3 text-accent-400 fill-current" aria-hidden="true" />
            <span className="text-white text-xs font-semibold">{rating}</span>
          </div>

          {/* Category tags on image */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {category.slice(0, 2).map(cat => (
              <span key={cat} className="badge badge-primary text-2xs px-2 py-0.5">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary-300 transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span className="text-slate-400 text-sm">{country}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-0.5 text-accent-400">
                <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-sm font-semibold">{avgCostPerDay}/day</span>
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {tagline}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Best: {destination.bestTimeToVisit?.split(',')[0]}</span>
            </div>
            <span className="flex items-center gap-1 text-primary-400 text-sm font-medium group-hover:gap-2 transition-all">
              Explore
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default DestinationCard;
