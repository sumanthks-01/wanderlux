// ============================================================
// DestinationExplorer.jsx — User Location-Aware Destination Explorer
// Prioritizes destinations in the user's home country / region.
// ============================================================

import React, { useState, useMemo, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, MapPin, Map as MapIcon, Compass } from 'lucide-react';
import { DESTINATIONS, CATEGORIES, filterDestinations } from '../../data/destinationsData';
import DestinationCard from './DestinationCard';
import { useDebounce } from '../../hooks/useDebounce';
import { useWeatherLocation } from '../../context/WeatherLocationContext';

const DestinationExplorer = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterMode, setFilterMode] = useState('local'); // 'local' | 'all'
  const searchId = useId();
  const { locationName } = useWeatherLocation();

  const debouncedSearch = useDebounce(search, 320);

  // Infer user country from locationName (default: India)
  const userCountry = useMemo(() => {
    if (!locationName) return 'India';
    const loc = locationName.toLowerCase();
    if (loc.includes('usa') || loc.includes('york') || loc.includes('america')) return 'USA';
    if (loc.includes('japan') || loc.includes('tokyo') || loc.includes('kyoto')) return 'Japan';
    if (loc.includes('greece') || loc.includes('france') || loc.includes('europe')) return 'Europe';
    return 'India';
  }, [locationName]);

  const filteredDestinations = useMemo(() => {
    const list = filterDestinations(
      debouncedSearch,
      selectedCategory,
      filterMode === 'local' ? userCountry : ''
    );
    return list;
  }, [debouncedSearch, selectedCategory, filterMode, userCountry]);

  const clearSearch = useCallback(() => setSearch(''), []);

  return (
    <section
      id="destination-explorer"
      className="py-20 bg-section-gradient"
      aria-labelledby="explorer-heading"
    >
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Destinations Near & Global</span>
          </div>

          <h2 id="explorer-heading" className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Places in {userCountry} & World
          </h2>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Personalized for your region. Discover iconic monuments, tranquil hill stations, and tropical escapes.
          </p>

          {/* Region Toggle Bar */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setFilterMode('local')}
              className={`btn btn-sm rounded-full ${
                filterMode === 'local' ? 'btn-primary' : 'btn-ghost text-slate-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Trending in {userCountry}</span>
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`btn btn-sm rounded-full ${
                filterMode === 'all' ? 'btn-primary' : 'btn-ghost text-slate-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>All Global Destinations</span>
            </button>
          </div>
        </motion.div>

        {/* Search & Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search input */}
          <div className="relative max-w-2xl mx-auto">
            <label htmlFor={searchId} className="sr-only">Search destinations</label>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none" aria-hidden="true">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              id={searchId}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search places in ${userCountry}, monuments, beaches...`}
              className="input-field pl-12 pr-10 text-base"
              aria-label="Search destinations"
              autoComplete="off"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div
            className="flex flex-wrap gap-2 justify-center"
            role="group"
            aria-label="Filter by category"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400 self-center" aria-hidden="true" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm transition-all ${
                  selectedCategory === cat
                    ? 'btn-primary'
                    : 'btn-ghost text-slate-400 hover:text-white'
                }`}
                aria-pressed={selectedCategory === cat}
                aria-label={`Filter by ${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result count */}
        <div className="text-slate-400 text-sm mb-6 flex items-center justify-between flex-wrap gap-2" aria-live="polite" aria-atomic="true">
          <span>
            {filteredDestinations.length === 0
              ? 'No destinations found'
              : `Showing ${filteredDestinations.length} destination${filteredDestinations.length !== 1 ? 's' : ''}`}
            {debouncedSearch && ` for "${debouncedSearch}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </span>
          {filterMode === 'local' && (
            <span className="text-xs text-primary-400 font-medium">
              📍 Prioritizing destinations in {userCountry}
            </span>
          )}
        </div>

        {/* Destination Grid */}
        <AnimatePresence mode="wait">
          {filteredDestinations.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
              aria-label="Destination cards"
            >
              {filteredDestinations.map((dest, i) => (
                <div key={dest.id} role="listitem">
                  <DestinationCard destination={dest} index={i} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
              role="status"
            >
              <div className="w-16 h-16 mb-4 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center">
                <MapIcon className="w-8 h-8 text-primary-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No destinations found</h3>
              <p className="text-slate-400 mb-6">
                Try adjusting your search or filters to discover more places.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('All'); setFilterMode('all'); }}
                className="btn btn-primary"
                aria-label="Reset all search filters"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DestinationExplorer;
