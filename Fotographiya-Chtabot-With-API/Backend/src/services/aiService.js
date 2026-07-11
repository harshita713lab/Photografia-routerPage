const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const companyData = require("../data/companyData");

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
    this.maxTokens = 200;
  }

  async getResponse(userMessage, systemPrompt) {
    throw new Error("getResponse method must be implemented by subclass");
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
    if (!this.apiKey) {
      console.log('⚠️ Groq: No API key found');
      return null;
    }
    
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
      
      const content = response.data.choices?.[0]?.message?.content;
      if (content) {
        console.log("✅ Groq Response Success!");
        return content;
      }
      return null;
      
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
// ✅ PROMPT BUILDER - NO LINKS
// ============================================
class PromptBuilder {
  static buildSystemPrompt(context) {
    return `
You are Fotographiya's official AI photography assistant.

🚨 **IMPORTANT RULES:**
1. NEVER include any links in your responses
2. Just provide helpful text information
3. DO NOT use any external knowledge or information not explicitly provided in this COMPANY CONTEXT. If you don't have the information, state that you don't know or cannot help with that specific query.
3. Keep responses clear and professional
4. Use emojis for visual appeal.

🚨 **WEDDING EXAMPLES RULE:**
When asked about wedding examples (celebrity, destination, etc.), ONLY use the couple names and details provided in the COMPANY CONTEXT. DO NOT invent or use any other names like "Deepika Padukone" or "Ranveer Singh". Stick strictly to the provided data.

🎯 **NEW, CONCISE RESPONSE STRUCTURE:**
[Emoji] **Title**

[A short, 1-2 sentence summary.]

• **Point 1:** [Brief and informative]
• **Point 2:** [Brief and informative]
• **Point 3:** [Brief and informative]

💡 [Follow-up question]

========================================
❌ **WRONG - NEVER DO THIS:**
========================================
• [Facebook](https://facebook.com) ← NO LINKS!
• [Instagram](https://instagram.com) ← NO LINKS!
• "Learn More:" with a link ← NO LINKS!
• Any markdown links [text](url) ← NO LINKS!

========================================
📌 **WHAT TO INCLUDE INSTEAD OF LINKS:**
========================================

SOCIAL MEDIA - just mention platform names:
• "Follow us on Facebook, Instagram, YouTube, Pexels, Reddit, LinkedIn, and Medium"

SERVICES - just mention service names:
• "We offer Wedding Photography, Pre-Wedding Photography, Destination Wedding, and Corporate Photography"

CONTACT - just mention contact methods:
• "You can reach us via WhatsApp, phone call, or email"

PACKAGES - just mention package names:
• "We offer Silver, Golden, and Premium packages"

PAGES - just mention page names:
• "Visit our About Us, Portfolio, Academy, and GoldenBox pages"

⚠️ **REMEMBER:**
- NO markdown links [text](url)
- NO "Learn More:" with links
- NO clickable links at all
- Just plain text with emojis and bullet points

COMPANY CONTEXT:
${context}
`;
  }
}

// ============================================
// ✅ RESPONSE FORMATTER - REMOVES ALL LINKS
// ============================================
class ResponseFormatter {
  static formatResponse(text) {
    if (!text) return text;
    
    let cleanText = text;
    
    // ===== STEP 1: REMOVE ALL MARKDOWN LINKS =====
    cleanText = this._removeAllLinks(cleanText);
    
    // ===== STEP 2: REMOVE DUPLICATE HEADERS =====
    cleanText = this._removeDuplicateHeaders(cleanText);
    
    // ===== STEP 3: CLEAN UP EXTRA SEPARATORS =====
    cleanText = this._cleanSeparators(cleanText);
    
    // ===== STEP 4: REMOVE "Learn More:" sections =====
    cleanText = this._removeLearnMoreSections(cleanText);
    
    // ===== STEP 5: CLEAN EXTRA SPACES =====
    cleanText = this._cleanExtraSpaces(cleanText);
    
    return cleanText.trim();
  }

  // ✅ Remove ALL markdown links
  static _removeAllLinks(text) {
    // Remove [text](url) patterns - replace with just the text
    return text.replace(/\[([^\]]+)\]\([^)]+\)/g, (match, text) => {
      return text;
    });
  }

  // ✅ Remove "Learn More:" sections completely
  static _removeLearnMoreSections(text) {
    const lines = text.split('\n');
    const result = [];
    let skipNextLine = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip "Learn More:" lines
      if (trimmed === '**Learn More:**' || trimmed === 'Learn More:' || 
          trimmed.startsWith('**Learn More:**') || trimmed.startsWith('Learn More:')) {
        skipNextLine = true;
        continue;
      }
      
      // Skip the line after "Learn More:" (usually a link)
      if (skipNextLine) {
        skipNextLine = false;
        continue;
      }
      
      result.push(line);
    }
    
    return result.join('\n');
  }

  // ✅ Remove duplicate headers
  static _removeDuplicateHeaders(text) {
    const lines = text.split('\n');
    const result = [];
    const seenHeaders = new Set();
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (result.length === 0 && trimmed === '') continue;
      
      // Handle Key Points
      if (/^\s*[*#]*\s*Key Points:?\s*$/i.test(trimmed)) {
        if (seenHeaders.has('keypoints')) continue;
        seenHeaders.add('keypoints');
        result.push('**Key Points:**');
        continue;
      }
      
      result.push(line);
    }
    
    return result.join('\n');
  }

  // ✅ Clean up extra separators
  static _cleanSeparators(text) {
    return text
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed !== '---' && 
               trimmed !== '===' && 
               trimmed !== '--' && 
               !/^[\-=\*]{3,}$/.test(trimmed);
      })
      .join('\n');
  }

  // ✅ Clean extra spaces and empty lines
  static _cleanExtraSpaces(text) {
    return text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n');
  }
}

