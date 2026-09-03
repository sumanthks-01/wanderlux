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

// Valid production Google Gemini models in priority order
const PREFERRED_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-lite',
];

/**
 * Universal Gemini API Caller
 * Tries Official SDK first, then REST API with multiple auth header formats
 * (x-goog-api-key, Authorization Bearer, and URL query key).
 */
const callGeminiRestAPI = async (prompt) => {
  const key = getApiKey();
  if (!key) throw new Error('No API key configured');

  // Strategy 1: Official @google/genai SDK
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    for (const modelName of ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash']) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        if (response && response.text) {
          console.log(`[Gemini SDK] Success using model: ${modelName}`);
          return response.text;
        }
      } catch (sdkErr) {
        console.warn(`[Gemini SDK] Model ${modelName} failed:`, sdkErr.message);
      }
    }
  } catch (sdkInitErr) {
    console.warn('[Gemini SDK] Init failed, falling back to REST:', sdkInitErr.message);
  }

  // Strategy 2: Direct REST API with flexible headers
  for (const model of PREFERRED_MODELS) {
    // Try URL key, x-goog-api-key header, and Bearer token headers
    const attempts = [
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
        headers: { 'Content-Type': 'application/json' },
      },
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
      },
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'x-goog-api-key': key,
        },
      },
    ];

    for (const attempt of attempts) {
      try {
        const res = await fetch(attempt.url, {
          method: 'POST',
          headers: attempt.headers,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`[Gemini REST] Success using model ${model}`);
            return text;
          }
        } else {
          const errBody = await res.text();
          console.warn(`[Gemini REST] Model ${model} returned ${res.status}:`, errBody);
        }
      } catch (fetchErr) {
        console.warn(`[Gemini REST] Fetch error for ${model}:`, fetchErr.message);
      }
    }
  }

  throw new Error('All Gemini API connection strategies failed');
};

// ===========================================================
// SMART DYNAMIC FALLBACK CHAT ENGINE (FOR VERCEL & ZERO-KEY RUNS)
// ===========================================================

