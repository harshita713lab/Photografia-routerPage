// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// ===== ALL YOUR LINKS =====
const LINKS = {
  website: {
    home: 'https://www.fotographiya.com/',
    about: 'https://www.fotographiya.com/about',
    services: 'https://www.fotographiya.com/services',
    wedding: 'https://www.fotographiya.com/services/wedding-photography',
    prewedding: 'https://www.fotographiya.com/services/prewedding-photography',
    destination: 'https://www.fotographiya.com/services/destination-wedding',
    anniversary: 'https://www.fotographiya.com/services/anniversary-photography',
    corporate: 'https://www.fotographiya.com/services/corporate-photography',
    academy: 'https://www.fotographiya.com/fotographiya-academy',
    portfolio: 'https://www.fotographiya.com/portfolio',
    contact: 'https://www.fotographiya.com/contact'
  },
  social: {
    instagram: 'https://www.instagram.com/fotographiya_official/',
    linkedin: 'https://www.linkedin.com/company/fotographiya-the-wedding-photography/',
    facebook: 'https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/',
    youtube: 'https://www.youtube.com/@Fotographiya_official',
    pexels: 'https://www.pexels.com/@fotographiya-wedding-photography-823737813/',
    reddit: 'https://www.reddit.com/user/Foreign-Barracuda340/',
    medium: 'https://medium.com/@fotographiyaworld'
  },
  contact: {
    whatsapp: 'https://api.whatsapp.com/send/?phone=9001110144&text=Hi+Fotographiya%2C+I+want+to+enquire+about+your+photography+packages.&type=phone_number&app_absent=0',
    phone: '+91 9001110144',
    email: 'fotographiyaworld@gmail.com'
  }
};

// ===== SCRAPED DATA STORE =====
let scrapedData = {};

// ===== SCRAPE FUNCTION =====
async function scrapeWebsite(url) {
  try {
    console.log(`📡 Scraping: ${url}`);
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    $('script, style, nav, footer, header, .nav, .menu, .sidebar, .ads').remove();
    
    let content = '';
    $('main, article, .content, .main-content, .page-content, .section, .container').each((i, el) => {
      content += $(el).text().trim() + '\n';
    });
    
    if (!content.trim()) {
      $('body').each((i, el) => {
        content += $(el).text().trim() + '\n';
      });
    }
    
    content = content.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    
    const headings = [];
    $('h1, h2, h3').each((i, el) => {
      headings.push($(el).text().trim());
    });
    
    const lists = [];
    $('ul, ol').each((i, el) => {
      $(el).find('li').each((j, li) => {
        lists.push($(li).text().trim());
      });
    });
    
    return {
      url,
      title,
      description,
      headings: headings.slice(0, 20),
      lists: lists.slice(0, 30),
      content: content.slice(0, 5000)
    };
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    return { url, error: error.message, title: '', description: '', headings: [], lists: [], content: '' };
  }
}

// ===== SCRAPE ALL LINKS =====
async function scrapeAllLinks() {
  console.log('🚀 Starting to scrape all links...');
  for (const [key, url] of Object.entries(LINKS.website)) {
    const data = await scrapeWebsite(url);
    scrapedData[`website_${key}`] = data;
    await new Promise(r => setTimeout(r, 1000));
  }
  for (const [key, url] of Object.entries(LINKS.social)) {
    scrapedData[`social_${key}`] = {
      url,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      description: `Follow Fotographiya on ${key.charAt(0).toUpperCase() + key.slice(1)}`,
      content: `Fotographiya on ${key.charAt(0).toUpperCase() + key.slice(1)}`,
      headings: [],
      lists: []
    };
  }
  scrapedData.contact = {
    whatsapp: LINKS.contact.whatsapp,
    phone: LINKS.contact.phone,
    email: LINKS.contact.email
  };
  console.log('✅ All links scraped successfully!');
  console.log('📊 Total pages scraped:', Object.keys(scrapedData).length);
}

