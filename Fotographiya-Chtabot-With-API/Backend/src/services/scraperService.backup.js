// Backend/src/services/scraperService.js
// ========================================
// HYBRID SCRAPER - LIVE DATA + HARDCODED FALLBACK
// ========================================

const axios = require('axios');
const cheerio = require('cheerio');
const companyData = require('../data/companyData');

class ScraperService {
  constructor() {
    this.scrapedData = {};
    this.isScraping = false;
    this.lastScrapeTime = null;
  }

  // ===== companyData.js se saare page URLs lo =====
  getAllPageUrls() {
    const urls = [];
    
    for (const [key, url] of Object.entries(companyData.pages)) {
      if (url && typeof url === 'string' && url.startsWith('http')) {
        urls.push({ key, url });
      }
    }
    
    if (companyData.links && Array.isArray(companyData.links)) {
      for (const url of companyData.links) {
        if (url && typeof url === 'string' && url.startsWith('http')) {
          const exists = urls.some(u => u.url === url);
          if (!exists) {
            urls.push({ key: `link_${urls.length}`, url });
          }
        }
      }
    }
    
    return urls;
  }

  // ===== EK PAGE SCRAPE KARO (LIVE DATA) =====
  async scrapePage(url, key) {
    try {
      console.log(`🌐 Scraping LIVE: ${key} - ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      $('script, style, nav, footer, header, .nav, .menu, .sidebar, .ads, .popup, .cookie-banner').remove();

      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';

      const headings = [];
      $('h1, h2, h3').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 0) headings.push(text);
      });

      const paragraphs = [];
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) paragraphs.push(text);
      });

      const listItems = [];
      $('li').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 10) listItems.push(text);
      });

      let content = '';
      $('main, article, .content, .main-content, .page-content, .section, .container, body').each((i, el) => {
        content += $(el).text().trim() + '\n';
      });
      content = content.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

      return {
        key,
        url,
        success: true,
        title,
        metaDescription,
        headings: headings.slice(0, 20),
        paragraphs: paragraphs.slice(0, 30),
        listItems: listItems.slice(0, 30),
        content: content.slice(0, 5000),
        scrapedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error(`❌ Error scraping ${key}:`, error.message);
      return {
        key,
        url,
        success: false,
        error: error.message,
        title: '',
        metaDescription: '',
        headings: [],
        paragraphs: [],
        listItems: [],
        content: ''
      };
    }
  }

  // ===== SAARE PAGES SCRAPE KARO =====
  async scrapeAllPages() {
    if (this.isScraping) {
      console.log('⏳ Scraping already in progress...');
      return this.scrapedData;
    }

    this.isScraping = true;
    console.log('🔄 Starting LIVE website scrape...');

    const pageUrls = this.getAllPageUrls();
    const results = {};

    const concurrency = 2;
    for (let i = 0; i < pageUrls.length; i += concurrency) {
      const chunk = pageUrls.slice(i, i + concurrency);
      const promises = chunk.map(({ key, url }) => this.scrapePage(url, key));
      const chunkResults = await Promise.all(promises);
      
      chunkResults.forEach(result => {
        results[result.key] = result;
      });
    }

    this.scrapedData = results;
    this.lastScrapeTime = new Date();
    this.isScraping = false;

    const successCount = Object.values(results).filter(r => r.success).length;
    console.log(`✅ LIVE scraped ${successCount}/${Object.keys(results).length} pages successfully!`);
    
    return results;
  }

  // ===== SCRAPED DATA GET KARO =====
  getScrapedData() {
    return this.scrapedData;
  }

  // ================================================
  // 🔍 SEARCH IN LIVE DATA (SCRAPED)
  // ================================================
  searchInScrapedData(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const [key, data] of Object.entries(this.scrapedData)) {
      if (!data.success) continue;

      const matches = [];
      
      if (data.content && data.content.toLowerCase().includes(queryLower)) {
        const idx = data.content.toLowerCase().indexOf(queryLower);
        const snippet = data.content.substring(
          Math.max(0, idx - 60), 
          Math.min(data.content.length, idx + 120)
        );
        matches.push({ type: 'content', snippet: snippet.trim() });
      }

      for (const heading of data.headings || []) {
        if (heading.toLowerCase().includes(queryLower)) {
          matches.push({ type: 'heading', snippet: heading });
        }
      }

      for (const para of data.paragraphs || []) {
        if (para.toLowerCase().includes(queryLower)) {
          const idx = para.toLowerCase().indexOf(queryLower);
          const snippet = para.substring(
            Math.max(0, idx - 40), 
            Math.min(para.length, idx + 80)
          );
          matches.push({ type: 'paragraph', snippet: snippet.trim() });
        }
      }

      for (const item of data.listItems || []) {
        if (item.toLowerCase().includes(queryLower)) {
          matches.push({ type: 'list', snippet: item });
        }
      }

      if (matches.length > 0) {
        results.push({
          page: key,
          url: data.url,
          title: data.title || key,
          source: 'LIVE (Scraped)',
          matches: matches.slice(0, 5)
        });
      }
    }

    return results;
  }

  // ================================================
  // 📦 SEARCH IN HARDCODED DATA (companyData.js)
  // ================================================
  
  // ================================================
// 📦 SEARCH IN HARDCODED DATA (IMPROVED)
// ================================================
searchInHardcodedData(query) {
  const queryLower = query.toLowerCase().trim();
  const results = [];
  const allMatches = [];

  // 🔍 RECURSIVE SEARCH FUNCTION
  function searchInObject(obj, path = '') {
    if (!obj) return;
    
    if (typeof obj === 'string') {
      if (obj.toLowerCase().includes(queryLower)) {
        allMatches.push({
          path: path,
          value: obj.slice(0, 200)
        });
      }
      return;
    }
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        searchInObject(item, `${path}[${index}]`);
      });
      return;
    }
    
    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        searchInObject(value, path ? `${path}.${key}` : key);
      }
    }
  }

  // 📦 COMPANY DATA MEIN SEARCH KARO
  searchInObject(companyData);

  if (allMatches.length > 0) {
    // Group matches by category
    const groupedMatches = {};
    for (const match of allMatches) {
      const category = match.path.split('.')[0] || 'general';
      if (!groupedMatches[category]) groupedMatches[category] = [];
      groupedMatches[category].push(match);
    }

    // Results mein add karo
    for (const [category, matches] of Object.entries(groupedMatches)) {
      const categoryNames = {
        company: '🏢 Company Info',
        team: '👥 Team',
        packages: '📦 Packages',
        services: '🎯 Services',
        goldenBox: '✨ GoldenBox',
        academy: '🎓 Academy',
        about: '📖 About Us',
        booking: '📋 Booking',
        payment: '💳 Payment',
        portfolio: '🖼️ Portfolio',
        faq: '❓ FAQ',
        testimonials: '⭐ Testimonials',
        socialMedia: '📱 Social Media'
      };

      results.push({
        page: 'hardcoded',
        url: companyData.website || 'https://www.fotographiya.com',
        title: `Fotographiya - ${categoryNames[category] || category}`,
        source: 'HARDCODED (Fallback)',
        matches: matches.slice(0, 5).map(m => ({
          type: 'content',
          snippet: m.value
        }))
      });
    }
  }

  return results;
}

  // ================================================
  // 🎯 HYBRID SEARCH - LIVE FIRST, THEN HARDCODED
  // ================================================
  searchHybrid(query) {
    // STEP 1: LIVE DATA MEIN SEARCH
    let liveResults = this.searchInScrapedData(query);
    
    if (liveResults.length > 0) {
      console.log(`✅ Found ${liveResults.length} results in LIVE data`);
      return liveResults;
    }

    // STEP 2: HARDCODED DATA MEIN SEARCH (Fallback)
    console.log(`⚠️ No live data found, searching hardcoded data...`);
    let hardcodedResults = this.searchInHardcodedData(query);
    
    if (hardcodedResults.length > 0) {
      console.log(`✅ Found ${hardcodedResults.length} results in HARDCODED data`);
      return hardcodedResults;
    }

    // STEP 3: Kuch nahi mila
    console.log(`❌ No data found in live or hardcoded`);
    return [];
  }

  // ================================================
  // 🧠 BUILD AI CONTEXT - HYBRID APPROACH
  // ================================================
  // ================================================
// 🧠 BUILD AI CONTEXT - HYBRID APPROACH
// ================================================
buildContextForAI(userMessage) {
  const query = userMessage.toLowerCase();
  const contextParts = [];

  // ===== PART 1: BASIC INFO (Always from Hardcoded) =====
  const c = companyData.company;
  contextParts.push(`🏢 COMPANY: ${c.name}`);
  contextParts.push(`📍 Location: ${c.location}`);
  contextParts.push(`📞 Phone: ${c.phone}`);
  contextParts.push(`📧 Email: ${c.email}`);
  contextParts.push(`🌐 Website: [Fotographiya Website](${c.website})`);
  contextParts.push(`👤 Founder: ${c.founder}`);
  contextParts.push(`📅 Established: ${c.established}`);
  contextParts.push(`⭐ Rating: ${c.rating || "4.6/5"}`);
  contextParts.push(`👥 Customers: ${c.customers || "100+ Happy Couples"}`);

  // ===== PART 2: SOCIAL MEDIA (Hardcoded) =====
  if (companyData.socialMedia) {
    contextParts.push("\n📱 SOCIAL MEDIA:");
    const platformNames = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      reddit: 'Reddit',
      medium: 'Medium',
      pexels: 'Pexels'
    };
    for (const [platform, data] of Object.entries(companyData.socialMedia)) {
      const url = data.url || data;
      const name = platformNames[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
      contextParts.push(`• ${name}: [${name}](${url})`);
    }
  }

  // ===== PART 3: PAGE LINKS (Hardcoded) =====
  contextParts.push("\n🔗 ALL PAGE LINKS:");
  const pageNames = {
    home: 'Homepage',
    about: 'About Us',
    services: 'Our Services',
    wedding: 'Wedding Photography',
    prewedding: 'Pre-Wedding Photography',
    destination: 'Destination Wedding',
    anniversary: 'Anniversary Photography',
    corporate: 'Corporate Photography',
    academy: 'Fotographiya Academy',
    portfolio: 'Portfolio Gallery',
    contact: 'Contact Us'
  };
  for (const [key, url] of Object.entries(companyData.pages)) {
    const name = pageNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
    contextParts.push(`• ${name}: [${name}](${url})`);
  }

  // ===== PART 4: SPECIAL GOLDEN BOX CONTEXT =====
  const goldenBoxKeywords = ["golden box", "goldenbox", "gb", "qr photo", "instant photo"];
  const isGoldenBoxQuery = goldenBoxKeywords.some(
    (kw) => query.includes(kw) || kw.includes(query)
  );

  if (isGoldenBoxQuery) {
    contextParts.push("\n✨ GOLDENBOX DETAILS:");
    const gb = companyData.goldenBox;
    if (gb) {
      contextParts.push(`Description: ${gb.description || "AI-powered photo delivery system"}`);
      if (gb.features) {
        contextParts.push(`Features: ${gb.features.join(", ")}`);
      }
      if (gb.aiPowered) {
        contextParts.push(`AI Powered: ${gb.aiPowered}`);
      }
      if (gb.steps) {
        contextParts.push(
          `How it works: ${gb.steps.capture || "Capture"} → ${gb.steps.processing || "AI Processing"} → ${gb.steps.qrDisplay || "QR Display"} → ${gb.steps.download || "Download"}`
        );
      }
    }
  }

  // ===== PART 5: HYBRID SEARCH - LIVE FIRST, THEN HARDCODED =====
  const searchResults = this.searchHybrid(query);

  if (searchResults.length > 0) {
    const source = searchResults[0].source || "UNKNOWN";
    contextParts.push(`\n📄 SEARCH RESULTS (Source: ${source}):`);

    for (const result of searchResults.slice(0, 4)) {
      contextParts.push(`\n--- ${result.page?.toUpperCase() || "INFO"} ---`);
      if (result.url) {
        const pageName = pageNames[result.page] || result.page;
        contextParts.push(`URL: [${pageName}](${result.url})`);
      }
      if (result.title) contextParts.push(`Title: ${result.title}`);
      if (result.source) contextParts.push(`Source: ${result.source}`);

      for (const match of result.matches?.slice(0, 3) || []) {
        if (match.type === "heading") {
          contextParts.push(`📌 ${match.snippet}`);
        } else if (match.type === "list") {
          contextParts.push(`• ${match.snippet}`);
        } else if (match.type === "package") {
          contextParts.push(`📦 ${match.name}: ${match.details}`);
        } else if (match.type === "service") {
          contextParts.push(`🎯 ${match.name}: ${match.details}`);
        } else if (match.type === "faq") {
          contextParts.push(`❓ ${match.name}: ${match.details}`);
        } else {
          contextParts.push(`📝 ${match.snippet || match.details}`);
        }
      }
    }
  } else {
    contextParts.push("\n📄 No specific data found for this query.");
    contextParts.push("Please ask about our services, packages, academy, or portfolio.");
  }

  return contextParts.join("\n");
}

  // ===== STATUS =====
  getStatus() {
    const total = Object.keys(this.scrapedData).length;
    const success = Object.values(this.scrapedData).filter(r => r.success).length;
    return {
      totalPages: total,
      successPages: success,
      failedPages: total - success,
      lastScrape: this.lastScrapeTime,
      isScraping: this.isScraping
    };
  }
}

module.exports = new ScraperService();