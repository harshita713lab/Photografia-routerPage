// src/aiService.js
const axios = require('axios');
const companyData = require('./data/companyData');

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    this.model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
    
    // Website URL
    this.websiteUrl = 'https://www.fotographiya.com';
    
    console.log('========================================');
    console.log('🤖 Fotographiya AI Service Initialized');
    console.log(`🌐 Website: ${this.websiteUrl}`);
    console.log(`📍 Location: ${companyData.company.location}`);
    console.log('========================================');
  }

  // ========== KEYWORD MATCHING ==========
  getKeywordResponse(message) {
    const msg = message.toLowerCase().trim();
    
    const keywordMap = {
      'location': 'location',
      'address': 'location',
      'where': 'location',
      'studio': 'location',
      'reach': 'location',
      'package': 'package',
      'packages': 'package',
      'price': 'price',
      'pricing': 'price',
      'cost': 'price',
      'rate': 'price',
      'service': 'service',
      'services': 'service',
      'offer': 'service',
      'offers': 'service',
      'contact': 'contact',
      'phone': 'contact',
      'call': 'contact',
      'whatsapp': 'contact',
      'whats app': 'contact',
      'website': 'contact',
      'email': 'contact',
      'mail': 'contact',
      'turnt': 'photos',
      'photos': 'photos',
      'album': 'photos',
      'gallery': 'photos',
      'portfolio': 'photos',
      'turnaround': 'photos',
      'delivery': 'photos',
      'get': 'photos',
      'receive': 'photos',
      'why': 'why-choose',
      'choose': 'why-choose',
      'select': 'why-choose',
      'recommend': 'why-choose',
      'trust': 'why-choose'
    };
    
    for (const [key, value] of Object.entries(keywordMap)) {
      if (msg === key || msg.includes(key)) {
        const responseKey = value;
        if (companyData.keywordResponses[responseKey]) {
          console.log(`🔑 Keyword matched: "${msg}" → "${responseKey}"`);
          return companyData.keywordResponses[responseKey];
        }
      }
    }
    
    return null;
  }

  // ========== OFF-TOPIC DETECTION ==========
  isOffTopic(message) {
    const fotographiyaKeywords = [
      'fotographiya', 'photographiya', 'foto',
      'wedding', 'pre-wedding', 'engagement', 'mehndi', 'sangeet',
      'photography', 'photo', 'candid', 'traditional', 'cinematography',
      'drone', 'photobooth', 'live screening',
      'videography', 'video', 'album',
      'package', 'price', 'cost', 'booking', 'advance', 'payment',
      'cancellation', 'policy',
      'corporate', 'maternity', 'baby shoot', 'anniversary',
      'party', 'function', 'ceremony', 'event',
      'kota', 'rajasthan', 'outstation', 'travel',
      'portfolio', 'gallery', 'review', 'rating', 'quality',
      'professional', 'photographer', 'camera', 'shoot', 'session',
      'couple', 'family', 'guest', 'covid', 'safety',
      'service', 'offer', 'provide', 'available',
      'your', 'company', 'studio', 'assistant', 'name',
      'location', 'address', 'where', 'contact', 'phone',
      'whatsapp', 'email', 'website', 'package', 'price',
      'photos', 'album', 'gallery', 'turnaround', 'delivery',
      'choose', 'select', 'recommend', 'trust'
    ];
    
    const msg = message.toLowerCase().trim();
    return !fotographiyaKeywords.some(keyword => msg.includes(keyword));
  }

  // ========== NAME DETECTION ==========
  isNameIntroduction(message) {
    const patterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /i'm (\w+)/i,
      /this is (\w+)/i
    ];
    return patterns.some(pattern => pattern.test(message));
  }

  extractName(message) {
    const patterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /i'm (\w+)/i,
      /this is (\w+)/i
    ];
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // ========== GENERATE RESPONSE ==========

  async generateResponse(messages, options = {}) {
    try {
      const userMessage = messages[messages.length - 1]?.content || '';
      
      // ========== CHECK: KEYWORD MATCH ==========
      const keywordResponse = this.getKeywordResponse(userMessage);
      if (keywordResponse) {
        console.log('✅ Keyword response found, returning directly');
        return {
          success: true,
          content: keywordResponse,
          usage: { total_tokens: 0 },
          model: 'keyword-response'
        };
      }

      // ========== CHECK: OFF-TOPIC ==========
      if (this.isOffTopic(userMessage)) {
        console.log('🚫 Off-topic question blocked');
        return {
          success: true,
          content: `I can only help with questions about Fotographiya and our photography services.

Please ask about:
- Our photography services (wedding, pre-wedding, candid, traditional)
- Packages and pricing
- Booking and availability
- Studio location
- Events we cover
- Our photographers
- Photo delivery and turnaround

Feel free to ask anything about Fotographiya! 📸`,
          usage: { total_tokens: 0 },
          model: 'off-topic-filter'
        };
      }

      // ========== CHECK: NAME INTRODUCTION ==========
      if (this.isNameIntroduction(userMessage)) {
        const name = this.extractName(userMessage);
        if (name) {
          console.log(`👤 Name detected: ${name}`);
          return {
            success: true,
            content: `Nice to meet you, ${name}! I am Fotographiya Assistant. How can I help you today? 📸`,
            usage: { total_tokens: 0 },
            model: 'name-response'
          };
        }
      }

      // ========== ALL OTHER QUESTIONS GO TO AI ==========
      console.log('📤 AI Generating response...');
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: this.formatMessages(messages),
          temperature: options.temperature || 0.4,
          max_tokens: options.maxTokens || 800,
          top_p: options.topP || 1,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000,
          family: 4
        }
      );

      console.log('✅ AI Response received!');
      return {
        success: true,
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model
      };
    } catch (error) {
      console.error('\n❌ AI Service Error:', error.message);
      
      if (error.response) {
        console.error(`📋 Status: ${error.response.status}`);
        console.error(`📋 Data:`, JSON.stringify(error.response.data, null, 2));
      }
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your Groq API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`AI Error: ${error.message}`);
      }
    }
  }

  formatMessages(messages) {
    const hasSystem = messages.some(m => m.role === 'system');
    const formattedMessages = [...messages];

    if (!hasSystem) {
      formattedMessages.unshift({
        role: 'system',
        content: this.getSystemPrompt()
      });
    }

    return formattedMessages;
  }

  getSystemPrompt() {
    return `You are Fotographiya's official AI photography assistant.

📌 SOURCES TO USE FOR ANSWERS (IN ORDER):

1. **FOTOGRAPHIA WEBSITE**: ${this.websiteUrl}
   - Home, About Us, Portfolio, Contact Us
   - Services: Wedding, Pre Wedding, Destination Wedding, Anniversary
   - Corporate, Academy, Get Your Photo

2. **COMPANY DATA** (If not on website):
${JSON.stringify(companyData, null, 2)}

📝 RULES:

1. **WEBSITE FIRST**: Always check the Fotographiya website first for answers
2. **THEN COMPANY DATA**: If not on website, use the company data
3. **AI GENERATES**: If no data found, AI generates a professional response
4. **KEYWORD RESPONSES**: Direct keyword matches get instant responses

5. **RESPONSE GUIDELINES**:
   - Be warm, friendly, and professional
   - Keep responses SHORT and ACCURATE
   - Use emojis: 📸 ✨ 💫 🤵 🎯 💰 📍
   - Use **bold** for important information
   - Use bullet points for lists
   - Include website link when appropriate: ${this.websiteUrl}

6. **YOUR NAME**: "I am Fotographiya Assistant! I'm here to help you."

7. **GREETINGS**: "Hello! I am Fotographiya Assistant. How can I help you today? 📸"

8. **USER NAME**: Remember their name and use it in responses

9. **OFF-TOPIC**: Politely say you only answer Fotographiya-related questions

IMPORTANT: Always be helpful, professional, and accurate. If unsure, say: "Please visit our website for more details: ${this.websiteUrl}"`;
  }
}

module.exports = new AIService();