// ===== FIND RELEVANT DATA FROM SCRAPED PAGES =====
function findRelevantData(query) {
  const q = String(query || '').toLowerCase();
  const results = [];
  
  // Keywords mapping for better matching
  const keywordMap = {
    'package': ['packages', 'package', 'pricing', 'price', 'cost', 'budget', 'pakages'],
    'services': ['services', 'service', 'offer', 'occasions', 'what do you offer'],
    'wedding': ['wedding', 'marriage', 'ceremony', 'reception'],
    'prewedding': ['pre-wedding', 'pre wedding', 'engagement'],
    'destination': ['destination', 'outstation', 'travel'],
    'corporate': ['corporate', 'business', 'company event'],
    'anniversary': ['anniversary', 'milestone'],
    'about': ['about', 'mission', 'vision', 'founder', 'mohit'],
    'location': ['location', 'address', 'where', 'studio', 'kota', 'rajasthan'],
    'contact': ['contact', 'phone', 'call', 'email', 'whatsapp'],
    'portfolio': ['portfolio', 'gallery', 'work', 'samples'],
    'academy': ['academy', 'learn', 'training', 'course']
  };
  
  // Find which category matches best
  let matchedCategory = null;
  let highestMatch = 0;
  
  for (const [category, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (q.includes(keyword)) {
        const matchScore = keyword.length;
        if (matchScore > highestMatch) {
          highestMatch = matchScore;
          matchedCategory = category;
        }
      }
    }
  }
  
  // If category matched, get that specific page
  if (matchedCategory) {
    const pageMap = {
      'package': 'services',
      'services': 'services',
      'wedding': 'wedding',
      'prewedding': 'prewedding',
      'destination': 'destination',
      'corporate': 'corporate',
      'anniversary': 'anniversary',
      'about': 'about',
      'location': 'contact',
      'contact': 'contact',
      'portfolio': 'portfolio',
      'academy': 'academy'
    };
    
    const pageKey = pageMap[matchedCategory] || matchedCategory;
    const dataKey = `website_${pageKey}`;
    const data = scrapedData[dataKey];
    
    if (data && data.content) {
      results.push({
        key: dataKey,
        data: data,
        score: 100,
        matched: matchedCategory
      });
    }
  }
  
  // If no category matched or no data found, search all pages
  if (results.length === 0) {
    for (const [key, data] of Object.entries(scrapedData)) {
      if (!data || !data.content) continue;
      
      const contentLower = (data.content + ' ' + data.title + ' ' + data.description).toLowerCase();
      let matchScore = 0;
      
      const words = q.split(' ').filter(w => w.length > 2);
      for (const word of words) {
        if (contentLower.includes(word)) {
          matchScore++;
        }
      }
      
      if (data.headings) {
        for (const heading of data.headings) {
          if (heading.toLowerCase().includes(q) || q.includes(heading.toLowerCase().slice(0, 10))) {
            matchScore += 3;
          }
        }
      }
      
      if (data.lists) {
        for (const item of data.lists) {
          if (item.toLowerCase().includes(q) || q.includes(item.toLowerCase().slice(0, 10))) {
            matchScore += 2;
          }
        }
      }
      
      if (matchScore > 0) {
        results.push({
          key,
          data,
          score: matchScore
        });
      }
    }
  }
  
  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);
  
  return results;
}

