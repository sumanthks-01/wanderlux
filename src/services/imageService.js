// ============================================================
// imageService.js — Unsplash (primary) / Pexels (fallback)
// image fetching with in-memory caching and static fallbacks.
// ============================================================

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_KEY   = import.meta.env.VITE_PEXELS_API_KEY;

// In-memory cache to prevent redundant API calls
const imageCache = new Map();

const hasUnsplash = () => UNSPLASH_KEY && UNSPLASH_KEY !== 'your_unsplash_access_key_here';
const hasPexels   = () => PEXELS_KEY   && PEXELS_KEY   !== 'your_pexels_api_key_here';

// ---- Static high-quality Unsplash fallback images (no API needed) ----
// Using Unsplash Source API which works without a key (lower resolution)
const FALLBACK_IMAGES = {
  kyoto:        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80',
  santorini:    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
  bali:         'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  'new-york':   'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
  dubai:        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  iceland:      'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=80',
  'machu-picchu':'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80',
  patagonia:    'https://images.unsplash.com/photo-1553701734-96e8f99afcba?w=1200&q=80',
  // Famous places fallbacks by id
  'fushimi-inari':  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
  'arashiyama':     'https://images.unsplash.com/photo-1527764324265-09aee2ab0e30?w=800&q=80',
  'kinkakuji':      'https://images.unsplash.com/photo-1589662074510-ee73d1cdb0b4?w=800&q=80',
  'gion':           'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  'oia-village':    'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80',
  'red-beach':      'https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=800&q=80',
  'akrotiri':       'https://images.unsplash.com/photo-1572113378786-ee5102b5e08c?w=800&q=80',
  'caldera-sailing':'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
  'sun-gate':       'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800&q=80',
  'huayna-picchu':  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
  'temple-sun':     'https://images.unsplash.com/photo-1490718720478-364a07a997cd?w=800&q=80',
  'aguas-calientes':'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&q=80',
  'tegalalang':     'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'uluwatu-temple': 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
  'ubud':           'https://images.unsplash.com/photo-1592364395653-83e648b20cc2?w=800&q=80',
  'seminyak-beach': 'https://images.unsplash.com/photo-1567899582486-22a9c1e4e267?w=800&q=80',
  'central-park':   'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&q=80',
  'brooklyn-bridge':'https://images.unsplash.com/photo-1485871800255-5d8efcde1b7c?w=800&q=80',
  'met-museum':     'https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=800&q=80',
  'times-square':   'https://images.unsplash.com/photo-1485871800255-5d8efcde1b7c?w=800&q=80',
  'burj-khalifa':   'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
  'dubai-creek':    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80',
  'desert-safari':  'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80',
  'palm-jumeirah':  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80',
  'golden-circle':  'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
  'blue-lagoon':    'https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?w=800&q=80',
  'jokulsarlon':    'https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?w=800&q=80',
  'skogafoss':      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'torres-del-paine':'https://images.unsplash.com/photo-1553701734-96e8f99afcba?w=800&q=80',
  'perito-moreno':  'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
  'fitz-roy':       'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
  'tierra-del-fuego':'https://images.unsplash.com/photo-1476370648495-3533f64427a2?w=800&q=80',
  default:          'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80',
};

// ---- Fetch from Unsplash ----
const fetchFromUnsplash = async (query, count = 1, orientation = 'landscape') => {
  const cacheKey = `unsplash:${query}:${count}:${orientation}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=${orientation}`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );

  if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
  const data = await res.json();

  const results = data.results.map(photo => ({
    id:        photo.id,
    url:       photo.urls.regular,
    fullUrl:   photo.urls.full,
    thumbUrl:  photo.urls.small,
    alt:       photo.alt_description || query,
    credit:    photo.user.name,
    creditUrl: photo.user.links.html,
  }));

  imageCache.set(cacheKey, results);
  return results;
};

// ---- Fetch from Pexels ----
const fetchFromPexels = async (query, count = 1) => {
  const cacheKey = `pexels:${query}:${count}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    { headers: { Authorization: PEXELS_KEY } }
  );

  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
  const data = await res.json();

  const results = data.photos.map(photo => ({
    id:        photo.id,
    url:       photo.src.large,
    fullUrl:   photo.src.original,
    thumbUrl:  photo.src.small,
    alt:       photo.alt || query,
    credit:    photo.photographer,
    creditUrl: photo.photographer_url,
  }));

  imageCache.set(cacheKey, results);
  return results;
};

// ---- Main public API ----

/**
 * Fetch a single image for a destination or place.
 * Falls back gracefully through: Unsplash → Pexels → Static fallback.
 */
export const fetchDestinationImage = async (query, id = null) => {
  try {
    if (hasUnsplash()) {
      const imgs = await fetchFromUnsplash(query, 1);
      if (imgs.length > 0) return imgs[0];
    }
    if (hasPexels()) {
      const imgs = await fetchFromPexels(query, 1);
      if (imgs.length > 0) return imgs[0];
    }
  } catch (err) {
    console.warn('Image API error:', err.message);
  }

  // Static fallback
  const fallbackUrl = (id && FALLBACK_IMAGES[id]) || FALLBACK_IMAGES.default;
  return { id, url: fallbackUrl, fullUrl: fallbackUrl, thumbUrl: fallbackUrl, alt: query, credit: 'Unsplash', creditUrl: 'https://unsplash.com' };
};

/**
 * Fetch multiple images for a gallery or grid.
 */
export const fetchImages = async (query, count = 6) => {
  try {
    if (hasUnsplash()) {
      const imgs = await fetchFromUnsplash(query, count);
      if (imgs.length > 0) return imgs;
    }
    if (hasPexels()) {
      const imgs = await fetchFromPexels(query, count);
      if (imgs.length > 0) return imgs;
    }
  } catch (err) {
    console.warn('Image API error:', err.message);
  }

  // Return static fallback array
  const fallbackUrl = FALLBACK_IMAGES[query] || FALLBACK_IMAGES.default;
  return Array(count).fill(null).map((_, i) => ({
    id:       `fallback-${i}`,
    url:      fallbackUrl,
    fullUrl:  fallbackUrl,
    thumbUrl: fallbackUrl,
    alt:      query,
    credit:   'Unsplash',
    creditUrl:'https://unsplash.com',
  }));
};

/**
 * Get a static fallback image by destination or place ID (instant, no network).
 */
export const getStaticImage = (id) => {
  const url = FALLBACK_IMAGES[id] || FALLBACK_IMAGES.default;
  return { id, url, fullUrl: url, thumbUrl: url, alt: id, credit: 'Unsplash', creditUrl: 'https://unsplash.com' };
};
