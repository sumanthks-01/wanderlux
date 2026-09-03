// ============================================================
// DestinationDetailPage.jsx — Rich destination detail page
// with hero gallery, facts, weather badge, and famous places.
// ============================================================

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, DollarSign, Globe, Languages, Clock,
  ArrowLeft, Calendar, Thermometer, ChevronLeft, ChevronRight,
  Wind, Droplets, Calendar as CalendarIcon, Map as MapIcon
} from 'lucide-react';
import { getDestinationById } from '../data/destinationsData';
import { fetchImages } from '../services/imageService';
import { getWeatherForDestination } from '../services/weatherService';
import FamousPlaceCard from '../components/explorer/FamousPlaceCard';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { getWeatherEmoji } from '../services/weatherService';

// Shimmer for gallery
const GallerySkeleton = () => (
  <div className="grid grid-cols-3 gap-2 h-64 md:h-80">
    <div className="col-span-2 shimmer rounded-xl" />
    <div className="grid grid-rows-2 gap-2">
      <div className="shimmer rounded-xl" />
      <div className="shimmer rounded-xl" />
    </div>
  </div>
);

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = getDestinationById(id);

  const [images, setImages]       = useState([]);
  const [imgsLoading, setImgsLoading] = useState(true);
  const [weather, setWeather]     = useState(null);
  const [heroIdx, setHeroIdx]     = useState(0);

  useEffect(() => {
    if (!destination) return;
    window.scrollTo({ top: 0 });

    // Fetch gallery images
    setImgsLoading(true);
    fetchImages(destination.heroQuery, 4)
      .then(imgs => { setImages(imgs); setImgsLoading(false); })
      .catch(() => setImgsLoading(false));

    // Fetch weather
    getWeatherForDestination(destination)
      .then(setWeather)
      .catch(() => {});
  }, [id, destination]);

  // Cycle through hero images
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);

  if (!destination) {
    return (
      <main className="pt-24 pb-16" id="main-content" aria-label="Destination not found">
        <div className="section-container text-center">
          <div className="w-16 h-16 mb-4 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center">
            <MapIcon className="w-8 h-8 text-primary-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Destination Not Found</h1>
          <p className="text-slate-400 mb-6">We couldn't find the destination you're looking for.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  const { name, country, tagline, description, rating, reviewCount,
          avgCostPerDay, currency, language, bestTimeToVisit, climate,
          quickFacts, famousPlaces, category } = destination;

  const heroImg = images[heroIdx];
  const prevImg = () => setHeroIdx(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setHeroIdx(i => (i + 1) % images.length);

  return (
    <main id="main-content" className="pt-20 pb-16" aria-label={`${name} destination details`}>
      <article>
        {/* ---- Hero Gallery ---- */}
        <section aria-label={`${name} photo gallery`} className="relative">
          <div className="relative h-[50vh] md:h-[65vh] overflow-hidden bg-dark-800">
            <AnimatePresence mode="crossfade">
              {heroImg && (
                <motion.img
                  key={heroImg.id}
                  src={heroImg.fullUrl || heroImg.url}
                  alt={heroImg.alt || `${name}, ${country}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                />
              )}
            </AnimatePresence>
            {!heroImg && imgsLoading && (
              <div className="absolute inset-0 shimmer" aria-hidden="true" />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/50 via-transparent to-transparent" aria-hidden="true" />

            {/* Gallery navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl glass text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl glass text-white hover:bg-white/20 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist" aria-label="Photo navigation">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? 'bg-white w-6' : 'bg-white/40'}`}
                      aria-label={`Go to photo ${i + 1}`}
                      aria-selected={i === heroIdx}
                      role="tab"
                    />
                  ))}
                </div>
              </>
            )}

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 glass btn btn-sm"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </button>
          </div>
        </section>

        <div className="section-container">
          {/* ---- Header ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="-mt-16 relative z-10 mb-8"
          >
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.map(cat => (
                      <span key={cat} className="badge badge-primary text-xs">{cat}</span>
                    ))}
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-1">
                    {name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>{country}</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-3 max-w-lg">{tagline}</p>
                </div>

                {/* Rating + Weather */}
                <div className="space-y-3">
                  <div
                    className="glass-light rounded-2xl p-4 flex items-center gap-3"
                    aria-label={`Rating: ${rating} from ${reviewCount.toLocaleString()} reviews`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-5 h-5 text-accent-400 fill-current" aria-hidden="true" />
                        <span className="text-white font-bold text-xl">{rating}</span>
                      </div>
                      <div className="text-slate-400 text-xs">{reviewCount.toLocaleString()} reviews</div>
                    </div>
                  </div>

                  {weather && (
                    <div
                      className="glass-light rounded-2xl p-4 text-center"
                      aria-label={`Current weather: ${weather.temp}°C, ${weather.description}`}
                    >
                      <div className="text-2xl" role="img" aria-label={weather.description}>
                        {getWeatherEmoji(weather.condition)}
                      </div>
                      <div className="text-white font-bold mt-1">{weather.temp}°C</div>
                      <div className="text-slate-400 text-xs capitalize">{weather.description}</div>
                      <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-0.5">
                          <Droplets className="w-3 h-3" aria-hidden="true" />
                          {weather.humidity}%
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Wind className="w-3 h-3" aria-hidden="true" />
                          {weather.windSpeed}km/h
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---- Quick Facts Grid ---- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            aria-labelledby="quick-facts-heading"
            className="mb-10"
          >
            <h2 id="quick-facts-heading" className="sr-only">Quick facts about {name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: DollarSign, label: 'Avg Cost',    value: `$${avgCostPerDay}/day` },
                { icon: Globe,      label: 'Currency',    value: currency },
                { icon: Languages,  label: 'Language',    value: language },
                { icon: CalendarIcon,label: 'Best Time',   value: bestTimeToVisit?.split(',')[0] },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary-400" aria-hidden="true" />
                    <span className="text-slate-400 text-xs uppercase tracking-wider">{label}</span>
                  </div>
                  <div className="text-white font-semibold text-sm leading-snug">{value}</div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ---- Description ---- */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            aria-labelledby="about-heading"
            className="mb-12"
          >
            <h2 id="about-heading" className="text-2xl font-bold text-white mb-4 font-display">
              About {name}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">{description}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4 text-primary-400" aria-hidden="true" />
                <span><strong className="text-slate-300">Best Time:</strong> {bestTimeToVisit}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Thermometer className="w-4 h-4 text-accent-400" aria-hidden="true" />
                <span><strong className="text-slate-300">Climate:</strong> {climate}</span>
              </div>
            </div>
          </motion.section>

          {/* ---- Famous Places ---- */}
          <ErrorBoundary title="Famous places error" description="Famous places could not be loaded.">
            <section aria-labelledby="famous-places-heading" className="mb-12">
              <motion.h2
                id="famous-places-heading"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-2xl font-bold text-white mb-6 font-display"
              >
                Famous Places in {name}
              </motion.h2>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                role="list"
                aria-label={`Famous places in ${name}`}
              >
                {famousPlaces.map((place, i) => (
                  <div key={place.id} role="listitem">
                    <FamousPlaceCard place={place} index={i} />
                  </div>
                ))}
              </div>
            </section>
          </ErrorBoundary>

          {/* ---- CTA ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2 font-display">
              Ready to visit {name}?
            </h2>
            <p className="text-slate-400 mb-6">
              Let our AI create your perfect personalized itinerary.
            </p>
            <Link
              to={`/itinerary?destination=${encodeURIComponent(name)}`}
              className="btn btn-primary btn-lg shadow-glow"
              aria-label={`Plan my trip to ${name}`}
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              Plan My Trip to {name}
            </Link>
          </motion.div>
        </div>
      </article>
    </main>
  );
};

export default DestinationDetailPage;
