// ============================================================
// weatherService.js — OpenWeatherMap API integration
// with robust fallback data when API key is unavailable.
// ============================================================

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ---- Fallback mock data ----
const MOCK_WEATHER_BY_CITY = {
  kyoto:       { temp: 22, feelsLike: 20, humidity: 65, windSpeed: 8, description: 'Partly cloudy', icon: '02d', condition: 'Clouds' },
  santorini:   { temp: 28, feelsLike: 30, humidity: 55, windSpeed: 18, description: 'Clear sky', icon: '01d', condition: 'Clear' },
  bali:        { temp: 30, feelsLike: 34, humidity: 80, windSpeed: 12, description: 'Light rain', icon: '10d', condition: 'Rain' },
  'new-york':  { temp: 18, feelsLike: 16, humidity: 70, windSpeed: 22, description: 'Overcast clouds', icon: '04d', condition: 'Clouds' },
  dubai:       { temp: 38, feelsLike: 42, humidity: 35, windSpeed: 15, description: 'Clear sky', icon: '01d', condition: 'Clear' },
  iceland:     { temp: 8, feelsLike: 5, humidity: 85, windSpeed: 35, description: 'Heavy rain', icon: '10d', condition: 'Rain' },
  'machu-picchu': { temp: 14, feelsLike: 12, humidity: 75, windSpeed: 10, description: 'Mist', icon: '50d', condition: 'Mist' },
  patagonia:   { temp: 6, feelsLike: 1, humidity: 80, windSpeed: 60, description: 'Strong wind', icon: '04d', condition: 'Clouds' },
  default:     { temp: 22, feelsLike: 21, humidity: 60, windSpeed: 10, description: 'Partly cloudy', icon: '02d', condition: 'Clouds' },
};

const FALLBACK_WEATHER_BY_COORDS = {
  temp: 23, feelsLike: 22, humidity: 62, windSpeed: 12,
  description: 'Scattered clouds', icon: '03d', condition: 'Clouds',
};

const hasApiKey = () => API_KEY && API_KEY !== 'your_openweathermap_api_key_here';

const normalizeWeatherData = (data) => ({
  city:        data.name || 'Unknown',
  country:     data.sys?.country || '',
  temp:        Math.round(data.main?.temp ?? 22),
  feelsLike:   Math.round(data.main?.feels_like ?? 22),
  humidity:    data.main?.humidity ?? 60,
  windSpeed:   Math.round((data.wind?.speed ?? 10) * 3.6), // m/s → km/h
  description: data.weather?.[0]?.description ?? 'Clear sky',
  icon:        data.weather?.[0]?.icon ?? '01d',
  condition:   data.weather?.[0]?.main ?? 'Clear',
  pressure:    data.main?.pressure ?? 1013,
  visibility:  data.visibility ? Math.round(data.visibility / 1000) : 10,
  sunrise:     data.sys?.sunrise,
  sunset:      data.sys?.sunset,
});

// ---- Get weather by city name ----
export const getWeatherByCity = async (city) => {
  if (!hasApiKey()) {
    const key = city.toLowerCase().replace(/\s+/g, '-');
    const mock = MOCK_WEATHER_BY_CITY[key] || MOCK_WEATHER_BY_CITY.default;
    return { ...mock, city, country: 'XX', pressure: 1013, visibility: 10 };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    return normalizeWeatherData(data);
  } catch (err) {
    console.warn('Weather API failed, using fallback:', err.message);
    return { ...MOCK_WEATHER_BY_CITY.default, city, country: 'XX', pressure: 1013, visibility: 10 };
  }
};

// ---- Get weather by coordinates ----
export const getWeatherByCoords = async (lat, lon) => {
  if (!hasApiKey()) {
    return { ...FALLBACK_WEATHER_BY_COORDS, city: 'Your Location', country: '' };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    return normalizeWeatherData(data);
  } catch (err) {
    console.warn('Weather by coords failed, using fallback:', err.message);
    return { ...FALLBACK_WEATHER_BY_COORDS, city: 'Your Location', country: '' };
  }
};

// ---- Get weather for a destination ----
export const getWeatherForDestination = async (destination) => {
  const { coordinates, name, id } = destination;
  if (!hasApiKey()) {
    const mock = MOCK_WEATHER_BY_CITY[id] || MOCK_WEATHER_BY_CITY.default;
    return { ...mock, city: name, country: '' };
  }
  return getWeatherByCoords(coordinates.lat, coordinates.lon);
};

// ---- Weather icon to emoji map (accessible alternative) ----
export const getWeatherEmoji = (condition) => {
  const map = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌁',
    Dust: '💨',
    Smoke: '💨',
    Tornado: '🌪️',
  };
  return map[condition] || '🌤️';
};

// ---- Get icon URL ----
export const getWeatherIconUrl = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;
