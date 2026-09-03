// ============================================================
// DestinationExplorer.jsx — Search, filter, and display
// destinations with debounced input and animated grid.
// ============================================================

import React, { useState, useMemo, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, MapPin, Map as MapIcon } from 'lucide-react';
import { DESTINATIONS, CATEGORIES, filterDestinations } from '../../data/destinationsData';
import DestinationCard from './DestinationCard';
import { useDebounce } from '../../hooks/useDebounce';

const DestinationExplorer = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchId = useId();

  const debouncedSearch = useDebounce(search, 320);

  const filteredDestinations = useMemo(
    () => filterDestinations(debouncedSearch, selectedCategory),
    [debouncedSearch, selectedCategory]
  );

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
            Destinations
          </div>
          <h2 id="explorer-heading" className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Explore the World
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From ancient temples to pristine beaches — discover destinations that will redefine your sense of wonder.
          </p>
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
              placeholder="Search destinations, countries..."
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
        <div className="text-slate-400 text-sm mb-6" aria-live="polite" aria-atomic="true">
          {filteredDestinations.length === 0
            ? 'No destinations found'
            : `Showing ${filteredDestinations.length} destination${filteredDestinations.length !== 1 ? 's' : ''}`}
          {debouncedSearch && ` for "${debouncedSearch}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
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
                onClick={() => { setSearch(''); setSelectedCategory('All'); }}
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
