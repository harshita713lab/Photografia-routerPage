const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const responses = require('../data/responses.json');

dotenv.config();

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    
    try {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_new_secret_key_here') {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash-lite'
        });
        console.log('✅ Gemini API configured successfully');
      } else {
        console.log('⚠️ Gemini not configured, using fallback responses');
      }
    } catch (error) {
      console.log('⚠️ Gemini not configured, using fallback responses');
    }
  }

  getFallbackResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // FIRST: Check for non-photography questions
    if (msg.includes('capital') || msg.includes('prime minister') || msg.includes('president') || 
        msg.includes('weather') || msg.includes('population') || msg.includes('history') ||
        msg.includes('who is') || msg.includes('what is') && !msg.includes('photography') && !msg.includes('camera')) {
      return "I'm sorry, I'm only able to help with questions about Fotographiya's photography services. How can I assist you with wedding photography, portrait sessions, or event coverage?";
    }
    
    // Check for personal questions
    if (msg.includes('my name') || msg.includes('my location') || msg.includes('who am i')) {
      return "I don't have access to personal information. I'm here to help with Fotographiya's photography services. Would you like to know about our wedding photography packages?";
    }
    
    // Photography questions
    if (msg.match(/hello|hi|hey|greetings/)) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    if (msg.match(/bye|goodbye|see you/)) {
      return responses.farewells[Math.floor(Math.random() * responses.farewells.length)];
    }
    if (msg.match(/tip|advice|suggestion|how to/)) {
      return responses.photography_tips[Math.floor(Math.random() * responses.photography_tips.length)];
    }
    if (msg.match(/service|offer|provide/)) {
      return responses.services[Math.floor(Math.random() * responses.services.length)];
    }
    if (msg.match(/price|cost|pricing|rate|how much/)) {
      return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
    }
    if (msg.match(/wedding/)) {
      return "💍 At Fotographiya, we offer premium wedding photography starting from ₹50,000. Includes: Full day coverage, 200+ edited photos, Pre-wedding shoot, and Album design. Would you like to book a consultation?";
    }
    if (msg.match(/portrait/)) {
      return "📸 Our portrait sessions start from ₹10,000. Includes: 2-hour shoot, 3 outfit changes, 50 edited photos, and Digital gallery. Available at our Delhi studio or your location!";
    }
    if (msg.match(/event|corporate/)) {
      return "🎯 Event coverage starts from ₹25,000 for 4 hours. Includes: Full coverage, 100+ edited photos, and Same-day preview gallery. Perfect for corporate events, conferences, and parties!";
    }
    if (msg.match(/photo|photography|camera|lens|shoot/)) {
      return "That's a great photography question! At Fotographiya, we specialize in capturing beautiful moments. Could you tell me more specifically what you'd like to know about?";
    }
    
    // Default - redirect to Fotographiya
    return "Welcome to Fotographiya! I'm here to help with our photography services, pricing, and bookings. What would you like to know about?";
  }

  async getAIResponse(message) {
    try {
      if (!this.model) {
        return this.getFallbackResponse(message);
      }

      // 🚀 STRICT SYSTEM PROMPT - ONLY FOTOGRAPHIYA
      const prompt = `You are an AI assistant for Fotographiya, a professional photography company.

🚫 STRICT RULES (MUST FOLLOW):
1. ONLY answer questions about Fotographiya and photography services
2. If question is NOT about Fotographiya/photography → Politely refuse and redirect
3. If question is personal (name, location) → Say you don't have that info
4. ALWAYS redirect to Fotographiya services

✅ ALLOWED TOPICS:
- Fotographiya services (Wedding, Portrait, Events, Commercial)
- Photography tips and advice
- Pricing and packages
- Studio location and hours
- Booking and contact info

❌ NOT ALLOWED:
- General knowledge questions (capital of India, weather, politics, history)
- Personal questions (user's name, location, personal info)
- Non-photography topics
- Offensive or inappropriate questions

📋 FOTOGRAPHIYA INFORMATION:
Services:
- Wedding Photography: ₹50,000 (Full day, 200+ photos, Pre-wedding shoot, Album)
- Portrait Sessions: ₹10,000 (2 hours, 50 photos, 3 outfit changes)
- Event Coverage: ₹25,000 (4 hours, 100+ photos)
- Commercial Photography: Custom quote

Studio:
- Location: 123 Photography Lane, Delhi
- Hours: 10 AM - 8 PM (Mon-Sat)
- Phone: +91-XXXXX-XXXXX
- Email: contact@fotographiya.com
- Website: www.fotographiya.com

💬 RESPONSE GUIDELINES:
- If photography question: Give detailed, helpful answer
- If non-photography question: "I'm sorry, I'm only able to help with questions about Fotographiya's photography services. How can I assist you with wedding photography, portrait sessions, or event coverage?"
- If personal question: "I don't have access to personal information. I'm here to help with Fotographiya's photography services."

User question: ${message}

Remember: ONLY answer if related to Fotographiya or photography. Otherwise, politely redirect.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini Error:', error);
      return this.getFallbackResponse(message);
    }
  }
}

module.exports = new AIService();