// ============================================================
// ItineraryTimeline.jsx — Interactive day-by-day visual
// accordion timeline rendered from Gemini's JSON output.
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Tag, DollarSign, Lightbulb, ChevronDown,
  MapPin, Coffee, Camera, Utensils, Mountain, Bus,
  Sunset, Music, ShoppingBag, Star, Calendar, Package
} from 'lucide-react';


const ACTIVITY_ICONS = {
  'Sightseeing':   Camera,
  'Food & Drink':  Utensils,
  'Cultural':      Star,
  'Adventure':     Mountain,
  'Transport':     Bus,
  'Leisure':       Sunset,
  'Entertainment': Music,
  'Shopping':      ShoppingBag,
  'Breakfast':     Coffee,
  'Dinner':        Utensils,
  'default':       MapPin,
};

const ACTIVITY_COLORS = {
  'Sightseeing':   'from-blue-500/20 to-blue-600/10   border-blue-500/20  text-blue-300',
  'Food & Drink':  'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-300',
  'Cultural':      'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-300',
  'Adventure':     'from-green-500/20 to-green-600/10  border-green-500/20  text-green-300',
  'Transport':     'from-slate-500/20 to-slate-600/10  border-slate-500/20  text-slate-300',
  'Leisure':       'from-amber-500/20 to-amber-600/10  border-amber-500/20  text-amber-300',
  'Entertainment': 'from-pink-500/20 to-pink-600/10   border-pink-500/20   text-pink-300',
  'Shopping':      'from-cyan-500/20 to-cyan-600/10   border-cyan-500/20   text-cyan-300',
  'default':       'from-primary-500/20 to-primary-600/10 border-primary-500/20 text-primary-300',
};

const ActivityCard = ({ activity, index }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.default;
  const colorClass = ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`relative flex gap-4 p-4 rounded-2xl bg-gradient-to-br border cursor-pointer transition-all hover:bg-white/5 ${colorClass}`}
      onClick={() => setExpanded(e => !e)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(v => !v); }}}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      aria-label={`${activity.time} — ${activity.activity}`}
    >
      {/* Time pill + Icon */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0 w-14">
        <div className="text-xs font-mono font-bold text-white bg-white/10 rounded-lg px-2 py-1 text-center">
          {activity.time}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center ${colorClass.split(' ').slice(0,2).join(' ')}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-white font-semibold text-sm leading-snug">{activity.activity}</h4>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>

        <p className={`text-slate-400 text-sm mt-1 leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
          {activity.description}
        </p>

        {/* Quick meta tags */}
        <div className="flex flex-wrap gap-2 mt-2.5">
          {activity.duration && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {activity.duration}
            </span>
          )}
          {activity.type && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Tag className="w-3 h-3" aria-hidden="true" />
              {activity.type}
            </span>
          )}
          {activity.estimatedCost && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <DollarSign className="w-3 h-3" aria-hidden="true" />
              {activity.estimatedCost}
            </span>
          )}
        </div>

        {/* Expanded content — pro tip */}
        <AnimatePresence>
          {expanded && activity.tips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                  Pro Tip
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{activity.tips}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ItineraryTimeline = ({ itinerary }) => {
  const [activeDay, setActiveDay] = useState(0);

  if (!itinerary || !itinerary.days?.length) return null;

  const currentDay = itinerary.days[activeDay];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Summary card */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white font-display">
              {itinerary.destination}
            </h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="badge badge-primary">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {itinerary.totalDays} {itinerary.totalDays === 1 ? 'Day' : 'Days'}
              </span>
              <span className="badge badge-accent">{itinerary.travelStyle}</span>
            </div>
          </div>
          {itinerary.budgetEstimate && (
            <div className="glass-light rounded-xl px-4 py-2 text-right">
              <div className="text-xs text-slate-400 mb-1">Mid-Range Estimate</div>
              <div className="text-white font-bold">{itinerary.budgetEstimate.midRange}</div>
            </div>
          )}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{itinerary.summary}</p>

        {/* Highlights */}
        {itinerary.highlights?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {itinerary.highlights.map((h, i) => (
              <span key={i} className="badge badge-primary text-xs">{h}</span>
            ))}
          </div>
        )}
      </div>

      {/* Day selector tabs */}
      <div
        className="flex gap-2 flex-wrap"
        role="tablist"
        aria-label="Select day"
      >
        {itinerary.days.map((day, i) => (
          <button
            key={i}
            role="tab"
            onClick={() => setActiveDay(i)}
            className={`btn btn-sm transition-all ${
              activeDay === i ? 'btn-primary' : 'btn-ghost text-slate-400'
            }`}
            aria-selected={activeDay === i}
            aria-controls={`day-panel-${i}`}
            id={`day-tab-${i}`}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      {/* Active day panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          id={`day-panel-${activeDay}`}
          role="tabpanel"
          aria-labelledby={`day-tab-${activeDay}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Day header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
              {currentDay.day}
            </div>
            <div>
              <h4 className="text-white font-bold">{currentDay.title}</h4>
              {currentDay.theme && (
                <p className="text-slate-400 text-xs">{currentDay.theme}</p>
              )}
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-3" role="list" aria-label={`Day ${currentDay.day} activities`}>
            {currentDay.activities?.map((activity, i) => (
              <div key={i} role="listitem">
                <ActivityCard activity={activity} index={i} />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Packing tips */}
      {itinerary.packingTips?.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-400" aria-hidden="true" />
            Packing Tips
          </h4>
          <ul className="space-y-2" role="list">
            {itinerary.packingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-primary-400 mt-1 flex-shrink-0" aria-hidden="true">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ItineraryTimeline;
