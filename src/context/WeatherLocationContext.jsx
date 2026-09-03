// ============================================================
// WeatherLocationContext.jsx — Global state for geolocation,
// weather data, and manual location search.
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWeatherByCoords, getWeatherByCity } from '../services/weatherService';

const WeatherLocationContext = createContext(null);

export const useWeatherLocation = () => {
  const ctx = useContext(WeatherLocationContext);
  if (!ctx) throw new Error('useWeatherLocation must be used within WeatherLocationProvider');
  return ctx;
};

export const WeatherLocationProvider = ({ children }) => {
  const [locationState, setLocationState] = useState('idle'); // idle | requesting | granted | denied | unsupported
  const [coordinates, setCoordinates] = useState(null);
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  const convertTemp = useCallback((tempC) => {
    if (unit === 'F') return Math.round((tempC * 9) / 5 + 32);
    return tempC;
  }, [unit]);

  // Request geolocation on mount
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('unsupported');
      return;
    }

    setLocationState('requesting');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        setLocationState('granted');

        setIsLoadingWeather(true);
        setWeatherError(null);
        try {
          const data = await getWeatherByCoords(latitude, longitude);
          setWeather(data);
          setLocationName(data.city || 'Your Location');
        } catch (err) {
          setWeatherError('Could not load weather data.');
        } finally {
          setIsLoadingWeather(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied:', err.message);
        setLocationState('denied');
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Manual city search (fallback)
  const searchByCity = useCallback(async (city) => {
    if (!city.trim()) return;
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await getWeatherByCity(city.trim());
      setWeather(data);
      setLocationName(data.city || city);
      setLocationState('manual');
    } catch (err) {
      setWeatherError('City not found. Please try again.');
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  const toggleUnit = () => setUnit(u => (u === 'C' ? 'F' : 'C'));

  return (
    <WeatherLocationContext.Provider value={{
      locationState,
      coordinates,
      weather,
      locationName,
      isLoadingWeather,
      weatherError,
      unit,
      requestLocation,
      searchByCity,
      toggleUnit,
      convertTemp,
    }}>
      {children}
    </WeatherLocationContext.Provider>
  );
};
