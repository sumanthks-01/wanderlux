// ============================================================
// HeroSection.jsx — Asymmetric Split Editorial Layout
// Modern framed video viewport + editorial typography + quick search
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Globe, Cloud, Map, ArrowUpRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const VIDEO_SOURCES = [
  'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-shot-of-waves-crashing-on-a-beach-1504-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-road-through-a-mountain-range-41576-large.mp4',
];

const HERO_STATS = [
  { value: '8+',   label: 'Curated Destinations', icon: Globe },
  { value: 'AI',   label: 'Itinerary Engine',    icon: Map },
  { value: 'Live', label: 'Weather Radar',       icon: Cloud },
];

const HeroSection = () => {
  const scrollToExplorer = () => {
    const el = document.getElementById('destination-explorer');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden bg-dark-900"
      aria-label="Hero — Explore the World with WanderLux"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & Actions */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Top Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 badge badge-primary px-3.5 py-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-500" aria-hidden="true" />
              <span>Next-Gen AI Travel Concierge</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
                <span className="font-display block">Redefine How</span>
                <span className="font-editorial italic font-normal text-primary-500 text-5xl sm:text-7xl lg:text-8xl block my-1">
                  You Travel.
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed pt-2">
                Curated global destinations, instant AI-generated itineraries, and live local weather—crafted effortlessly for your next journey.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={scrollToExplorer}
                className="btn btn-primary btn-lg group"
                aria-label="Start exploring destinations"
              >
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" aria-hidden="true" />
                Explore Destinations
              </button>
              <Link
                to="/itinerary"
                className="btn btn-ghost btn-lg group"
                aria-label="Plan your trip with AI"
              >
                <span>Generate Itinerary</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </motion.div>

            {/* Mini Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4"
            >
              {HERO_STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-primary-500" aria-hidden="true" />
                    <span className="text-xl sm:text-2xl font-bold font-display text-white">{value}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{label}</div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Framed Interactive Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-card p-3 border border-white/15 shadow-2xl">
              
              {/* Aspect Ratio Video Container */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-dark-800">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover scale-105"
                  aria-hidden="true"
                >
                  {VIDEO_SOURCES.map(src => (
                    <source key={src} src={src} type="video/mp4" />
                  ))}
                </video>

                {/* Ambient Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/30" />

                {/* Floating Badge Top Right */}
                <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Experience</span>
                </div>

                {/* Bottom Overlay Card info */}
                <div className="absolute bottom-6 left-6 right-6 p-5 glass-card rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-400 font-mono font-bold tracking-widest uppercase">Spotlight</span>
                    <span className="text-xs text-slate-300">Coastal Haven</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">Discover Tropical Horizons</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Experience oceanfront retreats with personalized daily guides generated in seconds.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
