// server.js - COMPLETE FIXED VERSION
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ========================================
// 4 PROVIDERS CONFIGURATION - FIXED
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
    model: 'gemini-2.5-flash',
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
    model: 'zai-glm-4.7',  // ✅ Fixed
    type: 'openai'
  }
];

// Filter valid providers
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
  console.log(`   ${i+1}. ${p.name} - ✅ Key Set (${p.model})`);
});
console.log('========================================');

// ========================================
// SYSTEM PROMPT - FIXED FOR ALL PROVIDERS
// ========================================

const SYSTEM_PROMPT = `You are Fotographiya's official AI photography assistant. You MUST answer ONLY about Fotographiya company.

COMPANY DATA (Use ONLY this exact data):
Name: Fotographiya
Founder: Mohit Barthunia
Location: Kota, Rajasthan, India
Website: https://www.fotographiya.com
Phone: +91 9001110144
Email: fotographiyaworld@gmail.com
WhatsApp: https://api.whatsapp.com/send/?phone=9001110144&text=Hi+Fotographiya%2C+I+want+to+enquire+about+your+photography+packages.&type=phone_number&app_absent=0
Experience: 15+ Years
Customers: 53K+ Happy Customers
Satisfaction: 98.29%
Awards: Nakshatra (2023), Dainik Angad (2023), Jeeto Marathon (2024)
Mission: To bring world-class professionalism to India's wedding industry
Vision: To build India's most trusted wedding media company

SERVICES (with links):
[Wedding Photography](https://www.fotographiya.com/services/wedding-photography) - Full wedding coverage
[Pre-Wedding Photography](https://www.fotographiya.com/services/prewedding-photography) - Romantic pre-wedding shoots
[Destination Wedding](https://www.fotographiya.com/services/destination-wedding) - Weddings across India
[Anniversary Photography](https://www.fotographiya.com/services/anniversary-photography) - Celebrate milestones
[Corporate Photography](https://www.fotographiya.com/services/corporate-photography) - Corporate events

SOCIAL MEDIA:
[Instagram](https://www.instagram.com/fotographiya_official/)
[Facebook](https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/)
[YouTube](https://www.youtube.com/@Fotographiya_official)
[LinkedIn](https://www.linkedin.com/company/fotographiya-the-wedding-photography/)
[Reddit](https://www.reddit.com/user/Foreign-Barracuda340/)

📌 CRITICAL RULES - MUST FOLLOW:
1. ⚠️ ONLY answer about Fotographiya company
2. DO NOT give Russian translation or dictionary meaning
3. For COMPANY: "Fotographiya is a premium wedding photography company based in Kota, Rajasthan, founded by Mohit Barthunia."
4. For SERVICES: List services with links
5. For BOOKING: Provide contact links
6. For PACKAGES: Provide contact links
7. For OFF-TOPIC: "I can only help with questions about Fotographiya."
8. ALWAYS use [Text](URL) format for ALL links
9. Keep responses SHORT (2-4 lines)
10. End with: "What would you like to know about Fotographiya?" (ONCE)

EXAMPLE:
"Fotographiya is a premium wedding photography company based in Kota, Rajasthan. Founded by Mohit Barthunia, we have 15+ years of experience with 53,000+ happy customers.

[Visit Website](https://www.fotographiya.com)

What would you like to know about Fotographiya?"`;

// ========================================
// CLEAN RESPONSE FUNCTION
// ========================================

function cleanResponse(response) {
  if (!response) return response;
  
  // Fix Mistral's wrong response
  if (response.includes('Russian word') || response.includes('art of photography')) {
    return `Fotographiya is a premium wedding photography company based in Kota, Rajasthan. Founded by Mohit Barthunia, we have 15+ years of experience with 53,000+ happy customers.

[Visit Website](https://www.fotographiya.com)

What would you like to know about Fotographiya?`;
  }
  
  const lines = response.split('\n');
  const uniqueLines = [];
  let seenQuestion = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes('What would you like to know about Fotographiya?')) {
      if (!seenQuestion) {
        uniqueLines.push(line);
        seenQuestion = true;
      }
      continue;
    }
    if (trimmed === '*' || trimmed === '-' || trimmed === '•' || trimmed === '') continue;
    if (trimmed.startsWith('[ ]') || trimmed.startsWith('[x]')) continue;
    if (trimmed.includes('phone=') && !trimmed.includes('http')) continue;
    if (trimmed.includes('Hi+Fotographiya') && !trimmed.includes('http')) continue;
    uniqueLines.push(line);
  }
  
  let result = uniqueLines.join('\n').trim();
  
  if (!result.includes('What would you like to know about Fotographiya?')) {
    result += '\n\nWhat would you like to know about Fotographiya?';
  }
  
  result = result.replace(/\n{3,}/g, '\n\n');
  return result;
}

// ========================================
// CALL PROVIDER - FIXED FOR MISTRAL
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
      let content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (content) {
        console.log(`✅ ${provider.name} Success!`);
        return cleanResponse(content);
      }
      return null;
    }

    // For Mistral, Cerebras, Groq - Force system prompt
    const response = await axios.post(
      provider.endpoint,
      {
        model: provider.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.key}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    let content = response.data.choices?.[0]?.message?.content || '';
    if (content) {
      console.log(`✅ ${provider.name} Success!`);
      // Extra check for Mistral wrong response
      if (content.includes('Russian word') || content.includes('art of photography')) {
        content = `Fotographiya is a premium wedding photography company based in Kota, Rajasthan. Founded by Mohit Barthunia, we have 15+ years of experience with 53,000+ happy customers.

[Visit Website](https://www.fotographiya.com)

What would you like to know about Fotographiya?`;
      }
      return cleanResponse(content);
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

  return { success: false, content: null, provider: 'None' };
}

// ========================================
// API ROUTES
// ========================================

app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    console.log(`📝 User asked: "${message}"`);

    const result = await generateResponse(message);

    if (result.success && result.content) {
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
      const fallback = `I can help with questions about Fotographiya!

Fotographiya is a premium wedding photography company based in Kota, Rajasthan. Founded by Mohit Barthunia.

[Visit Website](https://www.fotographiya.com) | [Call Us](tel:+919001110144) | [WhatsApp](https://api.whatsapp.com/send/?phone=9001110144&text=Hi+Fotographiya%2C+I+want+to+enquire+about+your+photography+packages.&type=phone_number&app_absent=0) | [Email Us](mailto:fotographiyaworld@gmail.com)

What would you like to know about Fotographiya?`;

      res.json({
        success: true,
        data: {
          message: fallback,
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

app.get('/api/status', (req, res) => {
  res.json({
    totalProviders: validProviders.length,
    currentProvider: currentProviderIndex + 1,
    providers: validProviders.map((p, i) => ({
      name: p.name,
      model: p.model,
      hasKey: !!p.key,
      failures: failureCount[i] || 0,
      active: i === currentProviderIndex
    }))
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', providers: validProviders.length });
});

// ========================================
// START
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Active Providers: ${validProviders.length}`);
  if (validProviders.length > 0) {
    console.log(`📍 Current Provider: ${validProviders[currentProviderIndex].name}`);
  }
});