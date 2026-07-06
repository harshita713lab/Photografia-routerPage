// src/aiService.js - FIXED VERSION

const axios = require('axios');

class AIService {
  constructor() {
    // ===== 4 PROVIDERS CONFIG =====
    this.providers = [
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

    // Filter only providers with API keys
    this.providers = this.providers.filter(p => p.key && p.key !== 'your_...' && p.key !== 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' && p.key !== 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    
    // Track current provider index
    this.currentProviderIndex = 0;
    this.providerFailureCount = {};
    
    // Initialize failure count for each provider
    this.providers.forEach((_, i) => {
      this.providerFailureCount[i] = 0;
    });

    console.log('========================================');
    console.log('🚀 AI Service with 4 Providers Failover');
    console.log(`📊 Total Providers: ${this.providers.length}`);
    this.providers.forEach((p, i) => {
      console.log(`   ${i+1}. ${p.name} (${p.model}) - ${p.key ? '✅ Key Set' : '❌ No Key'}`);
    });
    console.log('========================================');
  }

  // ===== SYSTEM PROMPT =====
  getSystemPrompt() {
    return `You are Fotographiya's official AI photography assistant.

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
- Same Day Reels (Reelographer)
- QR Services
- Caricatures

SOCIAL MEDIA:
Instagram: https://www.instagram.com/fotographiya_official/
Facebook: https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/
YouTube: https://www.youtube.com/@Fotographiya_official
LinkedIn: https://www.linkedin.com/company/fotographiya-the-wedding-photography/
Pexels: https://www.pexels.com/@fotographiya-wedding-photography-823737813/
Reddit: https://www.reddit.com/user/Foreign-Barracuda340/
Medium: https://medium.com/@fotographiyaworld

RULES:
1. ONLY answer about Fotographiya
2. Be professional, friendly, and helpful
3. End with: "What would you like to know about Fotographiya?"
4. For off-topic: "I can only help with questions about Fotographiya."
5. Keep responses short and accurate
6. Use clickable links: [Text](URL)`;
  }

  // ===== GET NEXT PROVIDER INDEX =====
  getNextProviderIndex(currentIndex) {
    const totalProviders = this.providers.length;
    if (totalProviders === 0) return -1;
    
    let attempts = 0;
    let nextIndex = (currentIndex + 1) % totalProviders;
    
    while (attempts < totalProviders) {
      if (this.providerFailureCount[nextIndex] < 3) {
        return nextIndex;
      }
      nextIndex = (nextIndex + 1) % totalProviders;
      attempts++;
    }
    
    this.providers.forEach((_, i) => {
      this.providerFailureCount[i] = 0;
    });
    console.log('🔄 All providers reset');
    return 0;
  }

  // ===== CALL SPECIFIC PROVIDER =====
  async callProvider(providerIndex, userMessage) {
    const provider = this.providers[providerIndex];
    if (!provider || !provider.key) {
      return { success: false, error: 'Provider not configured' };
    }

    try {
      console.log(`🟢 Trying ${provider.name}...`);

      let response;
      const systemPrompt = this.getSystemPrompt();
      
      // ===== GEMINI (Different Format) =====
      if (provider.type === 'gemini') {
        const payload = {
          contents: [{
            parts: [{ 
              text: `${systemPrompt}\n\nUser: ${userMessage}` 
            }]
          }]
        };
        
        const url = `${provider.endpoint}?key=${provider.key}`;
        response = await axios.post(url, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        });
        
        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (content) {
          console.log(`✅ ${provider.name} Success!`);
          let finalContent = content;
          if (!finalContent.includes('What would you like to know about Fotographiya?')) {
            finalContent += '\n\nWhat would you like to know about Fotographiya?';
          }
          return { success: true, content: finalContent };
        }
        return { success: false, error: 'Empty response from Gemini' };
      }

      // ===== GROQ, MISTRAL, CEREBRAS (OpenAI Format) =====
      const payload = {
        model: provider.model,
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: userMessage 
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      };

      response = await axios.post(provider.endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${provider.key}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const content = response.data.choices?.[0]?.message?.content || '';
      
      if (content) {
        console.log(`✅ ${provider.name} Success!`);
        let finalContent = content;
        if (!finalContent.includes('What would you like to know about Fotographiya?')) {
          finalContent += '\n\nWhat would you like to know about Fotographiya?';
        }
        return { success: true, content: finalContent };
      }
      return { success: false, error: 'Empty response' };

    } catch (error) {
      const status = error.response?.status;
      const message = error.message;
      console.log(`❌ ${provider.name} Failed: ${status || message}`);
      if (error.response?.data) {
        console.log(`   ${JSON.stringify(error.response.data).slice(0, 200)}`);
      }
      return { 
        success: false, 
        error: `${provider.name}: ${status || message}` 
      };
    }
  }

  // ===== GENERATE RESPONSE WITH 4 PROVIDERS FAILOVER =====
  async generateResponse(userMessage) {
    if (this.providers.length === 0) {
      return {
        success: false,
        content: 'No API providers configured. Please check your .env file.'
      };
    }

    let attempts = 0;
    const maxAttempts = this.providers.length * 2;

    while (attempts < maxAttempts) {
      const providerIndex = this.currentProviderIndex;
      const provider = this.providers[providerIndex];

      if (this.providerFailureCount[providerIndex] >= 3) {
        console.log(`⏭️ Skipping ${provider.name} (failed ${this.providerFailureCount[providerIndex]} times)`);
        this.currentProviderIndex = this.getNextProviderIndex(providerIndex);
        attempts++;
        continue;
      }

      const result = await this.callProvider(providerIndex, userMessage);
      
      if (result.success && result.content) {
        this.providerFailureCount[providerIndex] = 0;
        this.currentProviderIndex = providerIndex;
        
        return { 
          success: true, 
          content: result.content, 
          provider: provider.name 
        };
      }

      this.providerFailureCount[providerIndex] = (this.providerFailureCount[providerIndex] || 0) + 1;
      console.log(`📊 ${provider.name} failure count: ${this.providerFailureCount[providerIndex]}`);

      this.currentProviderIndex = this.getNextProviderIndex(providerIndex);
      attempts++;

      await new Promise(r => setTimeout(r, 500));
    }

    console.log('❌ All 4 providers failed!');
    return {
      success: false,
      content: 'Unable to process your request. Please try again later.',
      provider: 'None'
    };
  }

  // ===== GET STATUS =====
  getStatus() {
    return {
      totalProviders: this.providers.length,
      currentProvider: this.currentProviderIndex + 1,
      providers: this.providers.map((p, i) => ({
        name: p.name,
        model: p.model,
        hasKey: !!p.key,
        failures: this.providerFailureCount[i] || 0,
        active: i === this.currentProviderIndex
      }))
    };
  }

  // ===== RESET ALL PROVIDERS =====
  resetProviders() {
    this.currentProviderIndex = 0;
    this.providers.forEach((_, i) => {
      this.providerFailureCount[i] = 0;
    });
    console.log('🔄 All providers reset');
  }
}

module.exports = new AIService();