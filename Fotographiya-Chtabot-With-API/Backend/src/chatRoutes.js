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
          timestamp: new Date().toISOString(),
          dataSource: 'CACHED' // ✅ ADDED
        }
      });
    }

    // 🔥 STEP 2: Check if it's an off-topic question
    if (isOffTopic(message)) {
      return res.json({
        success: true,
        data: {
          message: "I'm a specialized AI assistant for Fotographiya - your premier photography company. I can only help with topics related to our services.",
          timestamp: new Date().toISOString(),
          dataSource: 'CACHED' // ✅ ADDED
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
    
    // ✅ NEW: Get data source from scraper service
    const dataSource = scraperService.dataSource || 'UNKNOWN';

    
    // ✅ Log data source for debugging
    console.log(`📊 Data source: ${dataSource}`);
    
    res.json({ 
      success: true, 
      data: { 
        message: reply,
        timestamp: new Date().toISOString(),
        dataSource: dataSource // ✅ ADDED - Tells frontend if data is LIVE or CACHED
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

// ============================================
// ✅ NEW: SCRAPING STATUS ENDPOINT
// ============================================
router.get('/scrape-status', async (req, res) => {
  try {
    const status = scraperService.getStatus ? scraperService.getStatus() : { 
      message: 'Status method not available' 
    };
    
    const dataSource = scraperService.dataSource || 'UNKNOWN';

    
    res.json({
      success: true,
      data: {
        dataSource: dataSource,
        status: status,
        lastScrape: scraperService.lastScrapeTime || null,
        isScraping: scraperService.isScraping || false,
        pagesScraped: Object.keys(scraperService.scrapedData || {}).length
      }
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scrape status'
    });
  }
});

// ============================================
// ✅ NEW: FORCE SCRAPE ENDPOINT
// ============================================
router.post('/force-scrape', async (req, res) => {
  try {
    console.log('🔄 Force scraping triggered...');
    
    // Check if already scraping
    if (scraperService.isScraping) {
      return res.json({
        success: false,
        message: 'Scraping already in progress. Please wait.'
      });
    }
    
    // Start scraping
    const results = await scraperService.scrapeAllPages();
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;
    
    res.json({
      success: true,
      message: `Scraping completed: ${successCount}/${totalCount} pages scraped successfully`,
      data: {
        totalPages: totalCount,
        successPages: successCount,
        failedPages: totalCount - successCount,
        dataSource: scraperService.dataSource || 'UNKNOWN',
        scrapedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Force scrape error:', error);
    res.status(500).json({
      success: false,
      message: 'Force scraping failed: ' + error.message
    });
  }
});

module.exports = router;