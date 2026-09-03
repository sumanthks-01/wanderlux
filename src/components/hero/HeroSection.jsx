// ============================================================
// HeroSection.jsx — Asymmetric Split Editorial Layout
// Featuring Dynamic User-Location-Aware 5 Nearby Places Spotlight
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Globe, Cloud, Map, ArrowUpRight, MapPin, ChevronRight, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeatherLocation } from '../../context/WeatherLocationContext';

// Regional Nearby Places Library
const REGIONAL_PLACE_SETS = {
  // South India / Bengaluru Region
  south_india: [
    {
      id: 'mysore-palace',
      title: 'Mysore Palace',
      distance: '140 km away • Mysuru',
      category: 'Royal Heritage',
      desc: 'Magnificent royal palace of the Wadiyar dynasty. Renowned for its grand Sunday evening illumination with 100,000 golden bulbs.',
      image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1000&q=80',
      targetDestination: 'Mysore, Karnataka',
    },
    {
      id: 'vidhana-soudha',
      title: 'Vidhana Soudha',
      distance: 'City Center • Bengaluru',
      category: 'Architectural Icon',
      desc: 'The majestic seat of Karnataka legislature. A Neo-Dravidian granite marvel showcasing intricate stone carvings and weekend lights.',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&q=80',
      targetDestination: 'Bengaluru, Karnataka',
    },
    {
      id: 'coorg',
      title: 'Coorg Coffee Estates',
      distance: '260 km away • Kodagu',
      category: 'Misty Hills & Nature',
      desc: 'Known as the Scotland of India. Endless aromatic coffee plantations, pristine Abbey waterfalls, and soothing mountain retreats.',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&q=80',
      targetDestination: 'Coorg, Karnataka',
    },
    {
      id: 'hampi',
      title: 'Hampi Monolithic Temples',
      distance: '340 km away • Vijayanagara',
      category: 'UNESCO World Heritage',
      desc: 'Surreal boulder-strewn landscape featuring the historic Stone Chariot, Virupaksha temple, and ancient Vijayanagara empire ruins.',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&q=80',
      targetDestination: 'Hampi, Karnataka',
    },
    {
      id: 'nandi-hills',
      title: 'Nandi Hills Sunrise',
      distance: '60 km away • Chikkaballapur',
      category: 'Sea of Clouds & Trek',
      desc: 'Perched 1,478m high, famous for early morning cloud inversions, Tipu Sultan’s historical fortress, and scenic mountain drives.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80',
      targetDestination: 'Nandi Hills, Karnataka',
    },
  ],

  // Japan / East Asia Region
  japan: [
    {
      id: 'fushimi-inari',
      title: 'Fushimi Inari Shrine',
      distance: 'Historic District • Kyoto',
      category: 'Sacred Shrine',
      desc: 'Thousands of vermilion torii gates winding up a sacred mountain path in one of Japan\'s most iconic cultural pilgrimages.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=80',
      targetDestination: 'Kyoto, Japan',
    },
    {
      id: 'arashiyama',
      title: 'Arashiyama Bamboo Grove',
      distance: 'Western Kyoto',
      category: 'Natural Wonder',
      desc: 'Walk through towering emerald bamboo stalks swaying gracefully in the wind in this serene, otherworldly forest.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&q=80',
      targetDestination: 'Kyoto, Japan',
    },
    {
      id: 'kinkakuji',
      title: 'Kinkaku-ji (Golden Pavilion)',
      distance: 'Northern Kyoto',
      category: 'Zen Heritage',
      desc: 'A Zen temple whose top two floors are completely covered in leaf gold, reflecting magnificently in the mirror pond.',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1000&q=80',
      targetDestination: 'Kyoto, Japan',
    },
    {
      id: 'mt-fuji',
      title: 'Mount Fuji & Chureito',
      distance: '100 km from Tokyo',
      category: 'Iconic Peak',
      desc: 'Japan\'s snow-capped sacred mountain framed by five serene lakes and classic pagoda vistas.',
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=1000&q=80',
      targetDestination: 'Tokyo, Japan',
    },
    {
      id: 'gion',
      title: 'Gion Geisha District',
      distance: 'Central Kyoto',
      category: 'Cultural District',
      desc: 'Preserved wooden machiya townhouses, traditional lantern-lit teahouses, and glimpses of geiko culture.',
      image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1000&q=80',
      targetDestination: 'Kyoto, Japan',
    },
  ],

  // Europe Region
  europe: [
    {
      id: 'oia-greece',
      title: 'Oia Blue Domes',
      distance: 'Caldera Cliff • Santorini',
      category: 'Aegean Island',
      desc: 'Iconic whitewashed cubic houses and cobalt-blue domed churches perched high above the Mediterranean sea.',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=80',
      targetDestination: 'Santorini, Greece',
    },
    {
      id: 'red-beach-greece',
      title: 'Red Volcanic Beach',
      distance: 'Southern Coast • Santorini',
      category: 'Volcanic Coast',
      desc: 'Dramatic crimson and black volcanic cliff formations framing clear turquoise Aegean waters.',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&q=80',
      targetDestination: 'Santorini, Greece',
    },
    {
      id: 'eiffel-paris',
      title: 'Eiffel Tower',
      distance: 'Champ de Mars • Paris',
      category: 'Capital Landmark',
      desc: 'Wrought-iron lattice tower standing as the global symbol of romance, elegance, and French culture.',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1000&q=80',
      targetDestination: 'Paris, France',
    },
    {
      id: 'colosseum-rome',
      title: 'The Colosseum',
      distance: 'City Center • Rome',
      category: 'Ancient History',
      desc: 'The largest ancient amphitheatre ever built, holding two millennia of gladiatorial history and Roman grandeur.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1000&q=80',
      targetDestination: 'Rome, Italy',
    },
    {
      id: 'amsterdam-canals',
      title: 'Grachtengordel Canals',
      distance: 'City Center • Amsterdam',
      category: 'UNESCO Waterways',
      desc: '17th-century historic canal ring lined with narrow gabled merchant houses and picturesque stone bridges.',
      image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1000&q=80',
      targetDestination: 'Amsterdam, Netherlands',
    },
  ],

  // Americas Region
  americas: [
    {
      id: 'central-park-ny',
      title: 'Central Park',
      distance: 'Manhattan • New York',
      category: 'Urban Sanctuary',
      desc: 'An 843-acre lush green oasis set right in the middle of soaring Manhattan skyscrapers.',
      image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1000&q=80',
      targetDestination: 'New York City, USA',
    },
    {
      id: 'machu-picchu-peru',
      title: 'Machu Picchu Citadel',
      distance: 'Andes Range • Peru',
      category: 'Inca Wonder',
      desc: 'High-altitude 15th-century Inca sanctuary cradled dramatically between misty Andean peaks.',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&q=80',
      targetDestination: 'Machu Picchu, Peru',
    },
    {
      id: 'torres-patagonia',
      title: 'Torres del Paine',
      distance: 'Southern Frontier • Patagonia',
      category: 'Wilderness Peak',
      desc: 'Spectacular granite towers, turquoise glacial lakes, and wild Andean steppe landscapes.',
      image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1000&q=80',
      targetDestination: 'Patagonia, Chile',
    },
    {
      id: 'brooklyn-bridge',
      title: 'Brooklyn Bridge Walkway',
      distance: 'East River • New York',
      category: 'Engineering Marvel',
      desc: 'Historic 1883 suspension bridge offering panoramic skyline perspectives over lower Manhattan.',
      image: 'https://images.unsplash.com/photo-1496871455396-14e56815f1f4?w=1000&q=80',
      targetDestination: 'New York City, USA',
    },
    {
      id: 'red-beach-hawaii',
      title: 'Na Pali Coast',
      distance: 'Kauai Island • Hawaii',
      category: 'Tropical Cliffs',
      desc: 'Fluted emerald sea cliffs rising 4,000 feet straight out of the Pacific Ocean.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
      targetDestination: 'Kauai, Hawaii',
    },
  ],

  // Southeast Asia / Bali Region
  southeast_asia: [
    {
      id: 'tegalalang-bali',
      title: 'Tegalalang Rice Terraces',
      distance: 'Ubud • Bali',
      category: 'Emerald Valley',
      desc: 'Cascading emerald green rice paddies sculpted into lush jungle hillsides.',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80',
      targetDestination: 'Bali, Indonesia',
    },
    {
      id: 'uluwatu-bali',
      title: 'Uluwatu Cliff Temple',
      distance: 'Southern Peninsula • Bali',
      category: 'Ocean Sea Temple',
      desc: 'Sea temple balanced on a 70-meter limestone cliff overlooking dramatic surf breaks and sunsets.',
      image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1000&q=80',
      targetDestination: 'Bali, Indonesia',
    },
    {
      id: 'ubud-village',
      title: 'Ubud Cultural Village',
      distance: 'Central Highlands • Bali',
      category: 'Arts & Wellness',
      desc: 'Spiritual heart of Bali filled with artisan galleries, monkey forests, and holistic sanctuaries.',
      image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1000&q=80',
      targetDestination: 'Bali, Indonesia',
    },
    {
      id: 'gardens-singapore',
      title: 'Gardens by the Bay',
      distance: 'Marina Bay • Singapore',
      category: 'Futuristic Park',
      desc: 'Iconic 50-meter Supertree structures illuminated with nightly music and light shows.',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000&q=80',
      targetDestination: 'Singapore',
    },
    {
      id: 'grand-palace-bangkok',
      title: 'Grand Palace Bangkok',
      distance: 'Phra Nakhon • Bangkok',
      category: 'Royal Temple Complex',
      desc: 'Dazzling gilded spires, intricate mosaic tiles, and the sacred Temple of the Emerald Buddha.',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1000&q=80',
      targetDestination: 'Bangkok, Thailand',
    },
  ],
};