const generateSmartTravelResponse = (userPrompt) => {
  const query = userPrompt.toLowerCase();

  // Delhi
  if (query.includes('delhi')) {
    return `### 🕌 3-Day Delhi Heritage & Culture Itinerary

Delhi is a grand city where centuries of Mughal empire history meets vibrant modern urban life!

**Day 1: Old Delhi Heritage & Street Food**
- **Morning**: Explore the colossal **Red Fort (Lal Qila)** and Jama Masjid, India's largest mosque.
- **Afternoon**: Take a rickshaw ride through the chaotic, colorful lanes of **Chandni Chowk** and savor legendary paranthas & jalebis.
- **Evening**: Visit Raj Ghat memorial along the Yamuna riverfront.

**Day 2: Imperial Monuments & Gardens**
- **Morning**: Tour **Humayun’s Tomb** — the red sandstone inspiration for the Taj Mahal.
- **Afternoon**: Walk through the serene lush lawns of **Lodhi Garden** and marvel at the 73-meter **Qutub Minar** tower.
- **Evening**: Experience the illuminated **Lotus Temple** (Bahá'í House of Worship).

**Day 3: Capital Landmarks & Bazaars**
- **Morning**: Stroll past **India Gate** and the majestic **Rashtrapati Bhavan** (Presidential Residence).
- **Afternoon**: Shop and dine in colonial **Connaught Place** and explore **Dilli Haat** craft village.
- **Evening**: Visit the colossal **Swaminarayan Akshardham Temple** for the evening musical water show.

**Local Food Tip:** Try legendary butter chicken at Moti Mahal (Daryaganj) and chole bhature at Sitaram Diwan Chand!`;
  }

  // Maldives
  if (query.includes('maldives')) {
    return `### 🏝️ Maldives Island Escape Guide

The Maldives is an archipelago of over 1,000 coral islands famous for turquoise lagoons and overwater bungalows!

**3-Day Tropical Itinerary:**
- **Day 1**: Arrive at your overwater villa via seaplane. Unwind with a sunset lagoon cruise and fresh seafood dinner on the beach.
- **Day 2**: Embark on a house reef snorkeling safari to swim with sea turtles, manta rays, and harmless reef sharks.
- **Day 3**: Experience a private sandbank picnic, ocean kayaking, and an evening underwater spa treatment.

**Travel Tip:** Best months are November to April (Dry Season with clear blue skies)!`;
  }

  // Mysore / Mysuru
  if (query.includes('mysore') || query.includes('mysuru')) {
    return `### 🏰 Mysore Royal Heritage Guide

Mysore is Karnataka's cultural capital, famous for royal palaces and grand architecture!

**Highlights:**
- **Mysore Palace**: Visit around 7:00 PM on Sundays to witness 100,000 golden bulbs illuminating the palace.
- **Chamundi Hill**: Enjoy panoramic views of the city from 1,000 meters above sea level.
- **Devaraja Market**: A vibrant market brimming with sandalwood, fresh flowers, and spices.

**Local Food Tip:** Taste authentic **Mysore Pak** at Guru Sweets and crisp **Mysore Masala Dosa** at Mylari Hotel!`;
  }

  // Bengaluru / Bangalore
  if (query.includes('bengaluru') || query.includes('bangalore')) {
    return `### 🌳 Bengaluru City Guide

Known as the Garden City of India, Bengaluru offers a pleasant climate, historic parks, and a thriving craft brewery culture!

**Top Highlights:**
- **Vidhana Soudha & Cubbon Park**: Walk through 300 acres of green parkland surrounding the state parliament.
- **Bengaluru Palace**: Modeled after Windsor Castle, featuring Tudor-style arches and royal memorabilia.
- **Indiranagar & Koramangala**: Explore trendy cafes, microbreweries, and boutique shopping.

**Pro Tip:** Start early mornings with filter coffee and crispy masala dosa at MTR or Vidyarthi Bhavan!`;
  }

  // Goa
  if (query.includes('goa')) {
    return `### 🏖️ 3-Day Goa Coastal Itinerary

**Day 1: North Goa Beaches & Sunset Shacks**
- Explore Calangute, Baga, and Anjuna beaches. Catch the sunset at Curlies or Thalassa.

**Day 2: Latin Quarter & Portuguese Heritage**
- Walk through the colorful pastel streets of Fontainhas in Panjim, visit Old Goa’s Basilica of Bom Jesus, and tour a spice plantation.

**Day 3: South Goa Tranquility & Boat Cruise**
- Unwind on pristine Palolem or Agonda beach, followed by an Arabian Sea sunset cruise.`;
  }

  // Kyoto / Japan
  if (query.includes('kyoto') || query.includes('japan')) {
    return `### ⛩️ Kyoto & Japan Travel Guide

Kyoto is the cultural heart of Japan, home to over 1,600 Buddhist temples and iconic bamboo groves.

**3-Day Itinerary Outline:**
- **Day 1**: Hike through thousands of vermilion torii gates at **Fushimi Inari Shrine**. Explore Gion in the evening.
- **Day 2**: Walk through **Arashiyama Bamboo Grove** and visit Tenryu-ji Temple.
- **Day 3**: Marvel at **Kinkaku-ji (Golden Pavilion)** and Ryoan-ji rock garden.`;
  }

  // Packing
  if (query.includes('pack') || query.includes('packing')) {
    return `### 🎒 Essential Packing Checklist

- **Footwear**: Comfortable walking shoes (expect 8–12 km per day).
- **Tech**: Universal travel power adapter, high-capacity power bank, and noise-canceling headphones.
- **Clothing**: Breathable layers, lightweight rain jacket, and modest attire for visiting temples/sacred sites.
- **Health & Sun**: SPF 50+ sunscreen, refillable water bottle, and basic first aid kit.`;
  }

  // Budget
  if (query.includes('budget') || query.includes('cost') || query.includes('cheap') || query.includes('money')) {
    return `### 💡 Smart Travel Budgeting Tips

1. **Accommodation**: Book boutique guesthouses 4–6 weeks in advance.
2. **Transportation**: Use metro or day-passes instead of private taxis.
3. **Dining**: Eat where locals eat! Food markets offer authentic flavors at a fraction of tourist prices.
4. **Attractions**: Look for city passes or free museum admission days.`;
  }

  // General Trip / Itinerary query parser for ANY destination specified by user!
  const destMatch = userPrompt.match(/(?:trip|itinerary|plan|to|visit|for)\s+([A-Za-z\s]+)/i);
  const cityName = destMatch ? destMatch[1].replace(/(?:in|the|a|for|trip|days|day)\s*/gi, '').trim() : '';

  if (cityName && cityName.length > 2) {
    const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    return `### ✈️ Customized Travel Guide for ${formattedCity}

Here is a curated outline tailored for your trip to **${formattedCity}**:

**Day 1: Arrival & Iconic Landmarks**
- **Morning**: Check in and explore ${formattedCity}'s central historical district.
- **Afternoon**: Guided walk through the most famous architectural monuments and city centers.
- **Evening**: Sunset viewing from a top-rated panorama viewpoint followed by dinner.

**Day 2: Culture, Food & Local Life**
- **Morning**: Visit traditional local markets, art galleries, or historic temples.
- **Afternoon**: Culinary food walk trying authentic local dishes and street food.
- **Evening**: Relax in the lively entertainment or riverfront/coastal district.

**Day 3: Scenic Nature & Hidden Gems**
- **Morning**: Excursion to scenic hills, botanical gardens, or nearby coastal highlights.
- **Afternoon**: Artisan souvenir shopping and tea/coffee break at a historic cafe.

**Travel Tip:** Book top tickets 2–3 weeks in advance for seamless entry!`;
  }

  // Default Concierge Welcome Response
  return `### ✈️ WanderLux AI Travel Concierge

I'm ready to help you plan your next dream getaway! Here are a few things I can assist you with:

- 🗓️ **Custom Day-by-Day Itineraries** for any city or country (e.g. *"3 days trip to Delhi"*, *"Goa guide"*).
- 🧳 **Tailored Packing Lists** based on weather and activities.
- 💰 **Budget & Cost Estimates** for luxury, mid-range, or backpacking.
- 🏛️ **Must-See Sights & Hidden Gems** away from tourist crowds.

Tell me where you are planning to travel or ask any specific travel question!`;
};

