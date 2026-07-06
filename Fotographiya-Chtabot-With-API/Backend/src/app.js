// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ========================================
// 4 PROVIDERS CONFIGURATION
// ========================================

const providers = [
  {
    name: 'Groq',
    key: process.env.GROQ_API_KEY,
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    type: 'openai'
  },
  {
    name: 'Gemini',
    key: process.env.GEMINI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    type: 'gemini'
  },
  {
    name: 'Mistral',
    key: process.env.MISTRAL_API_KEY,
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
    type: 'openai'
  },
  {
    name: 'Cerebras',
    key: process.env.CEREBRAS_API_KEY,
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    model: 'llama-3.3-70b',
    type: 'openai'
  }
];

const validProviders = providers.filter(p => {
  return p.key && p.key.length > 10 && 
         !p.key.includes('YOUR_') && 
         !p.key.includes('your_') &&
         !p.key.includes('AIzaSyxxxxxxxx') &&
         !p.key.includes('xxxxxxxxxxxx');
});

let currentProviderIndex = 0;
let failureCount = {};
validProviders.forEach((_, i) => { failureCount[i] = 0; });

console.log('========================================');
console.log('🚀 AI Service with 4 Providers Failover');
console.log(`📊 Total Providers: ${validProviders.length}`);
validProviders.forEach((p, i) => {
  console.log(`   ${i+1}. ${p.name} - ✅ Key Set`);
});
console.log('========================================');

// ========================================
// SYSTEM PROMPT
// ========================================

const SYSTEM_PROMPT = `You are Fotographiya's official AI photography assistant.

COMPANY INFO:
Name: Fotographiya
Location: Kota, Rajasthan, India
Website: https://www.fotographiya.com
Phone: +91 9001110144
Email: fotographiyaworld@gmail.com
WhatsApp: https://api.whatsapp.com/send/?phone=9001110144&text=Hi+Fotographiya%2C+I+want+to+enquire+about+your+photography+packages.&type=phone_number&app_absent=0

FOUNDER: Mohit Barthunia
EXPERIENCE: 15+ Years
CUSTOMERS: 53K+ Happy Customers
SATISFACTION: 98.29%

SERVICES:
- Wedding Photography
- Pre-Wedding Photography
- Destination Wedding
- Anniversary Photography
- Corporate Photography
- AI GoldenBox
- Custom Luxury Albums
- Same Day Reels
- QR Services

AWARDS:
- Featured in Nakshatra (2023)
- Featured in Dainik Angad (2023)
- Recognized in Jeeto Marathon (2024)

SOCIAL MEDIA:
Instagram: https://www.instagram.com/fotographiya_official/
Facebook: https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/
YouTube: https://www.youtube.com/@Fotographiya_official
LinkedIn: https://www.linkedin.com/company/fotographiya-the-wedding-photography/
Reddit: https://www.reddit.com/user/Foreign-Barracuda340/
Medium: https://medium.com/@fotographiyaworld

RULES:
1. ONLY answer about Fotographiya
2. Be professional, friendly, and helpful
3. End with: "What would you like to know about Fotographiya?"
4. Use clickable links: [Text](URL)
5. If someone asks about "best photographer", say Fotographiya is one of India's best`;

// ========================================
// SCRAPED DATA
// ========================================

const LINKS = {
  website: {
    home: 'https://www.fotographiya.com/',
    about: 'https://www.fotographiya.com/about',
    services: 'https://www.fotographiya.com/services',
    wedding: 'https://www.fotographiya.com/services/wedding-photography',
    prewedding: 'https://www.fotographiya.com/services/prewedding-photography',
    destination: 'https://www.fotographiya.com/services/destination-wedding',
    anniversary: 'https://www.fotographiya.com/services/anniversary-photography',
    corporate: 'https://www.fotographiya.com/services/corporate-photography',
    academy: 'https://www.fotographiya.com/fotographiya-academy',
    portfolio: 'https://www.fotographiya.com/portfolio',
    contact: 'https://www.fotographiya.com/contact'
  },
  social: {
    instagram: 'https://www.instagram.com/fotographiya_official/',
    linkedin: 'https://www.linkedin.com/company/fotographiya-the-wedding-photography/',
    facebook: 'https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/',
    youtube: 'https://www.youtube.com/@Fotographiya_official',
    pexels: 'https://www.pexels.com/@fotographiya-wedding-photography-823737813/',
    reddit: 'https://www.reddit.com/user/Foreign-Barracuda340/',
    medium: 'https://medium.com/@fotographiyaworld'
  },
  contact: {
    whatsapp: 'https://api.whatsapp.com/send/?phone=9001110144&text=Hi+Fotographiya%2C+I+want+to+enquire+about+your+photography+packages.&type=phone_number&app_absent=0',
    phone: '+91 9001110144',
    email: 'fotographiyaworld@gmail.com'
  }
};

