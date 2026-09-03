// ============================================================
// HeroSection.jsx — Asymmetric Split Editorial Layout
// Featuring Timed Auto-Switching 5 Nearby Places Spotlight Widget
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Globe, Cloud, Map, ArrowUpRight, MapPin, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeatherLocation } from '../../context/WeatherLocationContext';

// 5 Famous Nearby Places (Location-Aware Default for Bengaluru & Region)
const NEARBY_SPOTLIGHT_PLACES = [
  {
    id: 'mysore-palace',
    title: 'Mysore Palace',
    distance: '140 km from Bengaluru',
    category: 'Royal Heritage',
    desc: 'Magnificent royal palace of the Wadiyar dynasty. Renowned for its grand Sunday evening illumination with 100,000 golden bulbs.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1000&q=80',
    targetDestination: 'Mysore, Karnataka',
  },
  {
    id: 'vidhana-soudha',
    title: 'Vidhana Soudha',
    distance: 'Bengaluru City Center',
    category: 'Architectural Icon',
    desc: 'The majestic seat of Karnataka legislature. A Neo-Dravidian granite marvel showcasing intricate stone carvings and weekend lights.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&q=80',
    targetDestination: 'Bengaluru, Karnataka',
  },
  {
    id: 'coorg',
    title: 'Coorg Coffee Estates',
    distance: '260 km from Bengaluru',
    category: 'Misty Hills & Nature',
    desc: 'Known as the Scotland of India. Endless aromatic coffee plantations, pristine Abbey waterfalls, and soothing mountain retreats.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&q=80',
    targetDestination: 'Coorg, Karnataka',
  },
  {
    id: 'hampi',
    title: 'Hampi Monolithic Temples',
    distance: '340 km from Bengaluru',
    category: 'UNESCO World Heritage',
    desc: 'Surreal boulder-strewn landscape featuring the historic Stone Chariot, Virupaksha temple, and ancient Vijayanagara empire ruins.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&q=80',
    targetDestination: 'Hampi, Karnataka',
  },
  {
    id: 'nandi-hills',
    title: 'Nandi Hills Sunrise',
    distance: '60 km from Bengaluru',
    category: 'Sea of Clouds & Trek',
    desc: 'Perched 1,478m high, famous for early morning cloud inversions, Tipu Sultan’s historical fortress, and scenic mountain drives.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80',
    targetDestination: 'Nandi Hills, Karnataka',
  },
];

const HERO_STATS = [
  { value: '8+',   label: 'Curated Destinations', icon: Globe },
  { value: 'AI',   label: 'Itinerary Engine',    icon: Map },
  { value: 'Live', label: 'Weather Radar',       icon: Cloud },
];

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { locationName } = useWeatherLocation();
  const navigate = useNavigate();

  // Auto-switch tabs every 4.5 seconds unless paused by hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % NEARBY_SPOTLIGHT_PLACES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentPlace = NEARBY_SPOTLIGHT_PLACES[activeTab];

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
          <div className="lg:col-span-6 space-y-8">
            
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

          {/* RIGHT COLUMN: 5 Nearby Places Auto-Switching Spotlight Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative rounded-3xl overflow-hidden glass-card p-3.5 border border-white/15 shadow-2xl">
              
              {/* Aspect Ratio Viewport Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-dark-800">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPlace.id}
                    src={currentPlace.image}
                    alt={currentPlace.title}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-black/30" />

                {/* Floating Top Bar: Location Context & Live Indicator */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                  <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white">
                    <MapPin className="w-3.5 h-3.5 text-primary-500" />
                    <span>Nearby {locationName || 'Bengaluru'} Spotlight</span>
                  </div>
                  <div className="glass px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-2xs font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Auto 4s</span>
                  </div>
                </div>

                {/* Bottom Overlay Info Card */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPlace.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4 }}
                      className="glass-card p-4 sm:p-5 rounded-2xl border border-white/15 space-y-2 backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="text-2xs font-mono font-bold tracking-widest uppercase text-primary-400">
                          {currentPlace.category}
                        </span>
                        <span className="text-2xs text-slate-300 font-medium">
                          📍 {currentPlace.distance}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-white font-display">
                        {currentPlace.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {currentPlace.desc}
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={() => navigate(`/itinerary?destination=${encodeURIComponent(currentPlace.targetDestination)}`)}
                          className="btn btn-primary btn-sm text-xs font-bold"
                          aria-label={`Plan trip to ${currentPlace.title}`}
                        >
                          <span>Plan Trip Here</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-2xs text-slate-400 font-mono">
                          {activeTab + 1} / {NEARBY_SPOTLIGHT_PLACES.length}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* 5 Tab Navigation Buttons at Bottom of Widget */}
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {NEARBY_SPOTLIGHT_PLACES.map((place, idx) => (
                  <button
                    key={place.id}
                    onClick={() => setActiveTab(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeTab ? 'bg-primary-500 w-full shadow-glow' : 'bg-white/15 hover:bg-white/30'
                    }`}
                    title={place.title}
                    aria-label={`Select place ${idx + 1}: ${place.title}`}
                  />
                ))}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
