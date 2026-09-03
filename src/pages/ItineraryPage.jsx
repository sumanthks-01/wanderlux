// ============================================================
// ItineraryPage.jsx — Full AI trip planner page with form
// and interactive timeline rendered from Gemini JSON output.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, AlertTriangle, Map as MapIcon } from 'lucide-react';
import ItineraryForm from '../components/itinerary/ItineraryForm';
import ItineraryTimeline from '../components/itinerary/ItineraryTimeline';
import ItinerarySkeleton from '../components/itinerary/ItinerarySkeleton';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { generateItinerary } from '../services/geminiService';

const ItineraryPage = () => {
  const [searchParams] = useSearchParams();
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill destination from query param (coming from detail page CTA)
  const prefillDestination = searchParams.get('destination') || '';

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const result = await generateItinerary(formData);
      setItinerary(result);
    } catch (err) {
      setError('Could not generate itinerary. Please try again.');
      console.error('Itinerary generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
  };

  return (
    <main id="main-content" className="pt-24 pb-16" aria-label="AI Trip Planner">
      <div className="section-container">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Powered by Gemini AI
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            AI Trip Planner
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tell us your dream destination and travel style. Our AI crafts a personalized,
            day-by-day itinerary just for you — in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form (or reset button when itinerary exists) */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!itinerary && !isLoading ? (
                <ErrorBoundary title="Form error" description="Trip planner form could not be loaded.">
                  <ItineraryForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    defaultDestination={prefillDestination}
                  />
                </ErrorBoundary>
              ) : (
                <motion.div
                  key="reset-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-3xl p-6 sticky top-24"
                >
                  <h3 className="text-white font-bold mb-2">Your Trip is Ready!</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {itinerary
                      ? `${itinerary.totalDays}-day itinerary for ${itinerary.destination} — explore your day-by-day plan.`
                      : 'Generating your personalized itinerary...'}
                  </p>
                  <button
                    onClick={handleReset}
                    className="btn btn-ghost btn-sm w-full"
                    aria-label="Plan a different trip"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    Plan Another Trip
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Timeline or Skeleton or Error */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ItinerarySkeleton />
                </motion.div>
              )}

              {error && !isLoading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8 text-center"
                  role="alert"
                >
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-7 h-7 text-red-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Generation Failed</h3>
                  <p className="text-slate-400 text-sm mb-6">{error}</p>
                  <button
                    onClick={handleReset}
                    className="btn btn-primary"
                    aria-label="Try again"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    Try Again
                  </button>
                </motion.div>
              )}

              {itinerary && !isLoading && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ErrorBoundary title="Timeline error" description="Could not display the itinerary.">
                    <ItineraryTimeline itinerary={itinerary} />
                  </ErrorBoundary>
                </motion.div>
              )}

              {!itinerary && !isLoading && !error && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-3xl p-12 text-center"
                >
                  <div className="w-16 h-16 mb-4 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center">
                  <MapIcon className="w-8 h-8 text-primary-400" aria-hidden="true" />
                </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your Itinerary Appears Here</h3>
                  <p className="text-slate-400 text-sm">
                    Fill in the form and let WanderLux AI craft your perfect trip.
  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ItineraryPage;
