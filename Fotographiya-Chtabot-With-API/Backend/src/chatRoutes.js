const express = require('express');
const router = express.Router();
const { getAIResponse } = require('./services/aiService');
const scraperService = require('./services/scraperService');

// ✅ Correctly import companyData from the relative path
const companyData = require('./data/companyData');
// ============================================
// ✅ WEDDING KEYWORDS (CATEGORIZED)
// ============================================
const CELEBRITY_WEDDING_KEYWORDS = [
  'celebrity wedding', 'celebrity weddings', 'famous wedding', 'famous weddings',
  'best wedding', 'best weddings', 'royal wedding', 'royal weddings',
  'anubhav dubey', 'ayushi pandey', 'rahul sharma', 'priya singh',
  'vikram mehta', 'ananya reddy', 'arjun kapoor', 'meera nair',
  'karan malhotra', 'riya gupta', 'amit patel', 'sneha desai',
];

const FEATURED_WEDDING_KEYWORDS = [
  'yash and sakshi', 'prabal and rani', 'rohan and kavya',
  'siddharth and nisha', 'aditya and pooja', 'vivek and swati',
  'yash sakshi', 'prabal rani', 'featured wedding',
];

const PRE_WEDDING_KEYWORDS = [
  'harshita and nilanshi', 'harshita nilanshi', 'kunal and sana',
  'ankit and divya', 'nikhil and anjali', 'raj and priyanka',
  'manish and neha', 'pre wedding', 'pre-wedding', 'prewedding',
  'pre wedding shoot', 'pre-wedding shoot', 'examples of pre wedding',
];

const DESTINATION_WEDDING_KEYWORDS = [
  'divyanshu and kuntal', 'divyanshu kuntal', 'raja and rani',
  'virat and anushka', 'dhruv and kashish', 'samarth and ishita',
  'gaurav and megha', 'destination wedding', 'destination weddings',
  'kumbhalgarh wedding', 'jaisalmer wedding', 'goa wedding', 'udaipur wedding', 
  'jaipur wedding', 'destination wedding couples', 'where do you shoot for destination wedding',
];

const GENERAL_WEDDING_KEYWORDS = [
  'wedding photography', 'wedding portfolio', 'our weddings',
  'best wedding photographer', 'wedding gallery', 'wedding couple',
  'we have done wedding', 'we shot wedding', 'wedding coverage', 'shaadi', 'marriage'
];

const TEAM_KEYWORDS = [
  'employees', 'team', 'members', 'staff', 'how many members', 
  'how many employees', 'your team', 'team members'
];

// ============================================
// ✅ OFF-TOPIC KEYWORDS - SIRF EK BAAR
// ============================================
const OFF_TOPIC_KEYWORDS = [
  'bts', 'kpop', 'ipl', 'cricket', 'movie', 'actor', 'singer', 'song',
  'netflix', 'prime', 'hotstar', 'football', 'prime minister', 'president',
  'modi', 'trump', 'china', 'pakistan', 'usa', 'uk', 'russia',
  'anime', 'manga', 'game of thrones', 'marvel', 'dc', 'hollywood',
  'bollywood', 'tiktok', 'instagram influencer', 'youtube'
];

// ============================================
// ✅ INTERNATIONAL KEYWORDS - SIRF EK BAAR
// ============================================
const INTERNATIONAL_KEYWORDS = [
  'bali', 'maldives', 'thailand', 'dubai', 'uae', 'usa', 'uk', 'europe',
  'america', 'canada', 'australia', 'singapore', 'malaysia', 'international',
  'outside india', 'abroad', 'foreign', 'overseas', 'international wedding',
  'shoot outside india', 'photography outside india', 'do you shoot outside',
  'outside country', 'foreign country', 'other country'
];

// ============================================
// ✅ FUNCTIONS
// ============================================
function checkKeywords(message, keywords) {
  const msg = message.toLowerCase();
  return keywords.some(keyword => msg.includes(keyword));
}

function getWeddingResponseType(message) {
  if (checkKeywords(message, CELEBRITY_WEDDING_KEYWORDS)) {
    return 'celebrity';
  }
  if (checkKeywords(message, DESTINATION_WEDDING_KEYWORDS)) {
    return 'destination';
  }
  if (checkKeywords(message, PRE_WEDDING_KEYWORDS)) {
    return 'pre-wedding';
  }
  if (checkKeywords(message, FEATURED_WEDDING_KEYWORDS) || checkKeywords(message, GENERAL_WEDDING_KEYWORDS)) {
    return 'general';
  }
  return null;
}

function isOffTopic(message) {
  const msg = message.toLowerCase();
  return OFF_TOPIC_KEYWORDS.some(keyword => msg.includes(keyword));
}

