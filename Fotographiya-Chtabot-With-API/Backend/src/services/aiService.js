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
    this.temperature = 0.3;
    this.maxTokens = 300;
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
// ✅ PROMPT BUILDER - DATA-DRIVEN, NO HARDCODE
// ============================================
// ============================================
// ✅ PROMPT BUILDER - DATA-DRIVEN, NO HARDCODE
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
    wantsPackage,
  ) {
    let basePrompt = `You are Fotographiya's official AI photography assistant.

🚨 **CRITICAL RULES (STRICTLY ENFORCED):**
1. Answer ONLY from COMPANY DATA provided below. NO outside knowledge, NO made-up info.
2. **NEVER say "I don't know", "I don't have that information", or any negative response.**
   - Instead, ALWAYS say: "For more details about this, please contact the Fotographiya team."
   - Or: "The Fotographiya team can provide more information about this."
3. **NEVER mention any NUMBERS** - do NOT say "2 hours", "100 photos", "50 edited photos", "5 photographers", "10+ team" etc.
4. **NEVER mention PRICING/COST** - do NOT say price, cost, budget, charges, fees, amount, kitna, rates
5. **NEVER mention how many photographers come** to any shoot or package
6. **Do NOT give any contact details** - no phone numbers, no WhatsApp links, no email, no links. 
   - Simply say: "please contact the Fotographiya team" or "reach out to the Fotographiya team for details"
7. **Do NOT list examples/couples** unless the user explicitly asks for them.
8. For greetings (hello, hi, hey, namaste) - respond with the SAME greeting.
9. For "how are you" - respond with "I'm doing well! How can I help you with Fotographiya today?"
10. Use emojis naturally.
11. Answer length: MAXIMUM 4-5 lines.
12. **IMPORTANT LANGUAGE RULE:** NEVER use "we", "our", "us" when referring to Fotographiya. Always use "Fotographiya", "Fotographiya team", or "the Fotographiya team". 
    - ❌ WRONG: "We offer wedding photography."
    - ✅ CORRECT: "Fotographiya offers wedding photography."
    - ❌ WRONG: "Contact our team."
    - ✅ CORRECT: "Contact the Fotographiya team."
    - ❌ WRONG: "We don't have that information."
    - ✅ CORRECT: "For more details, please contact the Fotographiya team."
13. **POSITIVE RESPONSE RULE:** Always respond positively. Never say "I don't know", "I can't", "No", "Not available", etc.
    - ❌ WRONG: "I don't have that information."
    - ✅ CORRECT: "The Fotographiya team can provide more details about this."
    - ❌ WRONG: "We don't offer that service."
    - ✅ CORRECT: "For information about that service, please contact the Fotographiya team."

📝 **RESPONSE FORMAT RULES (MUST FOLLOW):**
1. **Start with a SHORT HEADING** (bold) summarizing the topic (max 5-6 words)
2. **Follow with 1-2 sentence summary** explaining the key point
3. **Use bullet points (•) for key details** - maximum 3 bullet points
4. **DO NOT use numbered lists** - only bullet points (•)
5. **NEVER include any specific numbers** in the bullet points

✅ **EXAMPLE OF CORRECT RESPONSE:**
**📸 Wedding Photography Services**
Fotographiya offers professional wedding coverage capturing beautiful moments.
• Professional photography with creative editing
• Coverage of all ceremonies and events
• High-quality edited digital photos delivered via online gallery
For pricing and booking, please contact the Fotographiya team.

✅ **EXAMPLE OF CORRECT POSITIVE RESPONSE WHEN DATA MISSING:**
**📝 About This Query**
The Fotographiya team can provide more detailed information about this.
• Please reach out to the Fotographiya team for specific details
• They will be happy to assist you with your requirements
Contact the Fotographiya team for personalized assistance.

❌ **WRONG RESPONSE (contains "I don't know" or "we"):**
I don't know about that. We offer wedding photography with 2 photographers. Contact our team.

🎯 **SPECIFIC BEHAVIOR RULES:**
1. **PREVIOUS QUESTION CONTEXT:** Always keep the conversation context. Your answer must be related to what was previously discussed.
2. **PRE-WEDDING EXAMPLES:** When giving pre-wedding examples, do NOT mention the location/place/city. Only mention the couple name and style. If the user specifically asks "where was this shoot done?" or "place/batao/kahan hua", then only you can tell the location.
3. **DESTINATION WEDDING EXAMPLES:** Always mention the place/location and venue when giving destination wedding examples.
4. **LOCATIONS (CRITICAL):** When someone asks about wedding locations/places, ALWAYS suggest Rajasthan cities FIRST - **Udaipur, Jaipur, Ajmer, Kumbhalgarh** are top. Then suggest other Indian locations. Fotographiya shoots across ALL of India.
5. **PRE-WEDDING LOCATIONS:** When giving pre-wedding examples, NEVER mention location/place/city. Only mention couple name and style.
6. **BRANDING RULE:** Always refer to the company as "Fotographiya" (not "we", "our", "us"). Always refer to the team as "the Fotographiya team" (not "our team").
7. **POSITIVE RESPONSE RULE:** Never use negative language. Always redirect to the Fotographiya team if information isn't available.

CONVERSATION HISTORY (Previous conversation ke saath relate karo):
${conversationHistory || "No previous conversation."}

COMPANY DATA:
${context}

${wantsExamples ? "NOTE: User is asking for examples. Provide relevant examples from COMPANY DATA only." : "NOTE: Do NOT list examples unless explicitly asked."}`;

    // ===== SHOOT TYPE SPECIFIC INSTRUCTIONS =====
    if (shootType) {
      const heading = this.getShootTypeHeading(shootType);
      basePrompt += `\n\n🚨 **SPECIAL INSTRUCTION FOR THIS QUERY (MANDATORY):**
The user is asking about **${shootType} photography/shoot**.

**YOU MUST FOLLOW THESE RULES:**
1. **The heading/first line of your response MUST BE EXACTLY:** "${heading}"
2. **DO NOT mention any pricing, cost, or package details** for this shoot type.
3. **DO NOT mention any numbers** (no hours, no photo count, no team size).
4. **DO NOT give any contact details** - no phone, no links, no email.
5. Use the COMPANY DATA services section to describe what this service includes.
6. **At the end of your response, simply tell the user to contact the Fotographiya team** for more details.
7. **NEVER say "I don't know" or any negative response** - always redirect positively.`;
    }

    // ===== PRICE/PACKAGE QUERY INSTRUCTIONS =====
    if (wantsPrice) {
      basePrompt += `\n\n🚨 **PRICE QUERY INSTRUCTION (MANDATORY):**
The user is asking about PRICING. 

**YOU MUST:**
1. Describe the service/packages from COMPANY DATA.
2. **NEVER give any specific price, cost, or number.**
3. **Do NOT give any links or contact details.**
4. Simply tell the user to contact the Fotographiya team for pricing.
5. **NEVER say "I don't know"** - say "The Fotographiya team can provide detailed pricing information."`;
    }

    if (wantsPackage) {
  basePrompt += `\n\n🚨 **PACKAGE QUERY INSTRUCTION (MANDATORY):**
The user is asking about PACKAGES.

**IMPORTANT - PACKAGE NAMES ONLY FIRST:**
If the user asks "What packages do you offer?" or similar general package question:
1. **ONLY list the package names** - Pearl, Gold, Platinum, Diamond
2. **DO NOT give any description, details, or includes** at this stage
3. **DO NOT give pricing or numbers**
4. **End with:** "If you'd like to know more about any specific package, just ask me! 😊"

✅ **CORRECT RESPONSE FOR "What packages do you offer?":**
**📦 Packages Offered by Fotographiya**
Fotographiya offers 4 wedding photography packages:
• Pearl Package
• Gold Package
• Platinum Package
• Diamond Package
If you'd like to know more about any specific package, just ask me! 😊

❌ **WRONG RESPONSE (too much detail):**
Fotographiya offers Pearl package with still photography, videography, candid photography...

**IF USER ASKS ABOUT A SPECIFIC PACKAGE:**
1. Give full details about that package
2. List what's included
3. **Give contact number:** +91 9001110144
4. Say: "For pricing and booking, please call or WhatsApp the Fotographiya team at +91 9001110144"

✅ **CORRECT RESPONSE FOR "Tell me about Pearl package":**
**💎 Pearl Package**
The Pearl package includes:
• Still Photography + Videography
• Candid Photography
• Cinematic Coverage
• Drone Shoot
For pricing and booking, please call or WhatsApp the Fotographiya team at +91 9001110144

**RULES:**
1. If user asks generally about packages → ONLY list names
2. If user asks about specific package → Give full details + contact number
3. **NEVER say "I don't know"** - always redirect positively`;
}

    return basePrompt;
  }
}

