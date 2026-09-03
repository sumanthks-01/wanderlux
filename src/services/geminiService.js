// ============================================================
// geminiService.js — Google Gemini AI integration for:
//   1. Structured Itinerary Generator (strict JSON output)
//   2. AI Travel Assistant (conversational chat)
// Robustly handles Vercel deployments, API keys, and fallbacks.
// ============================================================

import { GoogleGenAI } from '@google/genai';

// Dynamically read key so updates to .env or Vercel environment variables work
const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || '';
  return key.trim();
};

const hasApiKey = () => {
  const key = getApiKey();
  return key !== '' && key !== 'your_gemini_api_key_here';
};

// Valid production Google Gemini REST models in priority order
const PREFERRED_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-lite',
];

// Helper to call Gemini REST API
const callGeminiRestAPI = async (prompt) => {
  const key = getApiKey();
  if (!key) throw new Error('No API key');

  for (const model of PREFERRED_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch {
      // try next model
    }
  }
  throw new Error('Gemini API call failed across all endpoints');
};

// ===========================================================
// SMART DYNAMIC FALLBACK CHAT ENGINE (FOR VERCEL DEMO & NO-KEY RUNS)
// ===========================================================

const generateSmartTravelResponse = (userPrompt) => {
  const query = userPrompt.toLowerCase();

  // Mysore / Bengaluru / Karnataka
  if (query.includes('mysore') || query.includes('mysuru')) {
    return `### 🏰 Mysore Travel Highlights & Tips

Mysore (Mysuru) is Karnataka's cultural capital, famous for its royal heritage and grand architecture!

**Must-Visit Spots:**
- **Mysore Palace**: Visit around 7:00 PM on Sundays or national holidays to witness 100,000 golden bulbs illuminating the royal palace.
- **Chamundi Hill & Chamundeshwari Temple**: Enjoy panoramic views of the entire city from 1,000 meters above sea level.
- **Devaraja Market**: A vibrant traditional market brimming with sandalwood, fresh flowers, and aromatic spices.
- **KRS Dam & Brindavan Gardens**: Famous for its evening musical fountain water show.

**Local Food Tip:**
Don't leave without tasting authentic **Mysore Pak** from Guru Sweets (the birthplace of the sweet) and crisp **Mysore Masala Dosa** at Mylari Hotel!`;
  }

  if (query.includes('bengaluru') || query.includes('bangalore')) {
    return `### 🌳 Bengaluru City Guide

Known as the Garden City and Silicon Valley of India, Bengaluru offers a pleasant climate, historic parks, and a thriving craft beer culture!

**Top Highlights:**
- **Vidhana Soudha & Cubbon Park**: Walk through 300 acres of lush greenery surrounding the majestic Neo-Dravidian state parliament.
- **Bengaluru Palace**: Modeled after England's Windsor Castle, featuring Tudor-style arches and royal memorabilia.
- **Lalbagh Botanical Garden**: Home to a 150-year-old glasshouse and rare tropical flora.
- **Indiranagar & Koramangala**: Explore trendy cafes, microbreweries, and boutique shopping.

**Pro Tip:** Early mornings are perfect for filter coffee and South Indian breakfast at MTR or Vidyarthi Bhavan!`;
  }

  // Kyoto / Japan
  if (query.includes('kyoto') || query.includes('japan')) {
    return `### ⛩️ Kyoto & Japan Travel Guide

Kyoto is the cultural heart of Japan, home to over 1,600 Buddhist temples and iconic bamboo groves.

**3-Day Itinerary Outline:**
- **Day 1**: Arrive early at **Fushimi Inari Shrine** to hike through thousands of vermilion torii gates. Explore Gion in the evening.
- **Day 2**: Walk through **Arashiyama Bamboo Grove**, visit Tenryu-ji Temple, and feed macaques at Iwatayama Monkey Park.
- **Day 3**: Marvel at **Kinkaku-ji (Golden Pavilion)** and admire Zen rock gardens at Ryoan-ji.

**Best Season:** March–April for Cherry Blossoms or November for fiery red autumn foliage!`;
  }

  // Pack / Packing
  if (query.includes('pack') || query.includes('packing')) {
    return `### 🎒 Essential Packing Checklist

Here is your smart packing list for a smooth adventure:

**Core Essentials:**
- **Footwear**: Comfortable walking shoes (expect 8–12 km per day).
- **Tech**: Universal travel power adapter, high-capacity power bank, and noise-canceling headphones.
- **Clothing**: Breathable layers, lightweight rain jacket, and modest attire for visiting temples/sacred sites.
- **Health & Sun**: SPF 50+ sunscreen, refillable water bottle, basic first aid kit, and personal medications.

**Pro Tip:** Roll your clothes instead of folding to save 30% more luggage space and prevent wrinkles!`;
  }

  // Budget / Cost
  if (query.includes('budget') || query.includes('cost') || query.includes('cheap') || query.includes('money')) {
    return `### 💡 Smart Travel Budgeting Tips

Here is how to maximize your travel budget without compromising comfort:

1. **Accommodation**: Book boutique guesthouses or highly rated hostels 4–6 weeks in advance.
2. **Transportation**: Use local metro, buses, or day-passes instead of private taxis.
3. **Dining**: Eat where locals eat! Street food markets and lunch specials offer authentic flavors at a fraction of tourist restaurant prices.
4. **Attractions**: Look for city travel passes or free museum admission days.

Would you like a estimated daily breakdown for a specific destination?`;
  }

  // Food / Culinary
  if (query.includes('food') || query.includes('eat') || query.includes('cuisine') || query.includes('restaurant')) {
    return `### 🍽️ Culinary Exploration Guide

Food is the soul of travel! Here is how to discover authentic local flavors:

- **Follow the Crowds**: High turnover at local food stalls means fresh ingredients and safe, delicious meals.
- **Take a Local Food Walking Tour**: A guided evening food walk is the fastest way to learn local culinary etiquette and hidden gems.
- **Visit Morning Produce Markets**: Great for fresh seasonal fruits, local cheeses, and street breakfasts.

What destination's food scene are you curious about?`;
  }

  // General Travel Assistance
  return `### ✈️ WanderLux AI Travel Concierge

I'm ready to help you plan your next dream getaway! Here are a few things I can assist you with:

- 🗓️ **Custom Day-by-Day Itineraries** for any city or country.
- 🧳 **Tailored Packing Lists** based on weather and activities.
- 💰 **Budget & Cost Estimates** for luxury, mid-range, or backpacking.
- 🏛️ **Must-See Sights & Hidden Gems** away from tourist crowds.

Tell me where you are planning to travel or ask any specific travel question!`;
};

