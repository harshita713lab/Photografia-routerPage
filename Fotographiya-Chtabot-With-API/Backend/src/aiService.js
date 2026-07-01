// src/aiService.js
const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    this.model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
    
    this.contactInfo = {
      whatsapp: '918824127624',
      phone: '+918824127624',
      website: 'https://www.fotographiya.com',
      email: 'info@fotographiya.com',
      location: 'Kota, Rajasthan'
    };
    
    console.log('========================================');
    console.log('🤖 Fotographiya AI Service Initialized');
    console.log(`📞 WhatsApp: ${this.contactInfo.whatsapp}`);
    console.log(`📱 Phone: ${this.contactInfo.phone}`);
    console.log('========================================');
  }

  isContactQuery(message) {
    const contactKeywords = [
      'contact', 'reach', 'connect', 'talk', 'speak', 'call', 'phone',
      'whatsapp', 'whats app', 'message', 'email', 'mail',
      'address', 'location', 'visit', 'meet', 'office',
      'how to contact', 'get in touch', 'reach out',
      'number', 'mobile', 'telephone'
    ];
    const msg = message.toLowerCase().trim();
    return contactKeywords.some(keyword => msg.includes(keyword));
  }

  isFotographiyaRelated(message) {
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
      'service', 'offer', 'provide', 'available'
    ];
    
    const msg = message.toLowerCase().trim();
    return fotographiyaKeywords.some(keyword => msg.includes(keyword));
  }

  getContactResponse() {
    return `How to connect with Fotographiya:

WhatsApp: https://wa.me/${this.contactInfo.whatsapp}
Call: ${this.contactInfo.phone}
Website: ${this.contactInfo.website}
Email: ${this.contactInfo.email}
Location: ${this.contactInfo.location}

Click the WhatsApp or Call buttons above to connect instantly!`;
  }

  getDeclineResponse() {
    return `I can only help with questions about Fotographiya and our photography services.

Please ask about:
- Our photography services (wedding, pre-wedding, candid, traditional)
- Packages and pricing
- Booking and availability
- Studio location
- Events we cover

Feel free to ask anything about Fotographiya!`;
  }

  async generateResponse(messages, options = {}) {
    try {
      const userMessage = messages[messages.length - 1]?.content || '';
      
      if (this.isContactQuery(userMessage)) {
        console.log('📞 Contact question detected');
        return {
          success: true,
          content: this.getContactResponse(),
          usage: { total_tokens: 0 },
          model: 'contact-response'
        };
      }
      
      if (!this.isFotographiyaRelated(userMessage)) {
        console.log('🚫 Off-topic question blocked:', userMessage.substring(0, 50));
        return {
          success: true,
          content: this.getDeclineResponse(),
          usage: { total_tokens: 0 },
          model: 'off-topic-filter'
        };
      }
      
      console.log('\n📤 AI Generating response for:', userMessage.substring(0, 50));
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: this.formatMessages(messages),
          temperature: options.temperature || 0.3,
          max_tokens: options.maxTokens || 600,
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

COMPANY DATA:

Company: Fotographiya
Location: Kota, Rajasthan
Website: https://www.fotographiya.com
WhatsApp: 918824127624
Call: +918824127624
Started: 2023
Rating: 4.6/5 (92% recommendation)

SERVICES:
- Wedding Photography
- Pre-Wedding Photography
- Destination Wedding
- Anniversary Photography
- Corporate Events
- Engagement Photography
- Mehndi & Sangeet
- Maternity Shoot
- Baby Shoot
- Parties & Events

PHOTOGRAPHY STYLES:
- Traditional Photography
- Candid Photography
- Cinematography
- Drone Shoots
- Photobooth
- Live Screening

PRICING:
- 1 day pre-wedding: ₹35,000 (range: ₹25,000 - ₹49,999)
- 1 day wedding (300 guests): ₹75,000 - ₹99,999
- 2 day wedding: ₹1,50,000 (range: ₹1,50,000 - ₹1,99,999)
- 3 day wedding: ₹2,25,000 (range: ₹2,00,000 - ₹2,49,999)

PAYMENT:
Methods: Net banking, Cash, Cheque/DD, Debit/Credit cards, Mobile wallets, UPI
Advance Booking: 25%
Cancellation: Conditional
Outstation Travel: Yes

RULES:
1. ONLY answer questions about Fotographiya using the data above
2. If asked about best photographer, talk about Fotographiya's team
3. Use clear, professional language
4. Keep responses concise and helpful

Remember: You represent Fotographiya. Be helpful and professional.`;
  }
}

module.exports = new AIService();