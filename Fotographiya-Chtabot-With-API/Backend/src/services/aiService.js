const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// ============================================
// ✅ CONFIGURATION
// ============================================
class Config {
  static get GEMINI_API_KEY() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY not found in .env file");
    }
    return process.env.GEMINI_API_KEY || "dummy-key";
  }

  static get GROQ_API_KEY() { return process.env.GROQ_API_KEY; }
  static get MISTRAL_API_KEY() { return process.env.MISTRAL_API_KEY; }
  static get CEREBRAS_API_KEY() { return process.env.CEREBRAS_API_KEY; }
  
  static get GROQ_API_URL() { 
    return process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  }
  
  static get AI_MODEL() { 
    return process.env.AI_MODEL || "llama-3.3-70b-versatile";
  }
}

// ============================================
// ✅ AI PROVIDER BASE CLASS
// ============================================
class AIProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.timeout = 30000;
    this.temperature = 0.2;
    this.maxTokens = 150;
  }

  async getResponse(userMessage, systemPrompt) {
    throw new Error("getResponse method must be implemented by subclass");
  }

  _createRequestConfig(data) {
    return {
      method: 'POST',
      headers: this._getHeaders(),
      data: data,
      timeout: this.timeout
    };
  }

  _getHeaders() {
    return { "Content-Type": "application/json" };
  }
}

// ============================================
// ✅ GROQ PROVIDER
// ============================================
class GroqProvider extends AIProvider {
  constructor() {
    super(Config.GROQ_API_KEY);
    this.url = Config.GROQ_API_URL;
    this.model = Config.AI_MODEL;
  }

  async getResponse(userMessage, systemPrompt) {
    if (!this.apiKey) return null;
    
    try {
      const response = await axios.post(
        this.url,
        {
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: { 
            Authorization: `Bearer ${this.apiKey}`, 
            "Content-Type": "application/json" 
          },
          timeout: this.timeout,
        }
      );
      
      return response.data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.log("⚠️ Groq Failed:", error.message);
      return null;
    }
  }
}

// ============================================
// ✅ MISTRAL PROVIDER
// ============================================
class MistralProvider extends AIProvider {
  constructor() {
    super(Config.MISTRAL_API_KEY);
    this.url = "https://api.mistral.ai/v1/chat/completions";
    this.model = "mistral-small-latest";
  }

  async getResponse(userMessage, systemPrompt) {
    if (!this.apiKey) return null;
    
    try {
      const response = await axios.post(
        this.url,
        {
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: { 
            Authorization: `Bearer ${this.apiKey}`, 
            "Content-Type": "application/json" 
          },
          timeout: this.timeout,
        }
      );
      
      return response.data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.log("⚠️ Mistral Failed:", error.message);
      return null;
    }
  }
}

// ============================================
// ✅ CEREBRAS PROVIDER
// ============================================
class CerebrasProvider extends AIProvider {
  constructor() {
    super(Config.CEREBRAS_API_KEY);
    this.url = "https://api.cerebras.ai/v1/chat/completions";
    this.model = "llama-3.3-70b";
  }

  async getResponse(userMessage, systemPrompt) {
    if (!this.apiKey) return null;
    
    try {
      const response = await axios.post(
        this.url,
        {
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: { 
            Authorization: `Bearer ${this.apiKey}`, 
            "Content-Type": "application/json" 
          },
          timeout: this.timeout,
        }
      );
      
      return response.data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.log("⚠️ Cerebras Failed:", error.message);
      return null;
    }
  }
}

// ============================================
// ✅ GEMINI PROVIDER
// ============================================
class GeminiProvider extends AIProvider {
  constructor() {
    super(Config.GEMINI_API_KEY);
    this.model = "gemini-2.0-flash";
  }

  async getResponse(userMessage, systemPrompt) {
    if (!this.apiKey) return null;
    
    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({
        model: this.model,
        generationConfig: { 
          maxOutputTokens: this.maxTokens, 
          temperature: this.temperature 
        },
      });
      
      const result = await model.generateContent(
        `${systemPrompt}\n\nUSER QUESTION: ${userMessage}\n\nYOUR RESPONSE:`
      );
      
      return (await result.response).text() || null;
    } catch (error) {
      console.log("⚠️ Gemini Failed:", error.message);
      return null;
    }
  }
}

