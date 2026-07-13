const express = require('express');
const router = express.Router();
const { getAIResponse } = require('./services/aiService');
const scraperService = require('./services/scraperService');

// ============================================
// ✅ PACKAGE & COST KEYWORDS
// ============================================

const PACKAGE_KEYWORDS = [
  'price', 'cost', 'budget', 'package price', 'how much', 'charges', 'fees',
  'silver package', 'golden package', 'premium package', 'silver pack', 'golden pack', 'premium pack',
  'how many photographers', 'photographer count', 'team size', 'how many people',
  'kitne photographers', 'kitne log aayenge', 'kitna cost', 'kitna charge',
  'silver', 'golden', 'gold', 'premium', 'package', 'packages', 'pricing'
];

function isPackageQuery(message) {
  if (typeof message !== 'string') return false;
  const msg = message.toLowerCase().trim();
  return PACKAGE_KEYWORDS.some(keyword => msg.includes(keyword));
}

function getPackageResponse(message) {
  const msg = message.toLowerCase();
  
  // ============================================
  // 📦 SILVER PACKAGE
  // ============================================
  if (msg.includes('silver')) {
    return `**🥈 Silver Package**

Our Silver package offers essential wedding photography coverage with professional quality.

• Basic wedding coverage with professional photography
• Edited digital photos with color correction
• Online gallery for sharing with family and friends
• Professional photographer for all ceremonies

For detailed pricing and customization options, please contact our team:`;
  }
  
  // ============================================
  // 🥇 GOLDEN PACKAGE
  // ============================================
  if (msg.includes('golden') || msg.includes('gold')) {
    return `**🥇 Golden Package**

Our Golden package provides comprehensive wedding coverage with both photography and cinematography.

• Professional photography covering all wedding events
• Cinematography with cinematic storytelling
• Professional editing and color grading
• Premium photo album and online gallery
• Pre-wedding shoot included

For detailed pricing and customization options, please contact our team`;
  }
  
  // ============================================
  // 💎 PREMIUM PACKAGE
  // ============================================
  if (msg.includes('premium')) {
    return `**💎 Premium Package**

Our Premium package offers the ultimate wedding photography experience with luxury services.

• Complete wedding coverage with multiple photographers
• Cinematography with professional editing
• Drone photography for stunning aerial shots
• Premium leather album and all digital assets
• Pre-wedding and post-wedding shoots included
• Dedicated team for personalized service

For detailed pricing and customization options, please contact our team:`;
  }
  
  // ============================================
  // 👥 TEAM / PHOTOGRAPHER COUNT
  // ============================================
  if (msg.includes('photographer') || msg.includes('team') || msg.includes('people') || 
      msg.includes('log') || msg.includes('kitne') || msg.includes('how many')) {
    return `**👥 Our Team**

We have a talented team of 50+ dedicated professionals at Fotographiya!

• Team includes photographers, cinematographers, editors, and support staff
• 10+ technical experts handling AI, software, and technology
• Each wedding gets a dedicated team based on your requirements

For specific photographer count and package details, please contact us directly:`;
  }
  
  // ============================================
  // 💰 GENERAL PRICE / COST / PACKAGES
  // ============================================
  return `**📦 Our Wedding Packages**

We offer three comprehensive wedding photography packages to suit every need:

**🥈 Silver Package**
Basic wedding coverage with professional photography and edited digital photos.

**🥇 Golden Package**  
Complete coverage with photography, cinematography, and premium album.

**💎 Premium Package**
Luxury experience with multiple photographers, drone coverage, and premium album.

For detailed pricing and package inclusions, please contact our team:
• 📞 Call: +91 9001110144
• 💬 WhatsApp: https://wa.me/919001110144
• 📧 Email: fotographiyaworld@gmail.com`;
}

// ============================================
// ✅ OFF-TOPIC KEYWORDS
// ============================================
const ALLOWED_TOPICS = [
  'fotographiya', 'photography', 'services', 'packages', 'goldenbox', 'academy',
  'wedding', 'pre-wedding', 'destination', 'celebrity', 'team', 'contact',
  'price', 'cost', 'budget', 'portfolio', 'gallery', 'about', 'founder',
  'maternity', 'birthday', 'roka', 'corporate', 'reviews', 'location',
  'instagram', 'facebook', 'youtube', 'linkedin', 'medium', 'reddit', 'pexels',
  'social media', 'social accounts', 'all social', 'silver', 'golden', 'premium', 
  'contact us', 'reach us', 'help', 'support', 'customer care',
  'address', 'studio', 'kota', 'rajasthan', 'where is fotographiya',
  'reviews', 'customer review', 'testimonial', 'feedback',
  'golden box', 'qr photo', 'course', 'training', 'internship',
  'example', 'examples', 'sample', 'samples', 'couples', 'couple',
  'namaste', 'hello', 'hi', 'hey', 'how are you', 'good morning', 'good evening'
];

