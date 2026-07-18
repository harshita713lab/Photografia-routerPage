const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const scraperService = require('./scraperService');
const companyData = require('../data/companyData');

function getGroundingData() {
  const live = (typeof scraperService.getScrapedData === 'function')
    ? scraperService.getScrapedData()
    : (scraperService.scrapedData || {});
  const hasLive = live && Object.keys(live).length > 0;
  return { source: hasLive ? 'LIVE' : 'HARDCODED', data: hasLive ? live : companyData };
}

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

  static get GROQ_API_KEY() {
    return process.env.GROQ_API_KEY;
  }
  static get MISTRAL_API_KEY() {
    return process.env.MISTRAL_API_KEY;
  }
  static get CEREBRAS_API_KEY() {
    return process.env.CEREBRAS_API_KEY;
  }

  static get GROQ_API_URL() {
    return (
      process.env.GROQ_API_URL ||
      "https://api.groq.com/openai/v1/chat/completions"
    );
  }

  static get AI_MODEL() {
    return process.env.AI_MODEL || "llama-3.3-70b-versatile";
  }
}

// ============================================
// ✅ CONVERSATION MEMORY (SESSION-BASED)
// ============================================
class ConversationMemory {
  constructor() {
    this.sessions = new Map();
    this.maxMessages = 10; // Keep last 10 messages per session
  }

  add(sessionId, role, content) {
    if (!sessionId) return;

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }

    const messages = this.sessions.get(sessionId);
    messages.push({ role, content, timestamp: Date.now() });

