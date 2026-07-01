// src/aiService.js
const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    this.model = process.env.AI_MODEL || 'mixtral-8x7b-32768';
    
    if (!this.apiKey) {
      console.warn('⚠️ GROQ_API_KEY not found in environment variables');
    }
  }

  /**
   * Generate AI response using Groq API
   * ALL RESPONSES COME FROM AI - NO HARDCODING
   */
  async generateResponse(messages, options = {}) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: this.formatMessages(messages),
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500,
          top_p: options.topP || 1,
          stream: false,
          stop: options.stopSequences || null
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model,
        finishReason: response.data.choices[0].finish_reason
      };
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      } else {
        throw new Error('Failed to generate AI response. Please try again.');
      }
    }
  }

  /**
   * Format messages for the AI API
   */
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

  /**
   * System prompt - ONLY THIS IS DEFINED, NO HARDCODED RESPONSES
   * AI GENERATES ALL ACTUAL RESPONSES
   */
  getSystemPrompt() {
    return `You are Fotographiya's AI photography assistant. 

Your role is to help users with:
1. Photography inquiries and tips
2. Information about Fotographiya's services (wedding, portrait, event photography, videography, photo editing)
3. Booking information and packages
4. General photography questions
5. Studio location and contact information

Guidelines:
- Be friendly, professional, and helpful
- Provide accurate information about Fotographiya
- If you don't know something, be honest and offer to connect with a human
- Keep responses concise but informative (2-3 paragraphs max)
- Use emojis occasionally to make conversations engaging
- Always maintain a professional tone

Studio Information:
- Name: Fotographiya Studio
- Services: Professional Photography, Videography, Photo Editing, Event Coverage
- Location: [Add your studio location]
- Contact: [Add contact details]
- Website: www.fotographiya.com

Remember: You are representing Fotographiya brand. Be helpful, professional, and friendly!
Generate all responses dynamically based on user queries.`;
  }

  /**
   * ONLY USED IF API FAILS - Minimal fallback
   */
  getFallbackResponse(userMessage) {
    return "I'm having trouble connecting to my AI service. Please try again later or contact us at support@fotographiya.com";
  }
}

module.exports = new AIService();