function isInternationalQuestion(message) {
  const msg = message.toLowerCase();
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

    console.log(`📩 Message: ${message}`);

    // 🔥 STEP 1: Check if it's about international services
    if (isInternationalQuestion(message)) {
      return res.json({
        success: true,
        data: {
          message: "❌ **No International Services**\n\nWe only operate within India. We do not provide photography services outside India.\n\n📍 **Our Coverage:** All Indian states including Rajasthan, Goa, Kerala, Himachal Pradesh, and more.\n\n💡 Would you like to know about our Indian destination wedding packages?",
          timestamp: new Date().toISOString()
        }
      });
    }

    // 🔥 NEW: Check for team/employee questions
    if (checkKeywords(message, TEAM_KEYWORDS)) {
      const teamData = companyData.team || {};
      const responseText = `👥 **Our Team**\n\nFotographiya has a team of ${teamData.total || '50+'} dedicated professionals working together to deliver exceptional photography services.\n\n` +
      `• **Production Team:** ${teamData.roles?.length > 0 ? 'Includes Lead Photographers, Cinematographers, and Editors.' : '10+ members'}\n` +
      `• **Tech Team:** ${teamData.roles?.some(r => r.includes('AI')) ? 'Includes AI Engineers and Software Developers for innovations like GoldenBox.' : '10+ members'}\n` +
      `• **Operations & Management:** Ensures smooth project execution and client satisfaction.\n\n` +
      `💡 Would you like to know more about our founder or the services we offer?`;

      return res.json({
        success: true,
        data: {
          message: responseText,
          timestamp: new Date().toISOString()
        }
      });
    }

    // 🔥 STEP 2: Check for specific wedding questions
    const weddingType = getWeddingResponseType(message);
    if (weddingType) {
      const weddings = companyData.weddings || {};
      let responseText = '';

      if (weddingType === 'celebrity' && weddings.celebrity?.featured?.length > 0) {
        responseText = "🌟 **Celebrity Weddings**\n\nHere are some of the famous weddings we've captured:\n\n";
        weddings.celebrity.featured.slice(0, 3).forEach(w => {
          responseText += `• **${w.couple}** in ${w.location}\n`;
        });
        responseText += "\n💡 Ask for 'celebrity weddings' to see more details!";

      } else if (weddingType === 'destination' && weddings.destination?.length > 0) {
        responseText = "🏖️ **Destination Weddings**\n\nWe specialize in destination weddings across India. Here are a few examples:\n\n";
        weddings.destination.slice(0, 3).forEach(w => {
          responseText += `• **${w.couple}** in ${w.location}\n`;
        });
        responseText += "\n💡 We cover many beautiful locations. Where are you planning yours?";

      } else if (weddingType === 'pre-wedding' && weddings.prewedding?.length > 0) {
        responseText = "💕 **Pre-Wedding Shoots**\n\nOur pre-wedding shoots are all about capturing your unique love story. Here are some examples:\n\n";
        weddings.prewedding.slice(0, 3).forEach(w => {
          responseText += `• **${w.couple}** in ${w.location}\n`;
        });
        responseText += "\n💡 Interested in a pre-wedding shoot? We can suggest some great concepts!";

      } else { // General wedding question
        responseText = "💍 **Our Wedding Portfolio**\n\nWe have had the privilege of capturing beautiful love stories. Here are a few highlights:\n\n";
        
        if (weddings.celebrity?.featured?.[0]) {
          const w = weddings.celebrity.featured[0];
          responseText += `🌟 **Celebrity:** ${w.couple} in ${w.location}\n`;
        }
        if (weddings.featured?.[0]) {
          const w = weddings.featured[0];
          responseText += `📸 **Featured:** ${w.couple} in ${w.location}\n`;
        }
        if (weddings.destination?.[0]) {
          const w = weddings.destination[0];
          responseText += `🏖️ **Destination:** ${w.couple} in ${w.location}\n`;
        }
        if (weddings.prewedding?.[0]) {
          const w = weddings.prewedding[0];
          responseText += `💕 **Pre-Wedding:** ${w.couple} in ${w.location}\n`;
        }
        responseText += "\n💡 You can ask for 'celebrity weddings', 'destination weddings', or 'pre-wedding shoots' to see more specific examples!";
      }

      return res.json({
        success: true,
        data: {
          message: responseText,
          timestamp: new Date().toISOString()
        }
      });
    }

    // 🔥 STEP 3: Check if it's an off-topic question
    if (isOffTopic(message)) {
      return res.json({
        success: true,
        data: {
          message: "I can only help with questions about Fotographiya, our photography services, packages, GoldenBox, academy, and portfolio. What would you like to know about Fotographiya?",
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // 🔥 STEP 4: Get AI response
    const context = scraperService.buildContextForAI(message);
    const reply = await getAIResponse(message, context);
    
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