// ===========================================================
// 1. STRUCTURED ITINERARY GENERATOR
// ===========================================================

const generateMockItinerary = ({ destination, days, travelStyle, budget }) => {
  const style = travelStyle || 'Cultural Explorer';
  const numDays = parseInt(days) || 3;

  const themes = [
    'Arrival & Iconic Sights',
    'Cultural Immersion & Heritage',
    'Scenic Nature & Hidden Gems',
    'Local Markets & Flavors',
    'Relaxation & Scenic Panoramas',
  ];

  const daysArr = Array.from({ length: numDays }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1}: ${themes[i % themes.length]}`,
    theme: themes[i % themes.length],
    activities: [
      {
        time: '08:00',
        activity: 'Morning Exploration & Local Breakfast',
        description: `Start your day early to explore ${destination}'s prime historic area before the crowds arrive. Enjoy regional breakfast specialties.`,
        duration: '2 hours',
        type: 'Sightseeing',
        estimatedCost: '$10–15',
        tips: 'Arrive early for the best lighting and peaceful photo ops.',
      },
      {
        time: '10:30',
        activity: `${destination} Landmark Guided Walk`,
        description: `Visit the top-rated architectural & cultural highlights around ${destination}.`,
        duration: '2.5 hours',
        type: 'Cultural',
        estimatedCost: '$20–30',
        tips: 'Wear comfortable walking shoes.',
      },
      {
        time: '14:00',
        activity: 'Afternoon Discovery & Culinary Tasting',
        description: `Sample traditional dishes and explore artisan shops in the old city quarter of ${destination}.`,
        duration: '3 hours',
        type: 'Food & Drink',
        estimatedCost: '$25–40',
        tips: 'Ask locals for authentic dish recommendations.',
      },
      {
        time: '18:30',
        activity: 'Sunset Viewpoint & Evening Stroll',
        description: `Watch the sunset over ${destination} from a scenic vantage point, followed by a relaxed evening walk.`,
        duration: '1.5 hours',
        type: 'Leisure',
        estimatedCost: 'Free',
        tips: 'Have your camera ready 15 minutes before sunset.',
      },
    ],
  }));

  return {
    destination,
    totalDays: numDays,
    travelStyle: style,
    summary: `A curated ${numDays}-day immersive itinerary in ${destination}, balancing iconic landmarks, local food, and memorable cultural experiences.`,
    highlights: [
      `Iconic landmarks of ${destination}`,
      'Authentic regional food tasting',
      'Scenic sunset vantage points',
      'Local artisan markets',
    ],
    days: daysArr,
    packingTips: [
      'Comfortable walking shoes (8–12km/day)',
      'Weather-appropriate clothing layers',
      'Universal power adapter & power bank',
      'Reusable water bottle',
    ],
    budgetEstimate: {
      budget:   `$${Math.round(45 * numDays)}–$${Math.round(70 * numDays)} total`,
      midRange: `$${Math.round(90 * numDays)}–$${Math.round(140 * numDays)} total`,
      luxury:   `$${Math.round(220 * numDays)}–$${Math.round(350 * numDays)} total`,
    },
  };
};