// ===========================================================
// 1. STRUCTURED ITINERARY GENERATOR
// ===========================================================

// Destination-specific Mock Data Generator for rich offline / no-key runs
const GET_SPECIFIC_ITINERARY_DATA = (destination, numDays) => {
  const dLower = (destination || '').toLowerCase();

  // Delhi Custom Itinerary Data
  if (dLower.includes('delhi')) {
    return {
      destination: 'Delhi',
      summary: 'An immersive journey through India’s imperial capital, spanning grand Mughal fortresses, vibrant Old Delhi bazaars, and tranquil garden monuments.',
      highlights: ['Red Fort & Jama Masjid', 'Chandni Chowk Street Food Walk', 'Humayun’s Tomb & Qutub Minar', 'India Gate & Swaminarayan Akshardham'],
      days: [
        {
          day: 1,
          title: 'Day 1: Old Delhi Heritage & Culinary Feast',
          theme: 'Old Delhi Heritage',
          activities: [
            { time: '08:30', activity: 'Red Fort (Lal Qila) Tour', description: 'Explore the 17th-century Mughal red sandstone fortress built by Emperor Shah Jahan.', duration: '2.5 hours', type: 'Cultural', estimatedCost: '₹500', tips: 'Hire a registered guide at the main Lahori Gate.' },
            { time: '11:30', activity: 'Jama Masjid & Chandni Chowk Walk', description: 'Visit India’s largest mosque and take a rickshaw ride through bustling spice and silk markets.', duration: '2 hours', type: 'Sightseeing', estimatedCost: '₹300', tips: 'Dress modestly when entering the mosque.' },
            { time: '14:00', activity: 'Old Delhi Food Walk', description: 'Savor famous dahi bhallas at Natraj and paranthas in Paranthe Wali Gali.', duration: '2 hours', type: 'Food & Drink', estimatedCost: '₹400', tips: 'Try fresh jalebis at Old Famous Jalebi Wala.' },
            { time: '17:30', activity: 'Raj Ghat & Yamuna Riverfront', description: 'Pay respects at Mahatma Gandhi’s peaceful black marble memorial garden.', duration: '1.5 hours', type: 'Leisure', estimatedCost: 'Free', tips: 'Remove shoes at the memorial gate.' },
          ]
        },
        {
          day: 2,
          title: 'Day 2: Mughal Architecture & Garden Monuments',
          theme: 'Mughal Architecture',
          activities: [
            { time: '09:00', activity: 'Humayun’s Tomb', description: 'Marvel at the UNESCO World Heritage red sandstone mausoleum surrounded by charbagh gardens.', duration: '2 hours', type: 'Cultural', estimatedCost: '₹600', tips: 'The morning sun illuminates the dome beautifully.' },
            { time: '11:30', activity: 'Lodhi Garden Stroll', description: 'Walk through 90 acres of lush green lawns dotted with 15th-century Sayyid & Lodhi tombs.', duration: '1.5 hours', type: 'Nature', estimatedCost: 'Free', tips: 'Great spot for nature photography.' },
            { time: '14:00', activity: 'Qutub Minar Complex', description: 'Discover the world’s tallest brick minaret (73m) and ancient 4th-century iron pillar.', duration: '2 hours', type: 'Sightseeing', estimatedCost: '₹600', tips: 'Look for intricate Arabic calligraphy carved in stone.' },
            { time: '17:30', activity: 'Lotus Temple Sunset', description: 'Admire the lotus-shaped Bahá’í House of Worship glowing in twilight.', duration: '1.5 hours', type: 'Sightseeing', estimatedCost: 'Free', tips: 'Maintain silence inside the central hall.' },
          ]
        },
        {
          day: 3,
          title: 'Day 3: Imperial Landmarks & Cultural Evening',
          theme: 'Capital Highlights',
          activities: [
            { time: '09:00', activity: 'India Gate & Kartavya Path', description: 'Stroll along the boulevard past the 42-meter war memorial arc.', duration: '1.5 hours', type: 'Sightseeing', estimatedCost: 'Free', tips: 'Early morning is best to avoid afternoon traffic.' },
            { time: '11:00', activity: 'Connaught Place & Janpath Bazaar', description: 'Explore Georgian-style circular arcades, bookshops, and handicraft stalls.', duration: '2.5 hours', type: 'Urban', estimatedCost: '₹1,000', tips: 'Bargain politely at Janpath market.' },
            { time: '15:00', activity: 'Dilli Haat Craft Village', description: 'Open-air food and craft bazaar representing artisans from all 28 states of India.', duration: '2.5 hours', type: 'Cultural', estimatedCost: '₹100 entry', tips: 'Try momos from the Nagaland food stall.' },
            { time: '18:30', activity: 'Akshardham Water Show', description: 'Witness the Sahaj Anand water, light, and laser show at Swaminarayan Akshardham.', duration: '2 hours', type: 'Cultural', estimatedCost: '₹120', tips: 'Mobile phones must be deposited in security lockers.' },
          ]
        }
      ]
    };
  }

  // Maldives Custom Itinerary Data
  if (dLower.includes('maldives')) {
    return {
      destination: 'Maldives',
      summary: 'A tropical paradise escape featuring pristine overwater villas, crystal turquoise lagoons, colorful coral reef diving, and serene ocean sunsets.',
      highlights: ['Overwater Bungalow Stay', 'Coral Reef Snorkeling Safari', 'Sunset Dolphin Cruise', 'Private Sandbank Picnic'],
      days: [
        {
          day: 1,
          title: 'Day 1: Arrival in Paradise & Lagoon Sunset',
          theme: 'Arrival & Ocean Views',
          activities: [
            { time: '10:00', activity: 'Seaplane Transfer & Villa Check-in', description: 'Enjoy a breathtaking aerial seaplane flight over turquoise atolls to your resort.', duration: '2 hours', type: 'Leisure', estimatedCost: 'Included', tips: 'Keep your camera ready for aerial atoll photos.' },
            { time: '14:00', activity: 'Overwater Villa Lagoon Swim', description: 'Step directly from your private deck into warm 28°C ocean waters.', duration: '2 hours', type: 'Beach', estimatedCost: 'Free', tips: 'Apply reef-safe SPF 50+ sunscreen.' },
            { time: '17:30', activity: 'Sunset Dhoni Cruise', description: 'Sail on a traditional Maldivian wooden dhoni boat with fresh fruit cocktails.', duration: '2 hours', type: 'Sightseeing', estimatedCost: '$75', tips: 'Look out for spinner dolphins near the boat.' },
          ]
        },
        {
          day: 2,
          title: 'Day 2: Coral Reef Safari & Marine Wonders',
          theme: 'Marine Adventure',
          activities: [
            { time: '09:00', activity: 'House Reef Snorkeling Tour', description: 'Guided underwater safari to see sea turtles, parrotfish, and vibrant coral formations.', duration: '2.5 hours', type: 'Adventure', estimatedCost: '$50', tips: 'Use flippers for effortless swimming in mild currents.' },
            { time: '13:00', activity: 'Beachfront Seafood Grill Lunch', description: 'Dine on fresh grilled red snapper and coconut curry right on the white sand.', duration: '1.5 hours', type: 'Food & Drink', estimatedCost: '$45', tips: 'Try fresh young coconut water.' },
            { time: '16:00', activity: 'Sunset Paddleboarding & Kayaking', description: 'Glide across calm mirror-like lagoons during golden hour.', duration: '2 hours', type: 'Leisure', estimatedCost: 'Free', tips: 'Transparent kayaks offer clear underwater views.' },
          ]
        },
        {
          day: 3,
          title: 'Day 3: Private Sandbank & Spa Pampering',
          theme: 'Relaxation & Wellness',
          activities: [
            { time: '09:30', activity: 'Private Sandbank Picnic', description: 'Boat ride to an uninhabited tiny sand island in the middle of the ocean.', duration: '3 hours', type: 'Beach', estimatedCost: '$120', tips: 'Bring your sunglasses and sun hat.' },
            { time: '15:00', activity: 'Overwater Spa Treatment', description: 'Balinese massage with essential oils while watching tropical fish through glass floor panels.', duration: '1.5 hours', type: 'Leisure', estimatedCost: '$150', tips: 'Book spa sessions early in your stay.' },
          ]
        }
      ]
    };
  }

  // Default Fallback
  return null;
};