let scrapedData = {};

// ========================================
// CALL PROVIDER FUNCTION
// ========================================

async function callProvider(index, userMessage) {
  const provider = validProviders[index];
  if (!provider) return null;

  try {
    console.log(`🟢 Trying ${provider.name}...`);

    if (provider.type === 'gemini') {
      const url = `${provider.endpoint}?key=${provider.key}`;
      const response = await axios.post(
        url,
        { contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}` }] }] },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      );
      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (content) {
        console.log(`✅ ${provider.name} Success!`);
        return content + '\n\nWhat would you like to know about Fotographiya?';
      }
      return null;
    }

    const response = await axios.post(
      provider.endpoint,
      {
        model: provider.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: { 'Authorization': `Bearer ${provider.key}`, 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '';
    if (content) {
      console.log(`✅ ${provider.name} Success!`);
      return content + '\n\nWhat would you like to know about Fotographiya?';
    }
    return null;
  } catch (error) {
    console.log(`❌ ${provider.name} Failed: ${error.response?.status || error.message}`);
    failureCount[index] = (failureCount[index] || 0) + 1;
    return null;
  }
}

// ========================================
// GET NEXT PROVIDER
// ========================================

function getNextProvider(currentIndex) {
  const total = validProviders.length;
  if (total === 0) return -1;
  let attempts = 0;
  let nextIndex = (currentIndex + 1) % total;
  while (attempts < total) {
    if (failureCount[nextIndex] < 3) return nextIndex;
    nextIndex = (nextIndex + 1) % total;
    attempts++;
  }
  validProviders.forEach((_, i) => { failureCount[i] = 0; });
  return 0;
}

// ========================================
// GENERATE RESPONSE
// ========================================

async function generateResponse(userMessage) {
  if (validProviders.length === 0) {
    return { success: false, content: 'No API providers configured.', provider: 'None' };
  }

  let attempts = 0;
  const maxAttempts = validProviders.length * 2;

  while (attempts < maxAttempts) {
    const providerIndex = currentProviderIndex;

    if (failureCount[providerIndex] >= 3) {
      console.log(`⏭️ Skipping ${validProviders[providerIndex].name}`);
      currentProviderIndex = getNextProvider(providerIndex);
      attempts++;
      continue;
    }

    const result = await callProvider(providerIndex, userMessage);

    if (result) {
      failureCount[providerIndex] = 0;
      currentProviderIndex = providerIndex;
      return { success: true, content: result, provider: validProviders[providerIndex].name };
    }

    currentProviderIndex = getNextProvider(providerIndex);
    attempts++;
    await new Promise(r => setTimeout(r, 500));
  }

  return { success: false, content: 'Unable to process request.', provider: 'None' };
}

// ========================================
// API ROUTES
// ========================================

// ===== HEALTH =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok', providers: validProviders.length });
});

// ===== STATUS =====
app.get('/api/status', (req, res) => {
  res.json({
    totalProviders: validProviders.length,
    currentProvider: currentProviderIndex + 1,
    providers: validProviders.map((p, i) => ({
      name: p.name,
      hasKey: !!p.key,
      failures: failureCount[i] || 0,
      active: i === currentProviderIndex
    }))
  });
});

// ===== CHAT =====
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    console.log(`📝 User asked: "${message}"`);

    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'];
    if (greetings.some(g => message.toLowerCase().includes(g)) && message.length < 20) {
      return res.json({
        success: true,
        data: {
          message: 'Hello! I am Fotographiya Assistant. How can I help you today?\n\nWhat would you like to know about Fotographiya?',
          sessionId: sessionId || 'session_' + Date.now(),
          timestamp: new Date(),
          provider: 'greeting'
        }
      });
    }

    const result = await generateResponse(message);

    if (result.success) {
      console.log(`🤖 AI responded using: ${result.provider}`);
      res.json({
        success: true,
        data: {
          message: result.content,
          sessionId: sessionId || 'session_' + Date.now(),
          timestamp: new Date(),
          provider: result.provider
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          message: `I can help with questions about Fotographiya!\n\n• Wedding Photography\n• Pre-Wedding Photography\n• Destination Wedding\n• Anniversary Photography\n• Corporate Photography\n\n[Visit Website](https://www.fotographiya.com)\n\nWhat would you like to know about Fotographiya?`,
          sessionId: sessionId || 'session_' + Date.now(),
          timestamp: new Date(),
          provider: 'fallback'
        }
      });
    }
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process message' });
  }
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Active Providers: ${validProviders.length}`);
  if (validProviders.length > 0) {
    console.log(`📍 Current Provider: ${validProviders[currentProviderIndex].name}`);
  }
});