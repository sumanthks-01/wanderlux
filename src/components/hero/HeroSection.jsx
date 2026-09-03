// ============================================================
// HeroSection.jsx — Fullscreen hero with ambient video bg,
// Framer Motion text reveal, and smooth scroll CTA.
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Compass, Sparkles, Globe, Cloud, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

// Multiple free travel video sources — tried in order until one loads
const VIDEO_SOURCES = [
  // Mixkit — free, no auth, great quality travel/aerial content
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-ocean-coast-with-a-city-in-the-4118-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-road-through-a-mountain-range-41576-large.mp4',
  // Pexels direct CDN fallback
  'https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4',
  // Coverr fallback
  'https://cdn.coverr.co/videos/coverr-aerial-view-of-a-tropical-island-7358/1080p.mp4',
];
const VIDEO_FALLBACK_POSTER = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const HERO_STATS = [
  { value: '8+',   label: 'Destinations', icon: Globe  },
  { value: 'AI',   label: 'Trip Planner', icon: Map    },
  { value: 'Live', label: 'Weather',      icon: Cloud  },
];

const HeroSection = () => {
  const scrollToExplorer = () => {
    const el = document.getElementById('destination-explorer');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden pt-20"
      aria-label="Hero — Explore the World with WanderLux"
    >
      {/* ---- Ambient Video Background ---- */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={VIDEO_FALLBACK_POSTER}
          className="w-full h-full object-cover scale-105"
          aria-hidden="true"
          preload="auto"
        >
          {VIDEO_SOURCES.map(src => (
            <source key={src} src={src} type="video/mp4" />
          ))}
          <img src={VIDEO_FALLBACK_POSTER} alt="" className="w-full h-full object-cover" />
        </video>

        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/30 to-dark-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/40" />
        <div className="absolute inset-0 bg-dark-900/20" />
      </div>

      {/* ---- Animated particle dots (decorative) ---- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-400/40"
            style={{
              left: `${15 + i * 15}%`,
              top:  `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* ---- Main Content ---- */}
      <div className="relative z-10 section-container text-center pt-8 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex mb-6">
            <span className="badge badge-primary text-xs px-3 py-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              AI-Powered Travel Planning
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-tight"
          >
            Discover
            <span className="block text-gradient"> Your Next</span>
            <span className="block text-white/90">Adventure</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Explore breathtaking destinations around the world. Get AI-powered itineraries,
            real-time weather, and curated travel experiences tailored just for you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={scrollToExplorer}
              className="btn btn-primary btn-lg shadow-glow"
              aria-label="Start exploring destinations"
            >
              <Compass className="w-5 h-5" aria-hidden="true" />
              Start Exploring
            </button>
            <Link
              to="/itinerary"
              className="btn btn-ghost btn-lg"
              aria-label="Plan your trip with AI"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              Plan with AI
            </Link>
          </motion.div>

          {/* Stats — with dividers between items */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center"
          >
            {HERO_STATS.map(({ value, label, icon: Icon }, i) => (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div className="w-px h-10 bg-white/15 mx-8 md:mx-14 flex-shrink-0" aria-hidden="true" />
                )}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <Icon className="w-4 h-4 text-primary-400" aria-hidden="true" />
                    <span className="text-2xl md:text-3xl font-bold text-white font-display">{value}</span>
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">{label}</div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ---- Scroll indicator — just the arrow, no text to avoid overlap ---- */}
      <motion.button
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full glass border border-white/15 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        onClick={scrollToExplorer}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll down to explore destinations"
      >
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
