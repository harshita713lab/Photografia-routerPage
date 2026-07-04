// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

if (!GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY not found in .env file!');
  process.exit(1);
}

console.log('✅ API Key found');

// ===== COMPANY CONTEXT =====
const COMPANY_CONTEXT = `
You are Fotographiya's professional AI Assistant. You ONLY answer about Fotographiya.

=== COMPANY INFO ===
Name: Fotographiya (India's Best Wedding Photography Company)
Location: Kota, Rajasthan, India
Phone: +91 9001110144
Email: fotographiyaworld@gmail.com
Website: https://www.fotographiya.com
WhatsApp: https://api.whatsapp.com/send/?phone=9001110144

Founder: Mohit Barthunia
Experience: 15+ years | Happy Customers: 53K+ | Satisfaction: 98.29%

=== SERVICES ===
• Wedding Photography
• Pre-Wedding Photography
• Destination Wedding Photography
• Anniversary Photography
• Corporate Photography
• AI GoldenBox
• Custom Luxury Albums
• Same Day Reels (Reelographer)
• QR Services
• Caricatures

=== PACKAGES ===
• 1 Day Pre-Wedding: ₹35,000
• 1 Day Wedding: ₹75,000 - ₹99,999
• 2 Day Wedding: ₹1,50,000
• 3 Day Wedding: ₹2,25,000

=== SOCIAL MEDIA (ALL LINKS) ===
[Instagram](https://www.instagram.com/fotographiya_official/)
[Facebook](https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/)
[YouTube](https://www.youtube.com/@Fotographiya_official)
[LinkedIn](https://www.linkedin.com/company/fotographiya-the-wedding-photography/)
[Pexels](https://www.pexels.com/@fotographiya-wedding-photography-823737813/)
[Reddit](https://www.reddit.com/user/Foreign-Barracuda340/)
[Medium](https://medium.com/@fotographiyaworld)

=== RESPONSE RULES ===
1. For SERVICES: 2-3 lines friendly intro → Bullet points (ONLY service names) → Links → "What would you like to know about Fotographiya?"
2. For PACKAGES: 2-3 lines friendly intro → Bullet points with prices → Links → "What would you like to know about Fotographiya?"
3. For SOCIAL MEDIA: "Connect with us on social media! 📱" → [Instagram](link) [Facebook](link) [YouTube](link) [LinkedIn](link) [Pexels](link) [Reddit](link) [Medium](link) → "What would you like to know about Fotographiya?"
4. For GREETINGS: 1-2 lines welcome → "What would you like to know about Fotographiya?"
5. For OFF-TOPIC: "I can only help with questions about Fotographiya." → "What would you like to know about Fotographiya?"
6. For SPECIFIC service: 2-3 lines detail → [Service Link](URL) → "What would you like to know about Fotographiya?"
7. ALL links MUST be in [Text](URL) format to be clickable
8. Keep professional and friendly tone
9. ONLY answer what is asked - no extra information

=== EXAMPLES ===

User: "What services do you offer?"
Response:
"We offer a range of professional photography services at Fotographiya! 📸

• Wedding Photography
• Pre-Wedding Photography
• Destination Wedding Photography
• Anniversary Photography
• Corporate Photography
• AI GoldenBox
• Custom Luxury Albums
• Same Day Reels

[View All Services](https://www.fotographiya.com/services)

What would you like to know about Fotographiya?"

User: "Social media links"
Response:
"Connect with us on social media! 📱

[Instagram](https://www.instagram.com/fotographiya_official/)
[Facebook](https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/)
[YouTube](https://www.youtube.com/@Fotographiya_official)
[LinkedIn](https://www.linkedin.com/company/fotographiya-the-wedding-photography/)
[Pexels](https://www.pexels.com/@fotographiya-wedding-photography-823737813/)
[Reddit](https://www.reddit.com/user/Foreign-Barracuda340/)
[Medium](https://medium.com/@fotographiyaworld)

What would you like to know about Fotographiya?"

User: "Hello"
Response:
"Hey there! 👋 Welcome to Fotographiya! How can I help you with your photography needs today?

What would you like to know about Fotographiya?"

User: "Tell me about wedding photography"
Response:
"Wedding photography is our specialty at Fotographiya! We provide full day coverage with candid + traditional styles, cinematic film, and drone shots. Our team captures every precious moment. 🎉

[View Wedding Photography](https://www.fotographiya.com/services/wedding-photography)

What would you like to know about Fotographiya?"
`;

// ===== CHAT API =====
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    console.log(`📝 User: "${message}"`);

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: COMPANY_CONTEXT },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 400,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ AI Response received');

    let aiResponse = response.data.choices[0].message.content;
    aiResponse = formatResponseFinal(aiResponse);

    res.json({
      success: true,
      data: {
        message: aiResponse,
        sessionId: sessionId || 'session_' + Date.now(),
        timestamp: new Date(),
        model: response.data.model
      }
    });

  } catch (error) {
    console.error('❌ AI Error:', error.message);
    
    let userMessage = "Hey there! 😊 I'm having trouble connecting. Please try again!";
    
    if (error.response?.status === 403) {
      userMessage = "Oops! 😅 Technical difficulty. Please contact us:\n\n📱 Call: +91 9001110144\n💬 WhatsApp: https://api.whatsapp.com/send/?phone=9001110144";
    }

    res.status(500).json({
      success: false,
      message: 'AI service error',
      data: {
        message: userMessage,
        timestamp: new Date()
      }
    });
  }
});

// ===== FORMATTING FUNCTION =====
function formatResponseFinal(response) {
  let lines = response.split('\n');
  
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  const textLines = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip question line (will add at end)
    if (trimmedLine.toLowerCase().includes('what would you like to know about fotographiya')) {
      continue;
    }
    
    // Extract links
    if (trimmedLine.match(linkRegex)) {
      let match;
      while ((match = linkRegex.exec(trimmedLine)) !== null) {
        links.push(`[${match[1]}](${match[2]})`);
      }
    } else {
      // Skip raw URLs and empty lines
      if (trimmedLine.length > 0 && !trimmedLine.match(/^https?:\/\//)) {
        textLines.push(trimmedLine);
      }
    }
  }
  
  // Build response
  let finalResponse = textLines.join('\n').trim();
  
  // Add links if any (each on new line)
  if (links.length > 0) {
    const uniqueLinks = [...new Set(links)];
    finalResponse += '\n\n' + uniqueLinks.join('\n');
  }
  
  // Add question at the end
  finalResponse += '\n\nWhat would you like to know about Fotographiya?';
  
  // Clean up extra blank lines
  finalResponse = finalResponse.replace(/\n{3,}/g, '\n\n');
  
  return finalResponse;
}

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    model: MODEL,
    apiKeySet: !!GROQ_API_KEY
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 AI Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using model: ${MODEL}`);
  console.log(`✅ API Key: ${GROQ_API_KEY ? 'Set ✅' : '❌ Missing!'}`);
});