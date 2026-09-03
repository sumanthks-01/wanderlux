// ============================================================
// geminiService.js — Google Gemini AI integration for:
//   1. Structured Itinerary Generator (strict JSON output)
//   2. AI Travel Assistant (conversational chat)
// Falls back to rich mock data when no API key is provided or valid.
// ============================================================

import { GoogleGenAI } from '@google/genai';

// Dynamically read key so updates to .env work without a hard rebuild
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || '';

const hasApiKey = () => {
  const key = getApiKey().trim();
  return key !== '' && key !== 'your_gemini_api_key_here';
};

// Fallback models in priority order
const PREFERRED_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];

const getClient = () => {
  const key = getApiKey().trim();
  if (!key || key === 'your_gemini_api_key_here') return null;
  return new GoogleGenAI({ apiKey: key });
};

// ===========================================================
// 1. STRUCTURED ITINERARY GENERATOR
// ===========================================================

const generateMockItinerary = ({ destination, days, travelStyle, budget }) => {
  const style = travelStyle || 'Cultural Explorer';
  const numDays = parseInt(days) || 3;

  const themes = [
    'Arrival & First Impressions',
    'Cultural Immersion',
    'Natural Wonders',
    'Hidden Gems & Local Life',
    'Adventure Day',
    'Culinary Journey',
    'Relaxation & Wellness',
  ];

  const daysArr = Array.from({ length: numDays }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1}: ${themes[i % themes.length]}`,
    theme: themes[i % themes.length],
    activities: [
      {
        time: '07:00',
        activity: 'Morning Sunrise Experience',
        description: `Start your day early to witness ${destination}'s breathtaking sunrise from a prime vantage point. The golden light transforms the landscape into something magical.`,
        duration: '1 hour',
        type: 'Sightseeing',
        estimatedCost: 'Free',
        tips: 'Arrive 20 minutes before sunrise for the best spot.',
      },
      {
        time: '09:00',
        activity: 'Local Breakfast & Coffee',
        description: `Explore a local café or market for an authentic breakfast in ${destination}. Try regional specialties and chat with locals.`,
        duration: '1.5 hours',
        type: 'Food & Drink',
        estimatedCost: '$10–20',
        tips: 'Ask for local recommendations.',
      },
      {
        time: '11:00',
        activity: `${destination} Heritage Walk`,
        description: `Join a walking tour of the most historically significant areas in ${destination}.`,
        duration: '2.5 hours',
        type: 'Cultural',
        estimatedCost: '$15–30',
        tips: 'Wear comfortable shoes.',
      },
      {
        time: '14:00',
        activity: 'Afternoon Exploration',
        description: `Explore markets, museums, or scenic spots around ${destination}.`,
        duration: '3 hours',
        type: style.includes('Adventure') ? 'Adventure' : 'Leisure',
        estimatedCost: '$20–50',
        tips: 'Follow your curiosity.',
      },
      {
        time: '18:00',
        activity: 'Sunset Viewing',
        description: `Position yourself for the best view of sunset in ${destination}.`,
        duration: '1 hour',
        type: 'Sightseeing',
        estimatedCost: 'Free',
        tips: 'Have your camera ready.',
      },
      {
        time: '20:00',
        activity: 'Dinner & Evening Atmosphere',
        description: `Experience the evening culinary scene in ${destination}.`,
        duration: '2 hours',
        type: 'Food & Drink',
        estimatedCost: '$30–80',
        tips: 'Reservations recommended.',
      },
    ],
  }));

  return {
    destination,
    totalDays: numDays,
    travelStyle: style,
    summary: `This carefully crafted ${numDays}-day ${style.toLowerCase()} itinerary for ${destination} balances iconic must-sees with authentic local experiences.`,
    highlights: [
      `Iconic landmarks of ${destination}`,
      'Authentic local cuisine and dining',
      'Cultural and heritage experiences',
      'Scenic viewpoints and photo spots',
      'Hidden gems known to locals',
    ],
    days: daysArr,
    packingTips: [
      'Comfortable walking shoes (8–12km/day)',
      'Versatile weather-appropriate clothing',
      'Universal power adapter',
      'Portable power bank',
      'Reusable water bottle',
    ],
    budgetEstimate: {
      budget:   `$${Math.round(50 * numDays)}–${Math.round(75 * numDays)} total`,
      midRange: `$${Math.round(100 * numDays)}–${Math.round(150 * numDays)} total`,
      luxury:   `$${Math.round(250 * numDays)}–${Math.round(400 * numDays)} total`,
    },
  };
};

/**
 * Helper to call Gemini REST API directly if SDK has model mismatch issues
 */
const callGeminiRestAPI = async (prompt) => {
  const key = getApiKey().trim();
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
  throw new Error('All Gemini model endpoints failed');
};

/**
 * Generate a structured day-by-day itinerary using Gemini AI.
 * Falls back to rich mock data if no API key is configured or API fails.
 */
export const generateItinerary = async ({ destination, days, travelStyle, budget, interests }) => {
  if (!hasApiKey()) {
    await new Promise(r => setTimeout(r, 1500));
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
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],
  "days": [
    {
      "day": 1,
      "title": "Day 1: Theme Name",
      "theme": "Theme Name",
      "activities": [
        {
          "time": "07:00",
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
}

Make activities specific to ${destination} with real place names. Include 5-6 activities per day from morning to evening.`;

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
// 2. AI TRAVEL ASSISTANT (Chat)
// ===========================================================

const SYSTEM_CONTEXT = `You are WanderLux AI, an expert travel assistant and destination concierge. 
You have deep knowledge of world destinations, local culture, travel logistics, and practical tips.
Be enthusiastic, helpful, and conversational. Give specific, actionable advice for the user's specific request.
Keep responses concise but rich (2-4 paragraphs max). Use bullet points when listing items.`;

const MOCK_RESPONSES = {
  default: [
    "That's a fantastic question! I'd recommend starting your exploration early in the morning to beat the crowds and catch the best light for photos. The local markets usually open around 7am and are a wonderful window into daily life. Would you like me to suggest a specific neighborhood to explore first?",
    "Great choice! This destination has so much to offer. I'd suggest mixing iconic landmarks with off-the-beaten-path discoveries — often the most memorable experiences happen when you wander away from the tourist trail. What kind of experiences matter most to you — history, food, nature, or adventure?",
  ],
};

/**
 * Send a message to the AI travel assistant.
 */
export const askTravelAssistant = async (message, chatHistory = []) => {
  if (!hasApiKey()) {
    await new Promise(r => setTimeout(r, 1000));
    return MOCK_RESPONSES.default[0];
  }

  try {
    const historyText = chatHistory
      .slice(-6) // Keep last 6 messages for context
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${SYSTEM_CONTEXT}\n\n${historyText ? `Previous conversation:\n${historyText}\n\n` : ''}User: ${message}\n\nAssistant:`;

    const text = await callGeminiRestAPI(fullPrompt);
    return text;
  } catch (err) {
    console.warn('Gemini chat API error, falling back:', err.message);
    return MOCK_RESPONSES.default[0];
  }
};
