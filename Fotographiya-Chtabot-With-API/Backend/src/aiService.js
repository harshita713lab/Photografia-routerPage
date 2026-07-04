// aiService.js - Modified (No fallback)
const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.3-70b-versatile';
  }

  async generateResponse(userMessage) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are Fotographiya's AI Assistant. Only answer about Fotographiya.
              
Company: Fotographiya - Wedding Photography
Location: Kota, Rajasthan
Contact: +91 9001110144
Services: Wedding, Pre-Wedding, Destination, Anniversary, Corporate
Founder: Mohit Barthunia
Experience: 15+ years, 53K+ customers

Rules:
- ONLY answer about Fotographiya
- Professional and helpful
- End with: "What would you like to know about Fotographiya?"
- For off-topic: "I can only help with questions about Fotographiya."`
            },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      let content = response.data.choices[0].message.content;
      
      if (!content.includes('What would you like to know about Fotographiya?')) {
        content += '\n\nWhat would you like to know about Fotographiya?';
      }
      
      return { success: true, content };

    } catch (error) {
      console.error('AI Error:', error.message);
      // Return error, not fallback
      return {
        success: false,
        content: 'Unable to process your request. Please try again.'
      };
    }
  }
}

module.exports = new AIService();