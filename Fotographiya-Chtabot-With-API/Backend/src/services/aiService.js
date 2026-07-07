const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// ============================================
// ✅ CHECK API KEYS
// ============================================
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not found in .env file");
}

// ============================================
// ✅ INITIALIZE PROVIDERS
// ============================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

// ============================================
// ✅ SYSTEM PROMPT BUILDER (STRICT RULES)
// ===========================================
function buildSystemPrompt(context) {
  return `
You are Fotographiya's official AI photography assistant.

⚠️ **IMPORTANT RULES:**
1. Keep responses UNDER 120 words
2. Use SHORT paragraphs (2-3 sentences each)
3. Use bullet points (•) for lists
4. Be direct - no fluff words
5. For links, ALWAYS use format: [Text](URL)

**RESPONSE STRUCTURE:**
• Start with a brief 1-sentence intro
• Use bullet points for key information
• End with 1-sentence question

**EXAMPLE RESPONSE:**
---
Fotographiya offers wedding, pre-wedding, and corporate photography services.

Our packages include:
• Silver - Basic wedding coverage
• Golden - Full wedding + video
• Premium - Complete wedding + destination

Want to see our portfolio? [View Gallery](https://www.fotographiya.com/portfolio)
---

**IMPORTANT:** The example above shows EXACTLY how to format links.

COMPANY CONTEXT:
${context}
`;
}
// ============================================
// ✅ FALLBACK RESPONSE (Off-Topic)
// ============================================
function getFallbackResponse(userMessage) {
  // Check if it's a greeting
  const greetings = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "namaste",
  ];
  if (greetings.some((g) => userMessage.toLowerCase().includes(g))) {
    return `Hello! 👋 I am Fotographiya's AI Assistant. I'm here to help you with information about our photography services, packages, GoldenBox, academy, and portfolio.\n\nWhat would you like to know about Fotographiya?`;
  }

  // Check if it's about something outside Fotographiya
  const offTopicKeywords = [
    "bts",
    "kpop",
    "ipl",
    "cricket",
    "movie",
    "actor",
    "singer",
    "song",
    "netflix",
    "prime",
    "football",
    "prime minister",
    "president",
    "modi",
    "trump",
    "china",
    "pakistan",
  ];
  if (offTopicKeywords.some((kw) => userMessage.toLowerCase().includes(kw))) {
    return `I can only help with questions about Fotographiya, our photography services, packages, GoldenBox, academy, and portfolio.\n\nWhat would you like to know about Fotographiya?`;
  }

  // Default fallback
  return `I'm Fotographiya's AI Assistant! I can only help with questions about Fotographiya — our photography services, packages, GoldenBox, academy, and portfolio.\n\nFor immediate assistance, please contact us at +91 9001110144.\n\nWhat would you like to know about Fotographiya?`;
}

// ============================================
// ✅ PROVIDER: GROQ
// ============================================
async function getGroqResponse(userMessage, systemPrompt) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return null;
    }

    const response = await axios.post(
      process.env.GROQ_API_URL ||
        "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
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

// ============================================
// ✅ PROVIDER: MISTRAL
// ============================================
async function getMistralResponse(userMessage, systemPrompt) {
  try {
    if (!process.env.MISTRAL_API_KEY) {
      return null;
    }

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    const content = response.data.choices?.[0]?.message?.content;
    if (content) {
      console.log("✅ Mistral Response Success!");
      return content;
    }
    return null;
  } catch (error) {
    console.log("⚠️ Mistral Failed:", error.message);
    return null;
  }
}

// ============================================
// ✅ PROVIDER: CEREBRAS
// ============================================
async function getCerebrasResponse(userMessage, systemPrompt) {
  try {
    if (!process.env.CEREBRAS_API_KEY) {
      return null;
    }

    const response = await axios.post(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        model: "llama-3.3-70b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    const content = response.data.choices?.[0]?.message?.content;
    if (content) {
      console.log("✅ Cerebras Response Success!");
      return content;
    }
    return null;
  } catch (error) {
    console.log("⚠️ Cerebras Failed:", error.message);
    return null;
  }
}

// ============================================
// ✅ PROVIDER: GEMINI
// ============================================
async function getGeminiResponse(userMessage, systemPrompt) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 150, // ✅ Short & accurate
        temperature: 0.2,
      },
    });

    const prompt = `
${systemPrompt}

USER QUESTION: ${userMessage}

YOUR RESPONSE:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (text) {
      console.log("✅ Gemini Response Success!");
      return text;
    }
    return null;
  } catch (error) {
    console.log("⚠️ Gemini Failed:", error.message);
    return null;
  }
}

// ============================================
// ✅ MAIN FUNCTION - TRY ALL PROVIDERS
// ============================================
async function getAIResponse(userMessage, context) {
  // Build system prompt with strict rules
  const systemPrompt = buildSystemPrompt(context);

  // 1. Try Groq
  let response = await getGroqResponse(userMessage, systemPrompt);
  if (response) return response;

  // 2. Try Mistral
  response = await getMistralResponse(userMessage, systemPrompt);
  if (response) return response;

  // 3. Try Cerebras
  response = await getCerebrasResponse(userMessage, systemPrompt);
  if (response) return response;

  // 4. Try Gemini
  response = await getGeminiResponse(userMessage, systemPrompt);
  if (response) return response;

  // 5. Final Fallback
  console.log("⚠️ All providers failed, using fallback");
  return getFallbackResponse(userMessage);
}

module.exports = { getAIResponse };
