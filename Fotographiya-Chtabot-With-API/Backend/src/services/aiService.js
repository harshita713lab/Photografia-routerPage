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
// ✅ REMOVE MARKDOWN FROM AI RESPONSE
// ============================================
function removeMarkdown(text) {
  if (!text) return text;
  
  // Remove **bold** → plain text
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Remove *italic* → plain text
  text = text.replace(/\*(.*?)\*/g, '$1');
  
  // Remove __underline__ → plain text
  text = text.replace(/__(.*?)__/g, '$1');
  
  // Remove # headers
  text = text.replace(/^#+\s*/gm, '');
  
  // Clean up extra spaces
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// ============================================
// ✅ SYSTEM PROMPT BUILDER (STRICT RULES)
// ============================================
function buildSystemPrompt(context) {
  return `
You are Fotographiya's official AI photography assistant.

CRITICAL RULES:
1. NEVER use **bold** or *italic* formatting - use plain text only
2. Keep responses UNDER 120 words
3. ONLY use bullet points (•) for LISTS of multiple items
4. NEVER start a response with a bullet point
5. NEVER end a response with a bullet point
6. ALWAYS provide a description FIRST, then the link

BULLET POINT RULES:
• Use bullet points ONLY when listing 2+ items
• Example: "Our services include:
  • Wedding Photography
  • Pre-Wedding Photography
  • Corporate Photography"
• DO NOT use bullet points for single items
• DO NOT use bullet points for introductory sentences
• DO NOT use bullet points for questions

RESPONSE STRUCTURE:
• Step 1: Brief description in plain text (no bullet points)
• Step 2: Relevant link (no bullet points)
• Step 3: Question (no bullet points)

EXAMPLE FOR "contact":
---
Fotographiya provides multiple ways to connect with us for inquiries, bookings, or support. Our team is available via phone, email, and our website contact form.

[Contact Us](https://www.fotographiya.com/contact)

Need assistance with booking or have questions about our services?
---

EXAMPLE FOR "social media":
---
Fotographiya maintains active social media accounts across multiple platforms to showcase our photography, engage with clients, and share updates. Our content includes wedding highlights, behind-the-scenes, and photography tips.

Follow us on:
• [Instagram](https://www.instagram.com/fotographiya_official/)
• [Facebook](https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/)
• [YouTube](https://www.youtube.com/@Fotographiya_official)

Want to see more of our work on social media?
---

COMPANY CONTEXT:
${context}
`;
}

// ============================================
// ✅ FALLBACK RESPONSE (Off-Topic)
// ============================================
function getFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  // ===== SERVICE-SPECIFIC RESPONSES =====
  if (msg.includes('pre wedding') || msg.includes('prewedding')) {
    return `We offer pre-wedding photography services for couples. Our team captures romantic moments at beautiful locations with professional editing and creative direction.

[Pre-Wedding Photography](https://www.fotographiya.com/services/prewedding-photography)

Want to see our [Portfolio](https://www.fotographiya.com/portfolio)?`;
  }

  if (msg.includes('wedding')) {
    return `We offer comprehensive wedding photography services covering all ceremonies - from pre-wedding rituals to the reception. Our team captures candid moments, traditional portraits, and cinematic videos.

[Wedding Photography](https://www.fotographiya.com/services/wedding-photography)

Want to see our [Portfolio](https://www.fotographiya.com/portfolio)?`;
  }

  if (msg.includes('history') || msg.includes('founder') || msg.includes('established') || msg.includes('about')) {
    return `Fotographiya was founded in 2023 by Mohit Barthunia in Kota, Rajasthan, India. We specialize in wedding, pre-wedding, destination, anniversary, and corporate photography, blending traditional artistry with modern technology.

With 100+ happy couples and a 50+ member team, we're one of India's most tech-driven photography companies.

[About Us](https://www.fotographiya.com/about)

Want to know more about our journey?`;
  }

  if (msg.includes('portfolio') || msg.includes('gallery')) {
    return `Our portfolio showcases 100+ weddings and events we've captured with love and creativity.

[View Portfolio](https://www.fotographiya.com/portfolio)

Want to see our [Instagram](https://www.instagram.com/fotographiya_official/) for more?`;
  }

  // ===== TEAM =====
  if (msg.includes('team') || msg.includes('employee') || msg.includes('staff') || msg.includes('people')) {
    return `Fotographiya has a team of 50+ professionals across multiple departments:

• Production Team: 10+ members
• Tech Team: 10+ members
• Operations Team: 20+ members
• Management: 5+ members
• Sales Team: 3+ members
• Digital Marketing: 3+ members

Our team includes Wedding Photographers, Cinematographers, Drone Operators, Photo/Video Editors, Album Designers, Customer Support, Software Developers, and AI Specialists.

Want to know more about our team?`;
  }

  // ===== GREETINGS =====
  const greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "namaste"];
  if (greetings.some((g) => msg.includes(g))) {
    return `Hello! 👋 I am Fotographiya's AI Assistant. I'm here to help you with information about our photography services, packages, GoldenBox, academy, and portfolio.

What would you like to know about Fotographiya?`;
  }

  // ===== OFF-TOPIC =====
  const offTopicKeywords = ["bts", "kpop", "ipl", "cricket", "movie", "actor", "singer", "song", "netflix", "prime", "football", "prime minister", "president", "modi", "trump", "china", "pakistan"];
  if (offTopicKeywords.some((kw) => msg.includes(kw))) {
    return `I can only help with questions about Fotographiya, our photography services, packages, GoldenBox, academy, and portfolio.

What would you like to know about Fotographiya?`;
  }

  // ===== DEFAULT =====
  return `I'm Fotographiya's AI Assistant! I can only help with questions about Fotographiya — our photography services, packages, GoldenBox, academy, and portfolio.

For immediate assistance, please contact us at +91 9001110144.

What would you like to know about Fotographiya?`;
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
        maxOutputTokens: 150,
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
  const systemPrompt = buildSystemPrompt(context);

  // 1. Try Groq
  let response = await getGroqResponse(userMessage, systemPrompt);
  if (response) return removeMarkdown(response);

  // 2. Try Mistral
  response = await getMistralResponse(userMessage, systemPrompt);
  if (response) return removeMarkdown(response);

  // 3. Try Cerebras
  response = await getCerebrasResponse(userMessage, systemPrompt);
  if (response) return removeMarkdown(response);

  // 4. Try Gemini
  response = await getGeminiResponse(userMessage, systemPrompt);
  if (response) return removeMarkdown(response);

  // 5. Final Fallback
  console.log("⚠️ All providers failed, using fallback");
  return getFallbackResponse(userMessage);
}

module.exports = { getAIResponse };