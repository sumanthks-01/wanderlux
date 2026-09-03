// ============================================================
// WeatherWidget.jsx — Visual weather display with live data
// from OpenWeatherMap, animated icon, and unit toggle.
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer, Droplets, Wind, Eye, MapPin,
  Search, AlertCircle, Loader2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useWeatherLocation } from '../../context/WeatherLocationContext';
import { getWeatherEmoji } from '../../services/weatherService';

const WeatherSkeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 shimmer rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="h-8 shimmer rounded w-1/3" />
        <div className="h-4 shimmer rounded w-1/2" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 shimmer rounded-xl" />
      ))}
    </div>
  </div>
);

const StatBox = ({ icon: Icon, label, value, unit = '' }) => (
  <div className="glass-light rounded-xl p-3 flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-primary-400" aria-hidden="true" />
    </div>
    <div>
      <div className="text-xs text-slate-500 leading-none mb-0.5">{label}</div>
      <div className="text-white font-semibold text-sm">{value}{unit}</div>
    </div>
  </div>
);

const WeatherWidget = () => {
  const {
    locationState, weather, locationName, isLoadingWeather,
    weatherError, unit, requestLocation, searchByCity, toggleUnit, convertTemp,
  } = useWeatherLocation();

  const [cityInput, setCityInput] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!cityInput.trim()) {
      setInputError('Please enter a city name.');
      return;
    }
    setInputError('');
    searchByCity(cityInput.trim());
    setCityInput('');
  };

  return (
    <section
      className="py-16"
      aria-labelledby="weather-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id="weather-heading" className="text-xl font-bold text-white">
                  Local Weather
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  {locationState === 'granted' || locationState === 'manual'
                    ? `Showing weather for ${locationName}`
                    : 'Enter your city or enable location'}
                </p>
              </div>
              {weather && (
                <button
                  onClick={toggleUnit}
                  className="flex items-center gap-1.5 btn btn-ghost btn-sm text-xs"
                  aria-label={`Switch to degrees ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
                >
                  {unit === 'C'
                    ? <ToggleLeft className="w-4 h-4" aria-hidden="true" />
                    : <ToggleRight className="w-4 h-4 text-primary-400" aria-hidden="true" />
                  }
                  °{unit}
                </button>
              )}
            </div>

            {/* Loading state */}
            {isLoadingWeather && <WeatherSkeleton />}

            {/* Error */}
            {weatherError && !isLoadingWeather && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4" role="alert">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
                <p className="text-red-300 text-sm">{weatherError}</p>
              </div>
            )}

            {/* Weather display */}
            {weather && !isLoadingWeather && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Main temp display */}
                <div className="flex items-center gap-4">
                  <div
                    className="text-6xl select-none"
                    role="img"
                    aria-label={`Weather: ${weather.description}`}
                  >
                    {getWeatherEmoji(weather.condition)}
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-white font-display">
                      {convertTemp(weather.temp)}°{unit}
                    </div>
                    <div className="text-slate-300 text-sm capitalize mt-1">{weather.description}</div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      <span>{locationName}{weather.country ? `, ${weather.country}` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <StatBox
                    icon={Thermometer}
                    label="Feels like"
                    value={`${convertTemp(weather.feelsLike)}°${unit}`}
                  />
                  <StatBox
                    icon={Droplets}
                    label="Humidity"
                    value={weather.humidity}
                    unit="%"
                  />
                  <StatBox
                    icon={Wind}
                    label="Wind"
                    value={weather.windSpeed}
                    unit=" km/h"
                  />
                  <StatBox
                    icon={Eye}
                    label="Visibility"
                    value={weather.visibility}
                    unit=" km"
                  />
                </div>
              </motion.div>
            )}

            {/* Initial / denied / unsupported states */}
            {!weather && !isLoadingWeather && (
              <div className="space-y-4">
                {(locationState === 'idle' || locationState === 'denied' || locationState === 'unsupported') && (
                  <div className="text-center py-4">
                    {locationState === 'denied' && (
                      <p className="text-amber-300 text-sm mb-4 flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        Location access denied — search manually
                      </p>
                    )}
                    {locationState === 'unsupported' && (
                      <p className="text-slate-400 text-sm mb-4">
                        Geolocation not supported — search below
                      </p>
                    )}
                    {locationState === 'idle' && (
                      <button
                        onClick={requestLocation}
                        className="btn btn-primary mb-4"
                        aria-label="Allow location access for weather"
                      >
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        Use My Location
                      </button>
                    )}
                  </div>
                )}

                {locationState === 'requesting' && (
                  <div className="flex items-center justify-center gap-3 py-6 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-400" aria-hidden="true" />
                    <span>Requesting location access...</span>
                  </div>
                )}
              </div>
            )}

            {/* Manual city search — always visible */}
            <form
              onSubmit={handleSearch}
              className="mt-5"
              aria-label="Search weather by city"
            >
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="weather-city-input" className="sr-only">City name</label>
                  <input
                    id="weather-city-input"
                    type="text"
                    value={cityInput}
                    onChange={e => { setCityInput(e.target.value); setInputError(''); }}
                    placeholder="Search any city..."
                    className="input-field"
                    aria-describedby={inputError ? 'weather-city-error' : undefined}
                    autoComplete="off"
                  />
                  {inputError && (
                    <p id="weather-city-error" className="text-red-400 text-xs mt-1" role="alert">
                      {inputError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  aria-label="Search weather for city"
                  disabled={isLoadingWeather}
                >
                  {isLoadingWeather
                    ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    : <Search className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WeatherWidget;