export const generateItinerary = async ({ destination, days, travelStyle, budget, interests }) => {
  if (!hasApiKey()) {
    await new Promise(r => setTimeout(r, 1200));
    return generateMockItinerary({ destination, days, travelStyle, budget });
  }

  const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}.
Travel style: ${travelStyle || 'Balanced'}
Budget level: ${budget || 'Mid-range'}
Interests: ${interests || 'Culture, Food, Sightseeing'}

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "destination": "${destination}",
  "totalDays": ${days},
  "travelStyle": "${travelStyle || 'Balanced'}",
  "summary": "A compelling 2-3 sentence overview",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4"],
  "days": [
    {
      "day": 1,
      "title": "Day 1: Theme Name",
      "theme": "Theme Name",
      "activities": [
        {
          "time": "08:00",
          "activity": "Activity Name",
          "description": "Detailed description",
          "duration": "X hours",
          "type": "Sightseeing|Food & Drink|Cultural|Adventure|Leisure",
          "estimatedCost": "$X–Y",
          "tips": "Pro tip"
        }
      ]
    }
  ],
  "packingTips": ["tip1", "tip2", "tip3"],
  "budgetEstimate": {
    "budget": "$X–Y total",
    "midRange": "$X–Y total",
    "luxury": "$X–Y total"
  }
}`;

  try {
    const text = await callGeminiRestAPI(prompt);
    const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Gemini itinerary API error, falling back:', err.message);
    return generateMockItinerary({ destination, days, travelStyle, budget });
  }
};

// ===========================================================
// 2. AI TRAVEL ASSISTANT (Chatbot)
// ===========================================================

export const askTravelAssistant = async (message, chatHistory = []) => {
  // If no API key is present on Vercel deployment, use the Smart Dynamic AI Travel Engine
  if (!hasApiKey()) {
    await new Promise(r => setTimeout(r, 800)); // natural typing delay
    return generateSmartTravelResponse(message);
  }

  try {
    const systemContext = `You are WanderLux AI, an expert travel assistant and concierge. 
Provide concise, rich, and practical travel advice for the user's specific request. Use markdown bolding and bullet points when appropriate.`;

    const historyText = chatHistory
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${systemContext}\n\n${historyText ? `Previous conversation:\n${historyText}\n\n` : ''}User: ${message}\n\nAssistant:`;

    const text = await callGeminiRestAPI(fullPrompt);
    return text;
  } catch (err) {
    console.warn('Gemini API call failed, using smart concierge fallback:', err.message);
    return generateSmartTravelResponse(message);
  }
};