// ===== GENERATE RESPONSE FROM SCRAPED DATA =====
function generateResponseFromScrapedData(query) {
  const q = String(query || '').toLowerCase();
  
  // ===== GREETINGS =====
  const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'how are you'];
  for (const g of greetings) {
    if (q.includes(g) && q.length < 20) {
      return "Hello! I am Fotographiya Assistant. How can I help you today?";
    }
  }
  
  // ===== SOCIAL MEDIA =====
  if (q.includes('instagram') || q.includes('insta') || q.includes('ig')) {
    return `[Instagram](https://www.instagram.com/fotographiya_official/)

Follow us for stunning wedding photography, behind-the-scenes content, and daily inspiration.

What would you like to know about Fotographiya?`;
  }
  
  if (q.includes('facebook') || q.includes('fb')) {
    return `[Facebook](https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/)

Like our page for updates, event coverage, and beautiful wedding photography.

What would you like to know about Fotographiya?`;
  }
  
  if (q.includes('youtube') || q.includes('yt')) {
    return `[YouTube](https://www.youtube.com/@Fotographiya_official)

Subscribe for cinematic wedding films, behind-the-scenes videos, and photography tips.

What would you like to know about Fotographiya?`;
  }
  
  if (q.includes('linkedin') || q.includes('linked in')) {
    return `[LinkedIn](https://www.linkedin.com/company/fotographiya-the-wedding-photography/)

Connect for company news, career opportunities, and industry insights.

What would you like to know about Fotographiya?`;
  }
  
  if (q.includes('reddit')) {
    return `[Reddit](https://www.reddit.com/user/Foreign-Barracuda340/)

Join our community for photography discussions and insights.

What would you like to know about Fotographiya?`;
  }
  
  if (q.includes('social media') || q.includes('social links') || q.includes('all social')) {
    return `Connect with Fotographiya on all our social media platforms:

📸 [Instagram](https://www.instagram.com/fotographiya_official/)
👍 [Facebook](https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/)
🎬 [YouTube](https://www.youtube.com/@Fotographiya_official)
💼 [LinkedIn](https://www.linkedin.com/company/fotographiya-the-wedding-photography/)
📷 [Pexels](https://www.pexels.com/@fotographiya-wedding-photography-823737813/)
👋 [Reddit](https://www.reddit.com/user/Foreign-Barracuda340/)
📝 [Medium](https://medium.com/@fotographiyaworld)

What would you like to know about Fotographiya?`;
  }

  // ===== CONTACT =====
  if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('email') || q.includes('whatsapp')) {
    return `Contact Fotographiya:

📱 Call: +91 9001110144
💬 WhatsApp: https://api.whatsapp.com/send/?phone=9001110144&text=Hi+Fotographiya%2C+I+want+to+enquire+about+your+photography+packages.&type=phone_number&app_absent=0
✉️ Email: fotographiyaworld@gmail.com

[Visit Contact Page](https://www.fotographiya.com/contact)

What would you like to know about Fotographiya?`;
  }

  // ===== BEST PHOTOGRAPHER =====
  if (q.includes('best photographer') || q.includes('best wedding photographer') || q.includes('who is the best')) {
    return `Fotographiya is one of India's best wedding photography companies!

Why we are the best:
• 15+ Years of experience
• 53K+ Happy Customers
• 98.29% Satisfaction Rate
• 5 lakhs+ photos delivered
• 200+ event shoots
• Award-winning team (Nakshatra, Dainik Angad, Jeeto Marathon)
• Professional, creative, and passionate photographers

[Learn More About Us](https://www.fotographiya.com/about)

What would you like to know about Fotographiya?`;
  }

  // ===== SEARCH SCRAPED DATA =====
  const relevantData = findRelevantData(query);
  
  if (relevantData.length > 0) {
    let response = '';
    const topData = relevantData.slice(0, 2); // Take top 2 matches
    
    for (const item of topData) {
      const data = item.data;
      const key = item.key;
      let pageName = key.replace('website_', '').charAt(0).toUpperCase() + key.replace('website_', '').slice(1);
      
      // Clean page name
      if (pageName === 'Prewedding') pageName = 'Pre-Wedding';
      if (pageName === 'Services') pageName = 'Services & Packages';
      
      response += `${pageName}\n`;
      response += `${'='.repeat(pageName.length)}\n\n`;
      
      // Add headings
      if (data.headings && data.headings.length > 0) {
        response += `${data.headings.slice(0, 5).join('\n')}\n\n`;
      }
      
      // Add lists
      if (data.lists && data.lists.length > 0) {
        const relevantLists = data.lists.slice(0, 15);
        for (const item of relevantLists) {
          response += `• ${item}\n`;
        }
        response += '\n';
      }
      
      // Add content summary
      if (data.content) {
        const contentSnippet = data.content.slice(0, 600);
        response += `${contentSnippet}\n\n`;
      }
      
      response += `[Visit ${pageName} Page](${data.url})\n\n`;
    }
    
    response += 'What would you like to know about Fotographiya?';
    return response;
  }

  // ===== DEFAULT =====
  return `I can help with questions about Fotographiya!

Here's what I can tell you about:
• [About Us](https://www.fotographiya.com/about)
• [Services](https://www.fotographiya.com/services)
• [Wedding Photography](https://www.fotographiya.com/services/wedding-photography)
• [Pre-Wedding Photography](https://www.fotographiya.com/services/prewedding-photography)
• [Destination Wedding](https://www.fotographiya.com/services/destination-wedding)
• [Packages & Pricing](https://www.fotographiya.com/services)
• [Contact Us](https://www.fotographiya.com/contact)

What would you like to know about Fotographiya?`;
}

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Fotographiya ChatBot API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    scrapedPages: Object.keys(scrapedData).length
  });
});

// ===== CHAT ROUTE =====
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    console.log(`📝 User asked: "${message}"`);
    const response = generateResponseFromScrapedData(message);

    res.status(200).json({
      success: true,
      data: {
        message: response,
        sessionId: sessionId || 'session_' + Date.now(),
        timestamp: new Date(),
        model: 'scraped-data-assistant'
      }
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message'
    });
  }
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ===== START =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await scrapeAllLinks();
  console.log('✅ Ready to answer questions from scraped data!');
});

module.exports = app;