// ============================================
// ✅ PROMPT BUILDER
// ============================================
class PromptBuilder {
  static buildSystemPrompt(context) {
    return `
You are Fotographiya's official AI photography assistant.

🎯 **RESPONSE GUIDELINES - FOLLOW EXACTLY:**

STRUCTURE:
1. [3-4 line SUMMARY - clear and professional]
2. **Key Points:** (3-4 bullet points)
3. **Learn More:** [Link Text](URL)
4. 💡 [Question]

========================================
EXAMPLE:
========================================
📸 **Pre-Wedding Photography Services**

We offer professional pre-wedding photography services for couples. Our team captures romantic moments at scenic locations with expert editing and creative direction.

**Key Points:**
• Available at multiple scenic locations
• Professional editing and retouching
• Customized packages for every couple

**Learn More:** [Pre-Wedding Photography](https://www.fotographiya.com/services/prewedding-photography)

💡 Would you like to see our portfolio?
========================================

COMPANY CONTEXT:
${context}

IMPORTANT RULES:
1. Summary must be 3-4 lines ONLY
2. Key Points must be 3-4 bullets ONLY
3. Include ONE link ONLY
4. Include ONE question ONLY
5. No duplicate sections
6. Maintain professional tone throughout
7. Use appropriate emoji for the topic
`;
  }
}

// ============================================
// ✅ RESPONSE FORMATTER
// ============================================
class ResponseFormatter {
  static formatResponse(text) {
    if (!text) return text;
    
    let cleanText = text;
    
    // ===== STEP 1: FIX BROKEN LINKS =====
    cleanText = this._fixBrokenLinks(cleanText);
    
    // ===== STEP 2: REMOVE DUPLICATE HEADERS =====
    cleanText = this._removeDuplicateHeaders(cleanText);
    
    // ===== STEP 3: EXTRACT CONTENT =====
    const extracted = this._extractContent(cleanText);
    
    // ===== STEP 4: BUILD FINAL RESPONSE =====
    return this._buildFinalResponse(extracted);
  }

