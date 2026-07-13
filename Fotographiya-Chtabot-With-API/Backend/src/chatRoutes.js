const express = require('express');
const router = express.Router();
const { getAIResponse } = require('./services/aiService');
const scraperService = require('./services/scraperService');

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
  return `⚠️ **Specialized Assistance Only**\n\nI'm a specialized AI assistant for Fotographiya - your premier wedding photography company. I can only help with topics related to our services.\n\n💡 What would you like to know about Fotographiya?`;
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
    
    // 🔥 STEP 3: Detect if user wants examples
    const wantsExamplesFlag = wantsExamples(message);
    
    // 🔥 STEP 4: Build context from company data and get AI response
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