// ============================================================
// HomePage.jsx — Landing page with Hero, Weather, and Explorer.
// ============================================================

import React, { useEffect } from 'react';
import HeroSection from '../components/hero/HeroSection';
import DestinationExplorer from '../components/explorer/DestinationExplorer';
import WeatherWidget from '../components/weather/WeatherWidget';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useWeatherLocation } from '../context/WeatherLocationContext';

const HomePage = () => {
  const { requestLocation, locationState } = useWeatherLocation();

  useEffect(() => {
    // Auto-request location on mount
    if (locationState === 'idle') {
      // Small delay so page renders first
      const t = setTimeout(requestLocation, 1500);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main id="main-content" aria-label="WanderLux Homepage">
      {/* Skip link target */}
      <a
        href="#destination-explorer"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:btn focus:btn-primary focus:btn-sm"
      >
        Skip to destinations
      </a>

      <ErrorBoundary title="Hero section error" description="The hero section could not be displayed.">
        <HeroSection />
      </ErrorBoundary>

      <ErrorBoundary title="Weather unavailable" description="Weather data could not be loaded.">
        <WeatherWidget />
      </ErrorBoundary>

      <ErrorBoundary title="Explorer error" description="Destinations could not be displayed.">
        <DestinationExplorer />
      </ErrorBoundary>
    </main>
  );
};

export default HomePage;