  static _fixBrokenLinks(text) {
    const fixes = [
      [/https:\/\/www\.\s*\)/g, 'https://www.fotographiya.com/about)'],
      [/https:\/\/www\.\)/g, 'https://www.fotographiya.com/about)'],
      [/\[About Us\]\(https:\/\/www\.\)/g, '[About Us](https://www.fotographiya.com/about)'],
      [/\[About Us\]\(com\/about\)/g, '[About Us](https://www.fotographiya.com/about)'],
      [/\[Portfolio\]\(https:\/\/www\.\)/g, '[Portfolio](https://www.fotographiya.com/portfolio)'],
      [/\[Contact Us\]\(https:\/\/www\.\)/g, '[Contact Us](https://www.fotographiya.com/contact)'],
    ];
    
    let fixedText = text;
    for (const [pattern, replacement] of fixes) {
      fixedText = fixedText.replace(pattern, replacement);
    }
    return fixedText;
  }

  static _removeDuplicateHeaders(text) {
    const lines = text.split('\n');
    const cleanedLines = [];
    let foundFirstContent = false;
    let hasKeyPoints = false;
    let hasLearnMore = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (!foundFirstContent) {
        if (this._isHeaderToSkip(trimmed)) {
          continue;
        }
        foundFirstContent = true;
      }
      
      if (trimmed.startsWith('**Key Points:**') || trimmed.startsWith('Key Points:')) {
        if (!hasKeyPoints) {
          hasKeyPoints = true;
          cleanedLines.push('**Key Points:**');
        }
        continue;
      }
      
      if (trimmed.startsWith('**Learn More:**') || trimmed.startsWith('Learn More:')) {
        if (!hasLearnMore) {
          hasLearnMore = true;
          cleanedLines.push(line);
        }
        continue;
      }
      
      cleanedLines.push(line);
    }
    
    return cleanedLines.join('\n');
  }

  static _isHeaderToSkip(trimmed) {
    const skipPatterns = [
      '**Key Points:**', 'Key Points:',
      '📸 Key Points:', '### Key Points:',
      '**Learn More:**', 'Learn More:',
      '### Learn More:', '📸',
      '###', '##', '#'
    ];
    
    if (skipPatterns.some(pattern => trimmed.startsWith(pattern))) {
      return true;
    }
    
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      return true;
    }
    
    return trimmed === '';
  }

  static _extractContent(text) {
    const content = {
      title: 'Fotographiya',
      summary: '',
      points: [],
      linkText: '',
      linkUrl: '',
      question: '',
      emoji: '📸'
    };

    // Extract title
    const titleMatch = text.match(/[^\n]*\*\*[^\n]+\*\*/);
    if (titleMatch) {
      content.title = titleMatch[0]
        .replace(/^[^\w\s]+\s*/, '')
        .replace(/\*\*/g, '')
        .trim();
    }

    // Extract summary
    content.summary = this._extractSummary(text);
    
    // Extract bullet points
    content.points = this._extractBulletPoints(text);
    
    // Extract link
    const link = this._extractLink(text, content.title);
    content.linkText = link.text;
    content.linkUrl = link.url;
    
    // Extract question
    content.question = this._extractQuestion(text);
    
    // Determine emoji
    content.emoji = this._determineEmoji(content.title);
    
    return content;
  }

  static _extractSummary(text) {
    const summaryMatch = text.match(/\*\*[^\n]+\*\*\n\n([^\n]+)/);
    if (summaryMatch) {
      return summaryMatch[1].trim();
    }
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length > 0) {
      let startIdx = sentences[0].length < 30 ? 1 : 0;
      return sentences.slice(startIdx, startIdx + 3).join(' ').trim();
    }
    
    return '';
  }

  static _extractBulletPoints(text) {
    const points = [];
    const bulletRegex = /[•\-*]\s*(.*?)(?=[•\-*]|$)/g;
    let match;
    
    while ((match = bulletRegex.exec(text)) !== null) {
      const point = match[1].trim();
      if (point && point.length > 5 && 
          !point.startsWith('Learn More') && 
          !point.startsWith('Key')) {
        points.push(point);
      }
    }
    
    if (points.length === 0) {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      for (const sent of sentences.slice(1, 5)) {
        const clean = sent.trim();
        if (clean.length > 15 && clean.length < 100 && 
            !clean.includes('?') && !clean.includes('Learn More')) {
          points.push(clean);
          if (points.length >= 4) break;
        }
      }
    }
    
    return points;
  }

  static _extractLink(text, title) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
    const match = text.match(linkRegex);
    
    if (match) {
      let url = match[2];
      if (url && !url.startsWith('http')) {
        url = `https://www.fotographiya.com/${url}`;
      }
      if (url === 'https://www.') {
        url = 'https://www.fotographiya.com/about';
      }
      return { text: match[1], url };
    }
    
    const titleLower = title.toLowerCase();
    if (titleLower.includes('about') || titleLower.includes('history')) {
      return { text: 'About Us', url: 'https://www.fotographiya.com/about' };
    } else if (titleLower.includes('portfolio') || titleLower.includes('gallery')) {
      return { text: 'Portfolio', url: 'https://www.fotographiya.com/portfolio' };
    } else {
      return { text: 'Contact Us', url: 'https://www.fotographiya.com/contact' };
    }
  }

  static _extractQuestion(text) {
    const questionMatch = text.match(/💡\s*([^?]+\?)/);
    if (questionMatch) {
      return questionMatch[1].trim();
    }
    
    const questionSentences = text.match(/[^.!?]+\?/g) || [];
    if (questionSentences.length > 0) {
      return questionSentences[questionSentences.length - 1].trim();
    }
    
    return '';
  }

  static _determineEmoji(title) {
    const titleLower = title.toLowerCase();
    const emojiMap = {
      'wedding': '💍',
      'pre': '📸',
      'contact': '📞',
      'team': '👥',
      'history': '🏢',
      'about': '🏢',
      'portfolio': '🖼️',
      'gallery': '🖼️',
      'social': '📱',
      'golden': '✨',
      'goldenbox': '✨',
      'academy': '🎓',
      'welcome': '👋',
      'hello': '👋',
      'hi': '👋'
    };
    
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (titleLower.includes(key)) {
        return emoji;
      }
    }
    return '📸';
  }

  static _buildFinalResponse(content) {
    let formatted = ` ${content.emoji} **${content.title}**\n\n`;
    
    // Add summary
    if (content.summary) {
      formatted += `${content.summary}\n\n`;
    }
    
    // Add key points
    if (content.points.length > 0) {
      formatted += `**Key Points:**\n`;
      for (const point of content.points.slice(0, 4)) {
        formatted += `• ${point}\n`;
      }
      formatted += '\n';
    }
    
    // Add learn more link
    if (content.linkText && content.linkUrl) {
      formatted += `**Learn More:** [${content.linkText}](${content.linkUrl})\n\n`;
    }
    
    // Add question
    if (content.question) {
      formatted += `💡 ${content.question}`;
    } else {
      formatted += `💡 What would you like to know more about?`;
    }
    
    // Cleanup
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.replace(/\*\*Key Points:\*\*\s*\*\*Key Points:\*\*/g, '**Key Points:**');
    formatted = formatted.replace(/^\s*\*\*Key Points:\*\*\s*/m, '');
    
    return formatted.trim();
  }
}