const generateMockItinerary = ({ destination, days, travelStyle, budget }) => {
  const style = travelStyle || 'Cultural Explorer';
  const numDays = parseInt(days) || 3;

  // Check if we have specific rich mock data for famous destinations
  const specificData = GET_SPECIFIC_ITINERARY_DATA(destination, numDays);
  if (specificData) {
    return {
      ...specificData,
      totalDays: Math.min(numDays, specificData.days.length),
      travelStyle: style,
      packingTips: [
        'Comfortable walking shoes (8–12km/day)',
        'Breathable cotton layers & rain jacket',
        'Universal power adapter & power bank',
        'SPF 50+ sunscreen & sunglasses',
      ],
      budgetEstimate: {
        budget:   `$${Math.round(45 * numDays)}–$${Math.round(70 * numDays)} total`,
        midRange: `$${Math.round(90 * numDays)}–$${Math.round(140 * numDays)} total`,
        luxury:   `$${Math.round(220 * numDays)}–$${Math.round(350 * numDays)} total`,
      },
    };
  }

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
        time: '08:30',
        activity: `Morning Historic Walk in ${destination}`,
        description: `Explore ${destination}'s most celebrated historic district and architectural highlights before peak afternoon hours.`,
        duration: '2 hours',
        type: 'Sightseeing',
        estimatedCost: '$10–20',
        tips: 'Arrive early for quiet photos and cool morning weather.',
      },
      {
        time: '11:00',
        activity: `${destination} Landmark & Museum Tour`,
        description: `Guided walk through key heritage monuments and cultural exhibits around ${destination}.`,
        duration: '2.5 hours',
        type: 'Cultural',
        estimatedCost: '$20–35',
        tips: 'Wear comfortable walking shoes.',
      },
      {
        time: '14:00',
        activity: 'Local Market & Street Food Tasting',
        description: `Sample authentic regional culinary specialties and explore artisan bazaars in ${destination}.`,
        duration: '3 hours',
        type: 'Food & Drink',
        estimatedCost: '$25–45',
        tips: 'Ask locals for top recommended eateries.',
      },
      {
        time: '18:30',
        activity: 'Sunset Panorama & Evening Walk',
        description: `Watch the evening lights turn on across ${destination} from a elevated vantage point.`,
        duration: '1.5 hours',
        type: 'Leisure',
        estimatedCost: 'Free',
        tips: 'Have your camera ready for golden hour.',
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
  if (!hasApiKey()) {
    await new Promise(r => setTimeout(r, 700)); // typing delay
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
