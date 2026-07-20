﻿const { GoogleGenerativeAI } = require("@google/generative-ai");
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
    this.maxMessages = 6; // Keep last 6 messages per session
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
    this.temperature = 0.5; // Lower = more focused/shorter
    this.maxTokens = 200; // ✅ REDUCED from 900 to 200!
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
    this.maxTokens = 200; // ✅ SHORT RESPONSES
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
          temperature: 0.5, // ✅ Lower for concise responses
          max_tokens: 200, // ✅ SHORT!
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
    this.maxTokens = 200; // ✅ SHORT RESPONSES
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
          temperature: 0.5,
          max_tokens: 200, // ✅ SHORT!
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
    this.maxTokens = 200; // ✅ SHORT RESPONSES
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
          temperature: 0.5,
          max_tokens: 200, // ✅ SHORT!
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
    this.maxTokens = 200; // ✅ SHORT RESPONSES
  }

  async getResponse(userMessage, systemPrompt) {
    if (!this.apiKey) return null;

    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          maxOutputTokens: 200, // ✅ SHORT!
          temperature: 0.5,
        },
      });

      const result = await model.generateContent(
        `${systemPrompt}\n\nUSER QUESTION: ${userMessage}\n\nYOUR RESPONSE (2-5 lines only):`,
      );

      return (await result.response).text() || null;
    } catch (error) {
      console.log("⚠️ Gemini Failed:", error.message);
      return null;
    }
  }
}

// ============================================
// ✅ PROMPT BUILDER - SHORT RESPONSE ENFORCED
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
    // ✅ CRITICAL: SHORT RESPONSE INSTRUCTION AT THE TOP
    let basePrompt = `You are Fotographiya's official AI photography assistant. Your primary goal is to provide helpful, concise, and accurate information about Fotographiya's services, packages, and company details.

🚨 **CRITICAL: RESPOND IN EXACTLY 2-5 SHORT LINES. MAXIMUM 5 LINES. BE BRIEF.**

**IMPORTANT INSTRUCTION:**
• **ALWAYS use ALL provided information, including the "RELEVANT SCRAPED INFORMATION (FROM LIVE WEBSITE)" section, to answer the user's question.**
• If the user asks about something not explicitly in the provided data, politely redirect them to "the Fotographiya team".
• NEVER invent information.
• Keep responses CONCISE (2-5 lines maximum).
• Use full sentences.
• Be helpful and positive.
• DO NOT share: photographer count, specific pricing (only general info if available in context), or direct contact details (unless explicitly asked for contact info and it's in the data).
• NEVER say "I don't know", "sorry", "cannot", "unable", "not available".
• NEVER say "as an AI model" or similar self-referential phrases.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**FOTOGRAPHIYA INFORMATION (FROM COMPANY DATA & LIVE WEBSITE)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 **CONVERSATION HISTORY**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${conversationHistory || "No previous conversation."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 **RESPONSE FORMAT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• RESPOND IN EXACTLY 2-5 LINES
• Use full, natural sentences
• Be direct and helpful
• DO NOT use bullet points unless listing packages
• End with a complete thought

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 **WHAT NOT TO SAY**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• NEVER say "I don't know"
• NEVER give pricing
• NEVER say "sorry"
• NEVER say "unable to"`;

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
• Describe the service in 2-3 lines
• NO pricing, NO numbers, NO contact details
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
• Describe the service in 2-3 lines
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
• Example: "Fotographiya offers Pearl, Gold, Platinum, and Diamond packages."
• End with: "Ask me about any specific package! 😊"

**IF SPECIFIC PACKAGE ("Tell me about Pearl"):**
• Give full details (what's included) in 3-4 lines
• NO pricing, NO photographer count
• End with: "For pricing, contact the Fotographiya team."`;

    // ✅ If package data is available, include it explicitly
    const packages = scraperService.getHardcodedPackages ? scraperService.getHardcodedPackages() : {};
    if (packages && Object.keys(packages).length > 0) {
      basePrompt += `\n\n📦 **PACKAGE DATA:**`;
      for (const [key, pkg] of Object.entries(packages)) {
        if (pkg.name && pkg.includes) {
          basePrompt += `\n• ${pkg.name}: ${pkg.includes.join(', ')}`;
        }
      }
    }
    }

    return basePrompt;
  }
}

// ============================================
// ✅ RESPONSE FORMATTER - ENFORCES 2-5 LINES
// ============================================
class ResponseFormatter {
  static formatResponse(text) {
    if (!text) return text;

    let cleanText = text;

    // Remove markdown links
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Remove extra newlines
    cleanText = cleanText.replace(/\n{3,}/g, "\n\n");

    // ✅ Split into sentences
    const sentences = cleanText
      .replace(/\s+\n/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    console.log(`📊 Found ${sentences.length} sentences`);

    // ✅ ENFORCE 2-5 LINES
    let chosen = sentences.slice(0, 5);
    
    // ✅ Ensure at least 2 sentences
    if (chosen.length < 2) {
      const combined = chosen.join(" ");
      if (combined.length > 60) {
        const parts = combined.match(/.{1,60}(?:\s|$)/g) || [combined];
        chosen = parts.slice(0, 5).map(p => p.trim());
      } else if (combined.length > 0) {
        // Add a second sentence if only one
        chosen.push("Contact the Fotographiya team for more details.");
      } else {
        // Completely empty - use fallback
        return "Fotographiya offers premium photography services. Contact the Fotographiya team for more details.";
      }
    }

    // ✅ If too many sentences, take first 5
    if (chosen.length > 5) {
      chosen = chosen.slice(0, 5);
    }

    // ✅ Join with newlines
    let finalText = chosen.join("\n");
    
    // ✅ Ensure each sentence ends with proper punctuation
    finalText = finalText.split("\n").map(line => {
      if (line.trim() && !/[.!?]$/.test(line.trim())) {
        return line.trim() + ".";
      }
      return line.trim();
    }).join("\n");

    // ✅ Final cleanup
    finalText = finalText.replace(/\n{2,}/g, "\n");

    console.log(`📝 Final response: ${finalText.split("\n").length} lines`);
    return finalText;
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

  // ✅ NEW: Force-shorten any response that's too long
  static forceShorten(text, maxLines = 5) {
    if (!text) return text;
    
    const lines = text.split("\n").filter(line => line.trim().length > 0);
    if (lines.length <= maxLines) return text;
    
    // Take only first maxLines lines
    return lines.slice(0, maxLines).join("\n");
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
          // ✅ Format and shorten
          let cleanResponse = ResponseFormatter.formatResponse(response);
          
          // ✅ Force shorten if still too long
          cleanResponse = ResponseFormatter.forceShorten(cleanResponse, 5);
          
          const positiveCheck = ResponseFormatter.ensurePositiveResponse(cleanResponse);
          if (positiveCheck) {
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
    return "Fotographiya offers premium photography services across India. Contact the Fotographiya team for more details.";
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