// ============================================
// ✅ FALLBACK RESPONSES - NO LINKS
// ============================================
class FallbackResponse {
  static getResponse(userMessage, context) { // Added context parameter
  const msg = userMessage.toLowerCase().trim();
  
  if (this._isGreeting(msg)) return this._getGreetingResponse(msg);
  if (this._isFarewell(msg)) return this._getFarewellResponse();
  const serviceResponse = this._getServiceResponse(msg, context); // Pass context to service response
  if (serviceResponse) return serviceResponse;
  
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
    return `Hello! 👋 Welcome to Fotographiya. I'm your AI assistant. How may I help you today?`;
  }

  static _isFarewell(msg) {
    return msg.includes('bye') || msg.includes('goodbye');
  }

  static _getFarewellResponse() {
    return `Thank you for visiting Fotographiya! 👋 Have a wonderful day. Feel free to reach out anytime.`;
  }

  static _getServiceResponse(msg, context) {
    const serviceMap = [
      // Note: Many of these can now be handled by AI if context is rich enough.
      // This fallback is for when AI fails or if these are very common direct questions.
      {
        keywords: ['social', 'all social', 'platforms', 'channels', 'social media'],
        response: `📱 **Fotographiya's Social Media Accounts**

Stay connected with us across all platforms to explore our photography services, behind-the-scenes content, and creative insights.

**Key Points:**
• Follow us on Facebook, Instagram, YouTube, Pexels, Reddit, LinkedIn, and Medium
• Engage with our community of 100+ happy couples
• Access exclusive content and photography tips

💡 Which platform would you like to connect with us on?`
      },
      {
        keywords: ['package', 'pricing', 'cost', 'budget', 'price', 'rate', 'charges', 'silver', 'golden', 'premium'],
        response: `📦 **Our Photography Packages**

We offer three comprehensive photography packages to suit every couple's needs and budget.

**Key Points:**
• Silver Package: Basic wedding coverage with professional photography, edited digital photos, and online gallery
• Golden Package: Comprehensive coverage with photography and cinematography, professional editing, album, and online gallery
• Premium Package: Premium coverage with photography, cinematography, drone shots, premium album, and all digital assets

💡 Which package interests you the most?`
      },
      {
      keywords: ['birthday', 'cake smash', 'kids birthday', 'birthday party', 'birthday celebration'],
      response: `🎂 **Birthday Photography Services**

We capture the joy, laughter, and love that fills the air on your special day. From the first slice of cake to the last dance, we freeze those moments forever.

**Key Points:**
• Professional birthday photography covering every moment
• Fun cake smash sessions for kids and adults
• Beautiful portraits capturing personality
• Complete party coverage from start to finish
• Premium printed albums and digital frames

💡 Would you like to know about our birthday photography packages?`
    },

    // 🆕 ROKA
    {
      keywords: ['roka', 'pre engagement', 'tilak', 'ring ceremony', 'roka ritual'],
      response: `💍 **Roka Ceremony Photography**

The Roka ceremony is one of the most cherished pre-wedding rituals in Indian culture. We capture every ritual, emotion, and sacred moment of this beautiful tradition.

**Key Points:**
• Professional photography covering all rituals
• Cinematic videography available
• Candid photography capturing real emotions
• Traditional coverage of tilak, ring exchange, and blessings
• Premium leather albums and canvas prints

💡 Would you like to know more about our Roka photography packages?`
    },
      {
        keywords: ['wedding'],
        response: `💍 **Wedding Photography Services**

We provide comprehensive wedding photography covering all ceremonies - from pre-wedding rituals to the reception, with professional editing and creative storytelling.

**Key Points:**
• Candid and traditional photography
• Cinematic videography
• Full-day coverage with professional editing

💡 Would you like to see our wedding portfolio?`
      },
      {
        keywords: ['pre wedding', 'prewedding'],
        response: `📸 **Pre-Wedding Photography Services**

We offer professional pre-wedding photography services for couples. Our team captures romantic moments at scenic locations with expert editing and creative direction.

**Key Points:**
• Available at multiple scenic locations
• Professional editing and retouching
• Customized packages for every couple

💡 Would you like to see our portfolio?`
      },
      {
        keywords: ['destination'],
        response: `🏖️ **Destination Wedding Photography**

We offer professional destination wedding photography services across India. Our team covers all major Indian destinations including Rajasthan, Goa, Kerala, and Himachal Pradesh.

**Key Points:**
• Available in Rajasthan, Goa, Kerala, and Himachal Pradesh
• Professional photography and cinematography
• Customized packages with travel and accommodation arrangements

💡 Would you like to know more about our destination wedding packages?`
      },
      {
        keywords: ['contact', 'phone', 'call', 'email'],
        response: `📞 **Contact Fotographiya**

You can reach us through multiple channels for inquiries, bookings, and consultations.

**Key Points:**
• WhatsApp: +91 9001110144
• Phone Call: +91 9001110144
• Email: fotographiyaworld@gmail.com
• Office: Kota, Rajasthan

💡 How can we assist you today?`
      },
      {
        keywords: ['facebook', 'fb', 'facebootk'],
        response: `📘 **Follow us on Facebook**

Stay connected with us on Facebook to see client testimonials, wedding highlights, and company updates.

💡 Would you like to follow us on other platforms too?`
      },
      {
        keywords: ['instagram', 'insta', 'ig'],
        response: `📸 **Follow us on Instagram**

Stay connected with us on Instagram to see our latest wedding highlights, behind-the-scenes content, and client testimonials.

💡 Would you like to follow us on other platforms too?`
      },
      {
        keywords: ['youtube', 'yt', 'you tube'],
        response: `🎬 **Follow us on YouTube**

Subscribe to our YouTube channel to watch cinematic wedding films, event highlights, and behind-the-scenes videos.

💡 Would you like to follow us on other platforms too?`
      },
      {
        keywords: ['linkedin', 'in'],
        response: `💼 **Follow us on LinkedIn**

Connect with us on LinkedIn for professional updates, company news, and career opportunities.

💡 Would you like to follow us on other platforms too?`
      },
      {
        keywords: ['goldenbox', 'golden box', 'qr'],
        response: `✨ **GoldenBox - AI Photo Delivery System**

GoldenBox is our innovative AI-powered system that delivers high-quality event photos instantly to attendees without requiring internet or app downloads.

**Key Points:**
• No internet required
• No app download needed
• 3-second instant download with AI-enhanced premium quality

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

💡 Would you like to explore our course offerings?`
      },
      {
        keywords: ['about', 'history', 'founder', 'established'],
        response: `🏢 **About Fotographiya**

Fotographiya was founded in 2023 by Mohit Barthunia in Kota, Rajasthan, India. We blend traditional artistry with modern technology to create timeless memories.

**Key Points:**
• Founded in 2023
• Based in Kota, Rajasthan
• 100+ happy couples served
• 50+ dedicated team members

💡 Would you like to know more about our journey?`
      },
      {
        keywords: ['portfolio', 'gallery'],
        response: `🖼️ **Portfolio Gallery**

Our portfolio showcases 100+ weddings and events we've captured with creativity, passion, and professional excellence.

**Key Points:**
• 100+ weddings covered
• Premium photo and video galleries
• Cinematic storytelling with professional editing

💡 Want to see more of our work?`
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

💡 Would you like to learn more about our team?`
      }
    ];

    for (const service of serviceMap) {
      if (service.keywords.some(kw => msg.includes(kw))) {
        return service.response;
      }
    }
    
    return null;
  }

  static _getDefaultResponse() {
    return `📸 **Welcome to Fotographiya**

I'm your professional AI photography assistant. I can provide information about our photography services, packages, GoldenBox technology, and academy.

**Key Points:**
• Wedding and Pre-Wedding Photography
• Corporate and Event Photography
• GoldenBox AI Technology
• Fotographiya Academy

💡 How can I assist you with Fotographiya today?`;
  }
}

// ============================================
// ✅ AI RESPONSE HANDLER
// ============================================
class AIResponseHandler {
  constructor() {
    this.providerClasses = [
      GroqProvider,
      MistralProvider,
      CerebrasProvider,
      GeminiProvider
    ];
  }

  async getAIResponse(userMessage, context) {
    const systemPrompt = PromptBuilder.buildSystemPrompt(context);
    
    for (const ProviderClass of this.providerClasses) {
      try {
        const provider = new ProviderClass();
        const response = await provider.getResponse(userMessage, systemPrompt);
        if (response) {
          console.log(`✅ ${ProviderClass.name} responded successfully!`);
          return ResponseFormatter.formatResponse(response);
        }
      } catch (error) {
        console.log(`⚠️ ${ProviderClass.name} failed:`, error.message);
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