const HERO_STATS = [
  { value: '8+',   label: 'Curated Destinations', icon: Globe },
  { value: 'AI',   label: 'Itinerary Engine',    icon: Map },
  { value: 'Live', label: 'Weather Radar',       icon: Cloud },
];

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { locationName, requestLocation } = useWeatherLocation();
  const navigate = useNavigate();

  // Dynamically select the best 5 nearby places dataset based on user's locationName
  const nearbyPlaces = useMemo(() => {
    const locStr = (locationName || '').toLowerCase();

    if (locStr.includes('japan') || locStr.includes('kyoto') || locStr.includes('tokyo') || locStr.includes('osaka')) {
      return REGIONAL_PLACE_SETS.japan;
    }
    if (locStr.includes('europe') || locStr.includes('london') || locStr.includes('paris') || locStr.includes('greece') || locStr.includes('rome') || locStr.includes('greece') || locStr.includes('santorini')) {
      return REGIONAL_PLACE_SETS.europe;
    }
    if (locStr.includes('york') || locStr.includes('usa') || locStr.includes('america') || locStr.includes('california') || locStr.includes('peru')) {
      return REGIONAL_PLACE_SETS.americas;
    }
    if (locStr.includes('bali') || locStr.includes('indonesia') || locStr.includes('singapore') || locStr.includes('thailand') || locStr.includes('bangkok')) {
      return REGIONAL_PLACE_SETS.southeast_asia;
    }

    // Default to South India / Bengaluru region (or general India)
    return REGIONAL_PLACE_SETS.south_india;
  }, [locationName]);

  // Auto-switch tabs every 4.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % nearbyPlaces.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nearbyPlaces.length]);

  const currentPlace = nearbyPlaces[activeTab] || nearbyPlaces[0];

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

          {/* RIGHT COLUMN: User-Location-Aware 5 Nearby Places Auto-Switching Spotlight Widget */}
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

                {/* Floating Top Bar: Location Context & Geolocation Detector */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                  <button
                    onClick={requestLocation}
                    className="glass px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white hover:bg-white/15 transition-all"
                    title="Click to detect your exact GPS location"
                  >
                    <Navigation className="w-3.5 h-3.5 text-primary-500 animate-pulse" />
                    <span>Nearby {locationName || 'Your Region'} Spotlight</span>
                  </button>
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
                          {activeTab + 1} / {nearbyPlaces.length}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* 5 Tab Navigation Buttons at Bottom of Widget */}
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {nearbyPlaces.map((place, idx) => (
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
