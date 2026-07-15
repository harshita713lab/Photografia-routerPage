const express = require('express');
const router = express.Router();
const { getAIResponse } = require('./services/aiService');
const scraperService = require('./services/scraperService');

// ============================================
// ✅ SHOOT TYPE DETECTION (for AI context)
// ============================================

const SHOOT_TYPE_KEYWORDS = {
  baby: ['baby shoot', 'baby photo', 'baby photography', 'newborn', 'infant', 'baby photoshoot'],
  maternity: ['maternity', 'maternity shoot', 'maternity photo', 'pregnancy shoot', 'expecting mother', 'pregnancy photo'],
  corporate: ['corporate', 'corporate event', 'corporate shoot', 'business event', 'company event', 'conference', 'corporate photography'],
  roka: ['roka', 'roka shoot', 'roka ceremony', 'roka photography', 'roka photo', 'engagement ceremony'],
  anniversary: ['anniversary', 'anniversary shoot', 'anniversary photo', 'anniversary photography', 'wedding anniversary'],
  birthday: ['birthday', 'birthday shoot', 'birthday party', 'birthday photo', 'birthday photography', 'kids birthday', 'cake smash']
};

function detectShootType(message) {
  if (typeof message !== 'string') return null;
  const msg = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(SHOOT_TYPE_KEYWORDS)) {
    if (keywords.some(kw => msg.includes(kw))) {
      return type;
    }
  }
  return null;
}

// ============================================
// ✅ PACKAGE / PRICE DETECTION (flag for AI)
// ============================================

function isPriceQuery(message) {
  if (typeof message !== 'string') return false;
  const msg = message.toLowerCase().trim();
  const priceKeywords = ['price', 'cost', 'budget', 'how much', 'charges', 'fees', 'kitna', 'pricing', 'rate', 'rates', 'amount'];
  return priceKeywords.some(keyword => msg.includes(keyword));
}

function isPackageQuery(message) {
  if (typeof message !== 'string') return false;
  const msg = message.toLowerCase().trim();
  const packageKeywords = ['silver package', 'golden package', 'premium package', 'silver pack', 'golden pack', 'premium pack', 'silver', 'golden', 'gold', 'premium', 'package', 'packages'];
  return packageKeywords.some(keyword => msg.includes(keyword));
}

// ============================================
// ✅ OFF-TOPIC KEYWORDS (Only truly unrelated topics)
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
  'namaste', 'hello', 'hi', 'hey', 'how are you', 'good morning', 'good evening',
  'baby', 'newborn', 'anniversary', 'conference', 'event', 'baby shower',
  'pregnancy', 'expecting', 'corporate event', 'business', 'company',
  'roka ceremony', 'engagement', 'wedding anniversary', 'cake smash'
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
// ✅ HELPER FUNCTIONS
// ============================================
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
          message: "We only operate within India. We do not provide photography services outside India.",
          timestamp: new Date().toISOString()
        }
      });
    }

    // 🔥 STEP 2: Check if it's an off-topic question
    if (isOffTopic(message)) {
      return res.json({
        success: true,
        data: {
          message: "I'm a specialized AI assistant for Fotographiya - your premier photography company. I can only help with topics related to our services.",
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // 🔥 STEP 3: Detect flags for AI
    const shootType = detectShootType(message);
    const wantsPrice = isPriceQuery(message);
    const wantsPackage = isPackageQuery(message);
    
    // 🔥 STEP 4: Build context from company data and get AI response
    const context = scraperService.buildContextForAI(message, false, shootType);
    const reply = await getAIResponse(message, context, sessionId || 'default', false, shootType, wantsPrice, wantsPackage);
    
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