// ============================================
// ✅ RESPONSE FORMATTER
// ============================================
class ResponseFormatter {
  static formatResponse(text) {
    if (!text) return text;

    let cleanText = text;

    // Remove all markdown links
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Clean up extra spaces
    cleanText = cleanText.replace(/\n{3,}/g, "\n\n");
    cleanText = cleanText.replace(/[ \t]+\n/g, "\n");
    cleanText = cleanText.replace(/\n[ \t]+/g, "\n");

    return cleanText.trim();
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
          // Store AI response in memory
          this.memory.add(sessionId, "assistant", cleanResponse);
          return cleanResponse;
        }
      } catch (error) {
        console.log(`⚠️ ${ProviderClass.name} failed:`, error.message);
      }
    }

    console.log("⚠️ All providers failed");
    // ✅ POSITIVE FALLBACK - No negative responses
    if (context.includes("Fotographiya") || context.includes("fotographiya")) {
      return `**📝 Need Assistance?**
Fotographiya is experiencing high traffic right now. 
• The Fotographiya team is available to help you
• Please try again in a moment or contact the Fotographiya team directly
For immediate assistance, please reach out to the Fotographiya team.`;
    }
    return `**📝 Thank You for Your Interest**
The Fotographiya team will be happy to assist you.
• Please contact the Fotographiya team for personalized support
• They will respond to your query promptly
Reach out to the Fotographiya team for more information.`;
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