// ============================================
// ✅ FALLBACK RESPONSES
// ============================================
class FallbackResponse {
  static getResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    // Greetings
    if (this._isGreeting(msg)) {
      return this._getGreetingResponse(msg);
    }
    
    // Farewell
    if (this._isFarewell(msg)) {
      return this._getFarewellResponse();
    }
    
    // Service-specific
    const serviceResponse = this._getServiceResponse(msg);
    if (serviceResponse) {
      return serviceResponse;
    }
    
    // Off-topic
    if (this._isOffTopic(msg)) {
      return this._getOffTopicResponse();
    }
    
    // Default
    return this._getDefaultResponse();
  }

  static _isGreeting(msg) {
    const greetings = ['hello', 'hi', 'hey', 'helloo', 'how are you', 'how r u', 'how are u'];
    return greetings.some(g => msg.includes(g) || msg === g);
  }

  static _getGreetingResponse(msg) {
    if (msg.includes('how are you') || msg.includes('how r u') || msg.includes('how are u')) {
      return `I am doing well, thank you for asking! 😊 How can I assist you with Fotographiya today?`;
    }
    
    if (msg.includes('good morning')) {
      return `Good morning! ☀️ I'm your Fotographiya assistant. How may I help you today?`;
    }
    
    if (msg.includes('good evening')) {
      return `Good evening! 🌙 Welcome to Fotographiya. How can I assist you today?`;
    }
    
    if (msg.includes('good afternoon')) {
      return `Good afternoon! ☀️ I'm here to help with any questions about Fotographiya.`;
    }
    
    return `Hello! 👋 Welcome to Fotographiya. I'm your AI assistant. How may I help you today?`;
  }

  static _isFarewell(msg) {
    return msg.includes('bye') || msg.includes('goodbye');
  }

  static _getFarewellResponse() {
    return `Thank you for visiting Fotographiya! 👋 Have a wonderful day. Feel free to reach out anytime.`;
  }

  static _getServiceResponse(msg) {
    const serviceMap = [
      {
        keywords: ['pre wedding', 'prewedding'],
        response: `📸 **Pre-Wedding Photography Services**

We offer professional pre-wedding photography services for couples. Our team captures romantic moments at scenic locations with expert editing and creative direction.

**Key Points:**
• Available at multiple scenic locations
• Professional editing and retouching
• Customized packages for every couple

**Learn More:** [Pre-Wedding Photography](https://www.fotographiya.com/services/prewedding-photography)

💡 Would you like to see our portfolio?`
      },
      {
        keywords: ['wedding'],
        response: `💍 **Wedding Photography Services**

We provide comprehensive wedding photography covering all ceremonies - from pre-wedding rituals to the reception, with professional editing and creative storytelling.

**Key Points:**
• Candid and traditional photography
• Cinematic videography
• Full-day coverage
• Professional editing

**Learn More:** [Wedding Photography](https://www.fotographiya.com/services/wedding-photography)

💡 Would you like to see our portfolio?`
      },
      {
        keywords: ['contact', 'phone', 'call', 'email'],
        response: `📞 **Contact Fotographiya**

You can reach us through multiple channels for inquiries, bookings, and consultations.

**Key Points:**
• Phone: +91 9001110144
• Email: fotographiyaworld@gmail.com
• Office: Kota, Rajasthan

**Learn More:** [Contact Us](https://www.fotographiya.com/contact)

💡 How can we assist you today?`
      },
      {
        keywords: ['team', 'employee', 'staff'],
        response: `👥 **Our Team**

Fotographiya has a team of 50+ dedicated professionals across multiple departments, working together to deliver exceptional photography services.

**Key Points:**
• Production Team: 10+ members
• Tech Team: 10+ members
• Operations Team: 20+ members
• Management: 5+ members

💡 Would you like to learn more about our team members?`
      },
      {
        keywords: ['portfolio', 'gallery'],
        response: `🖼️ **Portfolio Gallery**

Our portfolio showcases 100+ weddings and events we've captured with creativity, passion, and professional excellence.

**Key Points:**
• 100+ weddings covered
• Premium photo and video galleries
• Cinematic storytelling

**Learn More:** [Portfolio Gallery](https://www.fotographiya.com/portfolio)

💡 Want to see more of our work?`
      },
      {
        keywords: ['history', 'founder', 'established', 'about'],
        response: `🏢 **About Fotographiya**

Fotographiya was founded in 2023 by Mohit Barthunia in Kota, Rajasthan, India. We blend traditional artistry with modern technology to create timeless memories.

**Key Points:**
• Founded: 2023
• Location: Kota, Rajasthan
• 100+ happy couples
• 50+ team members

**Learn More:** [About Us](https://www.fotographiya.com/about)

💡 Would you like to know more about our journey?`
      },
      {
        keywords: ['social', 'instagram', 'facebook', 'youtube'],
        response: `📱 **Follow Fotographiya on Social Media**

Stay connected with us on social media to see our latest work, client testimonials, and behind-the-scenes content.

**Key Points:**
• [Instagram](https://www.instagram.com/fotographiya_official/) - Daily wedding highlights
• [Facebook](https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/) - Client testimonials
• [YouTube](https://www.youtube.com/@Fotographiya_official) - Cinematic wedding films

💡 Want to see more of our work?`
      },
      {
        keywords: ['goldenbox', 'golden box', 'qr'],
        response: `✨ **GoldenBox - AI Photo Delivery System**

GoldenBox is our innovative AI-powered system that delivers high-quality event photos instantly to attendees without requiring internet or app downloads.

**Key Points:**
• No internet required
• No app download needed
• 3-second instant download
• AI-enhanced premium quality

**Learn More:** [GoldenBox Technology](https://www.fotographiya.com)

💡 Would you like to know more about GoldenBox?`
      },
      {
        keywords: ['academy', 'course', 'learn', 'training'],
        response: `🎓 **Fotographiya Academy**

Fotographiya Academy offers professional photography and videography courses with paid internships and industry-recognized certification.

**Key Points:**
• 8 comprehensive courses available
• 4-month paid internship
• Industry-recognized certificate
• Top performer wins a camera

**Learn More:** [Fotographiya Academy](https://www.fotographiya.com/fotographiya-academy)

💡 Would you like to explore our course offerings?`
      }
    ];

    for (const service of serviceMap) {
      if (service.keywords.some(kw => msg.includes(kw))) {
        return service.response;
      }
    }
    
    return null;
  }

  static _isOffTopic(msg) {
    const keywords = [
      "bts", "kpop", "ipl", "cricket", "movie", "actor", 
      "singer", "song", "netflix", "prime", "football",
      "prime minister", "president", "modi", "trump",
      "china", "pakistan"
    ];
    return keywords.some(kw => msg.includes(kw));
  }

  static _getOffTopicResponse() {
    return `⚠️ **Specialized Assistance Only**

I'm a specialized AI assistant for Fotographiya - your premier wedding photography company. I can only help with topics related to our services.

**Key Points:**
• Wedding Photography
• Pre-Wedding Photography
• GoldenBox AI Technology
• Fotographiya Academy

💡 What would you like to know about Fotographiya?`;
  }

  static _getDefaultResponse() {
    return `📸 **Welcome to Fotographiya**

I'm your professional AI photography assistant. I can provide information about our photography services, packages, GoldenBox technology, and academy.

**Key Points:**
• Wedding & Pre-Wedding Photography
• Corporate & Event Photography
• GoldenBox AI Technology
• Fotographiya Academy

**Learn More:** [Contact Us](https://www.fotographiya.com/contact)

💡 How can I assist you with Fotographiya today?`;
  }
}

// ============================================
// ✅ AI RESPONSE HANDLER
// ============================================
class AIResponseHandler {
  constructor() {
    this.providers = [
      new GroqProvider(),
      new MistralProvider(),
      new CerebrasProvider(),
      new GeminiProvider()
    ];
  }

  async getAIResponse(userMessage, context) {
    const systemPrompt = PromptBuilder.buildSystemPrompt(context);
    
    for (const provider of this.providers) {
      const response = await provider.getResponse(userMessage, systemPrompt);
      if (response) {
        return ResponseFormatter.formatResponse(response);
      }
    }
    
    console.log("⚠️ All providers failed, using fallback");
    return FallbackResponse.getResponse(userMessage);
  }
}

// ============================================
// ✅ EXPORTS
// ============================================
module.exports = { 
  getAIResponse: (userMessage, context) => {
    const handler = new AIResponseHandler();
    return handler.getAIResponse(userMessage, context);
  }
};