const OFF_TOPIC_KEYWORDS = [
  'bts', 'kpop', 'ipl', 'cricket', 'movie', 'actor', 'singer', 'song',
  'netflix', 'prime', 'hotstar', 'football', 'prime minister', 'president',
  'modi', 'trump', 'china', 'pakistan', 'anime', 'manga',
  'game of thrones', 'marvel', 'dc', 'hollywood', 'bollywood',
  'tiktok', 'instagram influencer', 'youtube video', 'recipe', 'food',
  'weather', 'news', 'politics', 'sports', 'cricket match'
];

const INTERNATIONAL_KEYWORDS = [
  'bali', 'maldives', 'thailand', 'dubai', 'uae', 'usa', 'uk', 'europe',
  'america', 'canada', 'australia', 'singapore', 'malaysia', 'international',
  'outside india', 'abroad', 'foreign', 'overseas',
  'shoot outside india', 'outside country', 'foreign country', 'other country'
];

// ============================================
// ✅ EXAMPLES DETECTION KEYWORDS
// ============================================
const EXAMPLES_KEYWORDS = [
  'example', 'examples', 'sample', 'samples', 'tell me some', 'show me some',
  'list some', 'name some', 'couples you', 'couple you', 'you cover', 'you shoot',
  'you have done', 'you did', 'portfolio examples', 'show me', 'tell me',
  'what shoots', 'which shoots', 'destination wedding shoot', 'pre wedding shoot',
  'wedding shoot', 'shoot that you cover'
];

// ============================================
// ✅ HELPER FUNCTIONS
// ============================================
function checkKeywords(message, keywords) {
  if (typeof message !== 'string') {
    return false;
  }
  const msg = message.toLowerCase();
  return keywords.some(keyword => msg.includes(keyword));
}

function isOffTopic(message) {
  const msgLower = message.toLowerCase().trim();
  
  const isAllowed = ALLOWED_TOPICS.some(topic => msgLower.includes(topic));
  if (isAllowed) return false;
  
  return OFF_TOPIC_KEYWORDS.some(kw => msgLower.includes(kw));
}

function isInternationalQuestion(message) {
  if (typeof message !== 'string') return false;
  const msg = message.toLowerCase().trim();
  return INTERNATIONAL_KEYWORDS.some(keyword => msg.includes(keyword));
}

function wantsExamples(message) {
  if (typeof message !== 'string') return false;
  const msg = message.toLowerCase().trim();
  return EXAMPLES_KEYWORDS.some(keyword => msg.includes(keyword));
}

function getOffTopicResponse() {
  return `⚠️ **Specialized Assistance Only**

I'm a specialized AI assistant for Fotographiya - your premier wedding photography company. I can only help with topics related to our services.

💡 What would you like to know about Fotographiya?`;
}

// ============================================
// ✅ CHAT MESSAGE ROUTE
// ============================================
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    console.log(`📩 Message: ${message} | Session: ${sessionId || 'N/A'}`);

    // 🔥 STEP 1: Check for international question
    if (isInternationalQuestion(message)) {
      return res.json({
        success: true,
        data: {
          message: "❌ **No International Services**\n\nWe only operate within India. We do not provide photography services outside India.\n\n📍 **Our Coverage:** All Indian states including Rajasthan, Goa, Kerala, Himachal Pradesh, and more.\n\n💡 Would you like to know about our Indian destination wedding packages?",
          timestamp: new Date().toISOString()
        }
      });
    }

    // 🔥 STEP 2: Check if it's an off-topic question
    if (isOffTopic(message)) {
      return res.json({
        success: true,
        data: {
          message: getOffTopicResponse(),
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // 🔥 STEP 3: Check for package/price questions
    if (isPackageQuery(message)) {
      return res.json({
        success: true,
        data: {
          message: getPackageResponse(message),
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // 🔥 STEP 4: Detect if user wants examples
    const wantsExamplesFlag = wantsExamples(message);
    
    // 🔥 STEP 5: Build context from company data and get AI response
    const context = scraperService.buildContextForAI(message, wantsExamplesFlag);
    const reply = await getAIResponse(message, context, sessionId || 'default', wantsExamplesFlag);
    
    res.json({ 
      success: true, 
      data: { 
        message: reply,
        timestamp: new Date().toISOString()
      } 
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process your request.'
    });
  }
});

module.exports = router;