    // Keep only recent N messages
    if (messages.length > this.maxMessages) {
      messages.splice(0, messages.length - this.maxMessages);
    }
  }

  get(sessionId) {
    if (!sessionId) return [];
    return this.sessions.get(sessionId) || [];
  }

  getHistoryForAI(sessionId) {
    const messages = this.get(sessionId);
    // Format as conversation history for AI context
    return messages
      .map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`)
      .join("\n");
  }

  clear(sessionId) {
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }
}

// ============================================
// ✅ AI PROVIDER BASE CLASS
// ============================================
class AIProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.timeout = 30000;
    this.temperature = 0.7;
    this.maxTokens = 900;
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
      console.log("⚠️ Groq: No API key found");
      return null;
    }

    try {
      const response = await axios.post(
        this.url,
        {
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: this.timeout,
        },
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
            { role: "user", content: userMessage },
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: this.timeout,
        },
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
            { role: "user", content: userMessage },
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: this.timeout,
        },
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
    this.maxTokens = 900;
  }

  async getResponse(userMessage, systemPrompt) {
    if (!this.apiKey) return null;

    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          maxOutputTokens: this.maxTokens,
          temperature: this.temperature,
        },
      });

      const result = await model.generateContent(
        `${systemPrompt}\n\nUSER QUESTION: ${userMessage}\n\nYOUR RESPONSE:`,
      );

      return (await result.response).text() || null;
    } catch (error) {
      console.log("⚠️ Gemini Failed:", error.message);
      return null;
    }
  }
}

// ============================================
// ✅ PROMPT BUILDER - NO NEGATIVE RESPONSES
// ============================================

class PromptBuilder {
  static getShootTypeHeading(type) {
    const headings = {
      baby: "👶 Baby Shoot Photography",
      maternity: "🤰 Maternity Shoot Photography",
      corporate: "🏢 Corporate Event Photography",
      roka: "💍 Roka Ceremony Photography",
      anniversary: "🎉 Anniversary Shoot Photography",
      birthday: "🎂 Birthday Photography",
    };
    return headings[type] || null;
  }

  static buildSystemPrompt(
    context,
    conversationHistory,
    wantsExamples,
    shootType,
    wantsPrice,
    wantsPackage
  ) {
    let basePrompt = `You are Fotographiya's official AI photography assistant. You MUST ALWAYS give positive, helpful responses about Fotographiya.

CRITICAL RULE: NEVER say "I don't know", "sorry", "cannot", "unable", "not available", or any negative response. Always redirect to "the Fotographiya team" for more details.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 **CORE RULES**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **ALLOWED (You CAN share):**
• Team size: Fotographiya has 50+ team members
• Experience: 2+ years (established 2023 by Mohit Barthunia)
• Services: Wedding, pre-wedding, destination, maternity, birthday, roka, corporate
• Locations: All over India (Rajasthan, Delhi, Maharashtra, Goa, etc.)
• GoldenBox: AI-powered photo delivery system
• Academy: Photography courses with internships
• Rating: 4.9/5 | Customers: 200+ happy couples

❌ **RESTRICTED (NEVER share):**
• Number of photographers who will come to any wedding/shoot
• Any pricing, cost, budget, charges, fees
• Specific numbers (hours, photo count, team size breakdown)
• Contact details (phone, WhatsApp, email, links)

🔄 **HOW TO RESPOND TO RESTRICTED QUESTIONS:**
• "Photographers assigned based on your requirements. Contact the Fotographiya team."
• "Fotographiya offers customized packages. Contact the Fotographiya team for pricing."
• "Photo delivery varies by package. Contact the Fotographiya team for details."

📝 **ANSWER STYLE:**\n• Answer in full sentences and natural paragraphs whenever possible.\n• Use longer, richer responses instead of only short phrases.\n• When the user asks for details, provide 2-4 sentences or more.\n• Vary your wording and avoid repeating the same phrasing for repeated questions.\n• Use live website data naturally and cite it when relevant.\n• Only use bullet points when the user specifically requests a short summary.\n\n📌 **BRANDING RULES:**
• Always use "Fotographiya" (NEVER "we", "our", "us")
• Always use "the Fotographiya team" (NEVER "our team")
• NEVER say "I don't know" - always redirect positively
• NEVER give negative or拒绝 responses

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 **CONVERSATION HISTORY**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${conversationHistory || "No previous conversation."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 **COMPANY DATA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${context}

• If the context contains LIVE WEBSITE DATA, use that information first.
• If no LIVE WEBSITE DATA is available, use the fallback company data only when necessary to answer the user.
• Do NOT use hardcoded fallback company data unless the live website data does not answer the user question.
• If no LIVE WEBSITE DATA is available, use the fallback company data carefully.

${wantsExamples ? "• User wants EXAMPLES - provide from COMPANY DATA only" : "• Do NOT list examples unless asked"}`;

    // ==========================================
    // 🎯 SHOOT TYPE
    // ==========================================
    if (shootType) {
      const heading = this.getShootTypeHeading(shootType);
      basePrompt += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **SHOOT TYPE: ${shootType.toUpperCase()}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Heading MUST be: "${heading}"
• Describe the service from COMPANY DATA
• NO pricing, NO numbers, NO contact details
• Max 5 lines
• End with: "Contact the Fotographiya team for more details."`;
    }

    // ==========================================
    // 💰 PRICE QUERY
    // ==========================================
    if (wantsPrice) {
      basePrompt += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 **PRICE QUERY DETECTED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• NEVER give specific price, cost, or numbers
• Describe the service from COMPANY DATA
• Max 4 lines
• End with: "Contact the Fotographiya team for pricing details."`;
    }

    // ==========================================
    // 📦 PACKAGE QUERY
    // ==========================================
    if (wantsPackage) {
      basePrompt += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 **PACKAGE QUERY DETECTED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**IF GENERAL QUESTION ("What packages do you offer?"):**
• ONLY list names: Pearl, Gold, Platinum, Diamond
• NO description, NO includes, NO pricing
• Max 4 lines
• End with: "Ask me about any specific package! 😊"

**IF SPECIFIC PACKAGE ("Tell me about Pearl"):**
• Give full details (what's included)
• NO pricing, NO photographer count
• Max 6 lines
• End with: "For pricing, contact the Fotographiya team."`;
    }

    return basePrompt;
  }
}

