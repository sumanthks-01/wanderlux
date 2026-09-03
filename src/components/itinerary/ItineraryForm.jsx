// ============================================================
// ItineraryForm.jsx — Trip planner form that collects
// destination, duration, style, and budget before submitting.
// ============================================================

import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Compass, DollarSign,
  Sparkles, Loader2, AlertCircle,
  Landmark, Mountain, Utensils, Waves, Camera, Users
} from 'lucide-react';

const TRAVEL_STYLES = [
  { value: 'Cultural Explorer',     icon: Landmark, desc: 'Temples, museums, history' },
  { value: 'Adventure Seeker',      icon: Mountain, desc: 'Hiking, sports, thrills' },
  { value: 'Foodie Journey',        icon: Utensils,  desc: 'Local cuisine & markets' },
  { value: 'Relaxation & Wellness', icon: Waves,     desc: 'Spas, beaches, slow travel' },
  { value: 'Photography Tour',      icon: Camera,    desc: 'Scenic spots & golden hours' },
  { value: 'Family Friendly',       icon: Users,     desc: 'Kid-friendly, safe, fun' },
];

const BUDGET_LEVELS = [
  { value: 'Budget',    icon: '$',   desc: 'Hostels, street food, free sights' },
  { value: 'Mid-Range', icon: '$$',  desc: 'Hotels, restaurants, tours' },
  { value: 'Luxury',    icon: '$$$', desc: 'Resorts, fine dining, private tours' },
];

const ItineraryForm = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    destination: '',
    days: '3',
    travelStyle: 'Cultural Explorer',
    budget: 'Mid-Range',
    interests: '',
  });
  const [errors, setErrors] = useState({});
  const destId = useId();
  const daysId = useId();
  const interestsId = useId();

  const validate = () => {
    const errs = {};
    if (!form.destination.trim()) errs.destination = 'Please enter a destination.';
    if (!form.days || form.days < 1 || form.days > 14) errs.days = 'Choose between 1 and 14 days.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Focus first invalid field
      const firstErrKey = Object.keys(errs)[0];
      document.getElementById(firstErrKey === 'destination' ? destId : daysId)?.focus();
      return;
    }
    setErrors({});
    onSubmit(form);
  };

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass-card rounded-3xl p-6 md:p-8 space-y-8"
      aria-label="AI Trip Planner Form"
      noValidate
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Plan Your Perfect Trip</h2>
        <p className="text-slate-400 text-sm">
          Tell us your dream — our AI will craft a personalized day-by-day itinerary.
        </p>
      </div>

      {/* Destination */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Trip details</legend>
        <label htmlFor={destId} className="block text-sm font-medium text-slate-300">
          <MapPin className="w-4 h-4 inline mr-1.5 text-primary-400" aria-hidden="true" />
          Destination <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id={destId}
          type="text"
          value={form.destination}
          onChange={e => update('destination', e.target.value)}
          placeholder="e.g. Kyoto, Japan"
          className={`input-field ${errors.destination ? 'border-red-500 focus:border-red-400' : ''}`}
          aria-required="true"
          aria-describedby={errors.destination ? `${destId}-err` : undefined}
          autoComplete="off"
        />
        {errors.destination && (
          <p id={`${destId}-err`} role="alert" className="text-red-400 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            {errors.destination}
          </p>
        )}
      </fieldset>

      {/* Duration */}
      <div className="space-y-2">
        <label htmlFor={daysId} className="block text-sm font-medium text-slate-300">
          <Calendar className="w-4 h-4 inline mr-1.5 text-primary-400" aria-hidden="true" />
          Duration (days) <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 7, 10, 14].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => update('days', String(d))}
              className={`btn btn-sm w-12 ${form.days === String(d) ? 'btn-primary' : 'btn-ghost text-slate-400'}`}
              aria-pressed={form.days === String(d)}
              aria-label={`${d} day${d > 1 ? 's' : ''}`}
            >
              {d}
            </button>
          ))}
        </div>
        {/* Also allow direct input */}
        <input
          id={daysId}
          type="number"
          value={form.days}
          min={1} max={14}
          onChange={e => update('days', e.target.value)}
          className={`input-field w-32 ${errors.days ? 'border-red-500' : ''}`}
          aria-label="Number of days"
          aria-describedby={errors.days ? `${daysId}-err` : undefined}
        />
        {errors.days && (
          <p id={`${daysId}-err`} role="alert" className="text-red-400 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            {errors.days}
          </p>
        )}
      </div>

      {/* Travel Style */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-300">
          <Compass className="w-4 h-4 inline mr-1.5 text-primary-400" aria-hidden="true" />
          Travel Style
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-2"
          role="group"
          aria-label="Select travel style"
        >
          {TRAVEL_STYLES.map(({ value, icon: StyleIcon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => update('travelStyle', value)}
              className={`p-3 rounded-xl text-left transition-all border ${
                form.travelStyle === value
                  ? 'bg-primary-500/15 border-primary-500/40 text-white'
                  : 'glass-light border-transparent text-slate-400 hover:text-white hover:bg-white/8'
              }`}
              aria-pressed={form.travelStyle === value}
            >
              <div className="w-7 h-7 mb-1 flex items-center justify-center">
                <StyleIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="text-xs font-medium leading-tight">{value}</div>
              <div className="text-2xs text-slate-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-300">
          <DollarSign className="w-4 h-4 inline mr-1.5 text-primary-400" aria-hidden="true" />
          Budget Level
        </div>
        <div
          className="flex gap-3 flex-wrap"
          role="group"
          aria-label="Select budget level"
        >
          {BUDGET_LEVELS.map(({ value, icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => update('budget', value)}
              className={`flex-1 min-w-[100px] p-3 rounded-xl text-center transition-all border ${
                form.budget === value
                  ? 'bg-accent-500/15 border-accent-500/40 text-white'
                  : 'glass-light border-transparent text-slate-400 hover:text-white'
              }`}
              aria-pressed={form.budget === value}
            >
              <div className="font-bold text-lg mb-0.5">{icon}</div>
              <div className="text-xs font-medium">{value}</div>
              <div className="text-2xs text-slate-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interests (optional) */}
      <div className="space-y-2">
        <label htmlFor={interestsId} className="block text-sm font-medium text-slate-300">
          Special Interests <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <input
          id={interestsId}
          type="text"
          value={form.interests}
          onChange={e => update('interests', e.target.value)}
          placeholder="e.g. anime, street food, hidden cafes, photography"
          className="input-field"
          aria-label="Optional specific interests for your trip"
        />
        <p className="text-slate-500 text-xs">
          Help our AI personalize your itinerary with specific interests.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary btn-lg w-full shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label={isLoading ? 'Generating your itinerary...' : 'Generate AI itinerary'}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Crafting your perfect trip...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            Generate My Itinerary
          </>
        )}
      </button>
    </motion.form>
  );
};

export default ItineraryForm;