// ============================================
// ✅ RESPONSE FORMATTER
// ============================================
// ============================================
// ✅ RESPONSE FORMATTER - ENFORCES 2-5 LINES
// ============================================
class ResponseFormatter {
  static formatResponse(text) {
    if (!text) return text;

    let cleanText = text;

    // Remove markdown links
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Clean up extra spaces
    cleanText = cleanText.replace(/\n{3,}/g, "\n\n");
    cleanText = cleanText.replace(/[ \t]+\n/g, "\n");
    cleanText = cleanText.replace(/\n[ \t]+/g, "\n");

    // Split into sentences
    const sentences = cleanText
      .replace(/\s+\n/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    // ✅ ENFORCE 2-5 LINES
    let chosen = sentences.slice(0, 5);
    
    // ✅ Ensure at least 2 sentences
    if (chosen.length < 2) {
      // Try to split longer sentences
      const combined = chosen.join(" ");
      if (combined.length > 60) {
        const parts = combined.match(/.{1,60}(?:\s|$)/g) || [combined];
        chosen = parts.slice(0, 5).map(p => p.trim());
      } else {
        chosen.push("Contact the Fotographiya team for more details.");
      }
    }

    // ✅ If too many sentences, take first 5
    if (chosen.length > 5) {
      chosen = chosen.slice(0, 5);
    }

    // Present one sentence per line (2-5 lines)
    let finalText = chosen.join("\n");
    
    // ✅ Ensure it ends with proper punctuation
    if (finalText && !/[.!?]$/.test(finalText)) {
      finalText += ".";
    }

    return finalText.trim();
  }

  static ensurePositiveResponse(text) {
    if (!text) return null;

    const negativeChecks = [
      /^I (don't|do not) know/i,
      /^sorry/i,
      /^I (can't|cannot)/i,
      /^(?:i'm )?(?:not |unable )/i,
      /no (?:information|data|results)/i,
    ];

    for (const pattern of negativeChecks) {
      if (pattern.test(text.trim())) {
        console.log("⚠️ Negative response detected, replacing with positive");
        return null;
      }
    }

    return text;
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
      GeminiProvider,
    ];
    this.memory = new ConversationMemory();
  }

  async getAIResponse(
    userMessage,
    context,
    sessionId,
    wantsExamples,
    shootType,
    wantsPrice,
    wantsPackage,
  ) {
    const conversationHistory = this.memory.getHistoryForAI(sessionId);
    const systemPrompt = PromptBuilder.buildSystemPrompt(
      context,
      conversationHistory,
      wantsExamples,
      shootType,
      wantsPrice,
      wantsPackage,
    );

    // Store user message in memory
    this.memory.add(sessionId, "user", userMessage);

    for (const ProviderClass of this.providerClasses) {
      try {
        const provider = new ProviderClass();
        const response = await provider.getResponse(userMessage, systemPrompt);
        if (response) {
          const cleanResponse = ResponseFormatter.formatResponse(response);
          const positiveCheck = ResponseFormatter.ensurePositiveResponse(cleanResponse);
          if (positiveCheck) {
            // Store AI response in memory
            this.memory.add(sessionId, "assistant", positiveCheck);
            return positiveCheck;
          }
          console.log("⚠️ AI response was negative, trying next provider...");
        }
      } catch (error) {
        console.log(`⚠️ ${ProviderClass.name} failed:`, error.message);
      }
    }

    console.log("⚠️ All providers failed. Returning positive fallback response.");
    return `**📸 Fotographiya Photography Services**
Fotographiya offers premium photography and cinematography services across India.
• Wedding, pre-wedding, maternity, birthday, roka, and corporate photography
• Professional team of 50+ creative professionals
• GoldenBox AI-powered instant photo delivery system
• Fotographiya Academy with photography courses

The Fotographiya team would be happy to assist you with personalized information.`;
  }
}

// ============================================
// ✅ EXPORTS
// ============================================
module.exports = {
  getAIResponse: (
    userMessage,
    context,
    sessionId,
    wantsExamples,
    shootType,
    wantsPrice,
    wantsPackage,
  ) => {
    const handler = new AIResponseHandler();
    return handler.getAIResponse(
      userMessage,
      context,
      sessionId,
      wantsExamples,
      shootType,
      wantsPrice,
      wantsPackage,
    );
  },
};

