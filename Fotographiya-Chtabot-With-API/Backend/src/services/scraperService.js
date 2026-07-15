// Backend/src/services/scraperService.js
// ========================================
// HYBRID SCRAPER - LIVE DATA + HARDCODED FALLBACK
// ========================================

const axios = require("axios");
const cheerio = require("cheerio");
const companyData = require("../data/companyData");
const puppeteerScraper = require("./puppeteerScraper");

// ✅ DEBUG - Check if companyData loaded
console.log("📦 companyData loaded in scraperService:", !!companyData);
console.log("🏢 companyData.company exists:", !!companyData?.company);

class ScraperService {
  constructor() {
    this.scrapedData = {};
    this.isScraping = false;
    this.lastScrapeTime = null;
  }

  // ================================================
  // 🔍 SCRAPED DATA GET KARO
  // ================================================
  getScrapedData() {
    return this.scrapedData;
  }

  // ===== companyData.js se saare page URLs lo =====
  getAllPageUrls() {
    const urls = [];

    const pages = companyData.pages || {};
    for (const [key, url] of Object.entries(pages)) {
      if (url && typeof url === "string" && url.startsWith("http")) {
        urls.push({ key, url });
      }
    }

    const links = companyData.links || [];
    if (Array.isArray(links)) {
      for (const url of links) {
        if (url && typeof url === "string" && url.startsWith("http")) {
          const exists = urls.some((u) => u.url === url);
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
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);
      $(
        "script, style, nav, footer, header, .nav, .menu, .sidebar, .ads, .popup, .cookie-banner",
      ).remove();

      const title = $("title").text().trim();
      const metaDescription =
        $('meta[name="description"]').attr("content") || "";

      const headings = [];
      $("h1, h2, h3").each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 0) headings.push(text);
      });

      const paragraphs = [];
      $("p").each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) paragraphs.push(text);
      });

      const listItems = [];
      $("li").each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 10) listItems.push(text);
      });

      let content = "";
      $(
        "main, article, .content, .main-content, .page-content, .section, .container, body",
      ).each((i, el) => {
        content += $(el).text().trim() + "\n";
      });
      content = content
        .replace(/\s+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

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
        scrapedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ Error scraping ${key}:`, error.message);
      return {
        key,
        url,
        success: false,
        error: error.message,
        title: "",
        metaDescription: "",
        headings: [],
        paragraphs: [],
        listItems: [],
        content: "",
      };
    }
  }

  // ===== SAARE PAGES SCRAPE KARO =====
  async scrapeAllPages() {
    if (this.isScraping) {
      console.log("⏳ Scraping already in progress...");
      return this.scrapedData;
    }

    // 🔥 TRY PUPPETEER FIRST
    console.log("🔄 Trying Puppeteer scraper...");
    try {
      const puppeteerResults = await puppeteerScraper.scrapeAllPages();

      const successCount = Object.values(puppeteerResults).filter(
        (r) => r.success === true,
      ).length;

      if (successCount > 0) {
        console.log(`✅ Puppeteer scraped ${successCount} pages successfully!`);
        this.scrapedData = puppeteerResults;
        this.lastScrapeTime = new Date();
        this.isScraping = false;
        return this.scrapedData;
      } else {
        console.log("⚠️ Puppeteer scraped 0 pages, falling back to Cheerio...");
      }
    } catch (error) {
      console.log("⚠️ Puppeteer failed:", error.message);
      console.log("🔄 Falling back to Cheerio...");
    }

    // 🟡 FALLBACK: Purana Cheerio scraper use karo
    console.log("🔄 Starting Cheerio website scrape (fallback)...");

    this.isScraping = true;
    const pageUrls = this.getAllPageUrls();
    const results = {};

    const concurrency = 2;
    for (let i = 0; i < pageUrls.length; i += concurrency) {
      const chunk = pageUrls.slice(i, i + concurrency);
      const promises = chunk.map(({ key, url }) => this.scrapePage(url, key));
      const chunkResults = await Promise.all(promises);

      chunkResults.forEach((result) => {
        results[result.key] = result;
      });
    }

    this.scrapedData = results;
    this.lastScrapeTime = new Date();
    this.isScraping = false;

    const successCount = Object.values(results).filter((r) => r.success).length;
    console.log(
      `✅ Cheerio scraped ${successCount}/${Object.keys(results).length} pages successfully!`,
    );

    return results;
  }

  // ================================================
  // 🔍 SMART SEARCH
  // ================================================
  normalizeQuery(query) {
    return query
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[^\w\s]/g, "");
  }

  textMatchesQuery(text, query) {
    if (!text) return false;

    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    if (textLower.includes(queryLower)) return true;

    const queryNoSpace = queryLower.replace(/\s/g, "");
    const textNoSpace = textLower.replace(/\s/g, "");
    if (textNoSpace.includes(queryNoSpace)) return true;

    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
    if (queryWords.length >= 2) {
      let matchCount = 0;
      for (const word of queryWords) {
        if (textLower.includes(word)) matchCount++;
      }
      if (matchCount >= Math.ceil(queryWords.length / 2)) return true;
    }

    return false;
  }

  // ================================================
  // 🔍 SEARCH IN LIVE DATA
  // ================================================
searchInScrapedData(query) {
  const queryLower = query.toLowerCase();
  const results = [];
  
  for (const [key, data] of Object.entries(this.scrapedData)) {
    if (!data.success) continue;
    
    const matches = [];
    
    // Content search
    if (data.content && this.textMatchesQuery(data.content, query)) {
      const idx = data.content.toLowerCase().indexOf(queryLower);
      const snippet = data.content.substring(
        Math.max(0, idx - 60),
        Math.min(data.content.length, idx + 120)
      );
      matches.push({ type: "content", snippet: snippet.trim() });
    }
    
    // Headings search
    for (const heading of data.headings || []) {
      if (this.textMatchesQuery(heading, query)) {
        matches.push({ type: "heading", snippet: heading });
      }
    }
    
    if (matches.length > 0) {
      results.push({
        page: key,
        title: data.title || key,
        source: "LIVE (Scraped)",
        matches: matches.slice(0, 5)
      });
    }
  }
  
  return results;
}

  // ================================================
  // 📦 SEARCH IN HARDCODED DATA
  // ================================================
  searchInHardcodedData(query) {
    const queryLower = query.toLowerCase().trim();
    const results = [];
    const allMatches = [];

    // Golden Box special check
    const goldenBoxKeywords = [
      "golden box", "goldenbox", "gb", "qr photo", "instant photo"
    ];
    const isGoldenBoxQuery = goldenBoxKeywords.some(
      (kw) => queryLower.includes(kw) || kw.includes(queryLower),
    );

    const goldenBox = companyData.goldenBox || {};
    if (isGoldenBoxQuery && Object.keys(goldenBox).length > 0) {
      let content = `📦 GOLDENBOX\n`;
      content += `Description: ${goldenBox.description || "AI-powered photo delivery system"}\n`;
      if (goldenBox.features) {
        content += `Features: ${goldenBox.features.join(", ")}\n`;
      }
      if (goldenBox.aiPowered) {
        content += `AI Powered: ${goldenBox.aiPowered}\n`;
      }
      if (goldenBox.steps) {
        content += `How it works: Capture → AI Processing → QR Display → Download\n`;
      }

      return [{
        page: "goldenbox",
        title: "GoldenBox - AI Photo Delivery System",
        source: "HARDCODED (Golden Box Direct)",
        matches: [{
          type: "content",
          snippet: content.slice(0, 400),
        }, ],
      }, ];
    }

    // RECURSIVE SEARCH
    function searchInObject(obj, path = "") {
      if (!obj) return;

      if (typeof obj === "string") {
        if (obj.toLowerCase().includes(queryLower)) {
          allMatches.push({
            path: path,
            value: obj.slice(0, 200),
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

      if (typeof obj === "object") {
        for (const [key, value] of Object.entries(obj)) {
          if (key.toLowerCase().includes(queryLower)) {
            allMatches.push({
              path: path ? `${path}.${key}` : key,
              value: `[KEY: ${key}] ${JSON.stringify(value).slice(0, 100)}`,
            });
          }
          searchInObject(value, path ? `${path}.${key}` : key);
        }
      }
    }

    searchInObject(companyData);

    if (allMatches.length > 0) {
      const groupedMatches = {};
      for (const match of allMatches) {
        const category = match.path.split(".")[0] || "general";
        if (!groupedMatches[category]) groupedMatches[category] = [];
        groupedMatches[category].push(match);
      }

      for (const [category, matches] of Object.entries(groupedMatches)) {
        const categoryNames = {
          company: "🏢 Company Info",
          team: "👥 Team",
          packages: "📦 Packages",
          services: "🎯 Services",
          goldenBox: "✨ GoldenBox",
          academy: "🎓 Academy",
          about: "📖 About Us",
          booking: "📋 Booking",
          payment: "💳 Payment",
          portfolio: "🖼️ Portfolio",
          faq: "❓ FAQ",
          testimonials: "⭐ Testimonials",
          socialMedia: "📱 Social Media",
        };

        results.push({
          page: "hardcoded",
          title: `Fotographiya - ${categoryNames[category] || category}`,
          source: "HARDCODED (Fallback)",
          matches: matches.slice(0, 5).map((m) => ({
            type: "content",
            snippet: m.value,
          })),
        });
      }
    }

    return results;
  }

  // ================================================
  // 🎯 HYBRID SEARCH
  // ================================================
searchHybrid(query) {
  let liveResults = this.searchInScrapedData(query);
  
  // Remove URLs
  for (const result of liveResults) {
    delete result.url;
  }
  
  if (liveResults.length > 0) {
    console.log(`✅ Found ${liveResults.length} results in LIVE data`);
    return liveResults;
  }
  
  let hardcodedResults = this.searchInHardcodedData(query);
  
  // Remove URLs
  for (const result of hardcodedResults) {
    delete result.url;
  }
  
  return hardcodedResults;
}

  // ================================================
  // 🧠 BUILD AI CONTEXT - DATA-DRIVEN, NO HARDCODE
  // ================================================
  buildContextForAI(userMessage, wantsExamples, shootType) {
    const query = userMessage.toLowerCase();
    const contextParts = [];
    
    // ===== PART 1: COMPANY INFO (ALWAYS INCLUDED) =====
    const c = companyData.company || {};
    contextParts.push(`🏢 COMPANY: ${c.name || 'Fotographiya'}`);
    contextParts.push(`📍 Location: ${c.location || 'Kota, Rajasthan, India'}`);
    contextParts.push(`📞 Phone: ${c.phone || '+91 9001110144'}`);
    contextParts.push(`📧 Email: ${c.email || 'fotographiyaworld@gmail.com'}`);
    contextParts.push(`👤 Founder: ${c.founder || 'Mohit Barthunia'}`);
    contextParts.push(`📅 Established: ${c.established || '2023'}`);
    contextParts.push(`⭐ Rating: ${c.rating || '4.6/5'}`);
    contextParts.push(`👫 Customers: ${c.customers || '100+ Happy Couples'}`);
    
    // ===== PART 2: SERVICES (ALWAYS INCLUDED) =====
    const services = companyData.services || {};
    contextParts.push("\n🎯 SERVICES:");
    if (services.wedding) contextParts.push(`• Wedding Photography: ${services.wedding.description}`);
    if (services.prewedding) contextParts.push(`• Pre-Wedding Photography: ${services.prewedding.description}`);
    if (services.destination) contextParts.push(`• Destination Wedding: ${services.destination.description}`);
    if (services.corporate) contextParts.push(`• Corporate Photography: ${services.corporate.description}`);
    if (services.maternity) contextParts.push(`• Maternity Photography: ${services.maternity.description}`);
    if (services.birthday) contextParts.push(`• Birthday Photography: ${services.birthday.description}`);
    if (services.roka) contextParts.push(`• Roka Ceremony Photography: ${services.roka.description}`);
    
    // ===== PART 3: DIVERSE LOCATIONS GUIDE (ALWAYS INCLUDED FOR CONTEXT) =====
    const weddingsData = companyData.weddings || {};
    const topLoc = weddingsData.topLocations || {};
    contextParts.push("\n📍 TOP INDIAN DESTINATIONS (Suggest Rajasthan cities FIRST when users ask about wedding locations):");
    if (topLoc.rajasthan) contextParts.push("🔥 Rajasthan (Top): " + topLoc.rajasthan.join(", "));
    if (topLoc.northIndia) contextParts.push("🏔️ North India: " + topLoc.northIndia.join(", "));
    if (topLoc.westIndia) contextParts.push("🌊 West India: " + topLoc.westIndia.join(", "));
    if (topLoc.southIndia) contextParts.push("🌴 South India: " + topLoc.southIndia.join(", "));
    if (topLoc.eastNortheast) contextParts.push("🌿 East & Northeast: " + topLoc.eastNortheast.join(", "));
    if (topLoc.note) contextParts.push("📌 Note: " + topLoc.note);
    
    // ===== PART 4: PACKAGES (ALWAYS INCLUDED) =====
    const packages = companyData.packages || {};
    contextParts.push("\n📦 PACKAGES:");
    if (packages.silver) contextParts.push(`• Silver: ${packages.silver.includes}`);
    if (packages.golden) contextParts.push(`• Golden: ${packages.golden.includes}`);
    if (packages.premium) contextParts.push(`• Premium: ${packages.premium.includes}`);
    
    // ===== PART 5: GOLDEN BOX (ALWAYS INCLUDED) =====
    const goldenBox = companyData.goldenBox || {};
    if (Object.keys(goldenBox).length > 0) {
      contextParts.push("\n✨ GOLDENBOX:");
      contextParts.push(`Description: ${goldenBox.description}`);
      if (goldenBox.features) {
        contextParts.push(`Features: ${goldenBox.features.join(", ")}`);
      }
      if (goldenBox.aiPowered) {
        contextParts.push(`AI: ${goldenBox.aiPowered}`);
      }
    }

    // ===== PART 6: ACADEMY (ALWAYS INCLUDED) =====
    const academy = companyData.academy || {};
    if (Object.keys(academy).length > 0) {
      contextParts.push("\n🎓 ACADEMY:");
      contextParts.push(`Tagline: ${academy.tagline || ''}`);
      contextParts.push(`Description: ${academy.description}`);
      if (academy.courses) {
        contextParts.push(`Courses: ${academy.courses.join(", ")}`);
      }
    }

    // ===== PART 7: TEAM INFO (ALWAYS INCLUDED) =====
    const team = companyData.team || {};
    if (Object.keys(team).length > 0) {
      contextParts.push("\n👥 TEAM:");
      contextParts.push(`Total: ${team.total || '50+'} members`);
      if (team.roles) {
        contextParts.push(`Roles: ${team.roles.join(", ")}`);
      }
    }

    // ===== PART 8: SOCIAL MEDIA (ALWAYS INCLUDED) =====
    const socialMedia = companyData.socialMedia || {};
    if (Object.keys(socialMedia).length > 0) {
      contextParts.push("\n📱 SOCIAL MEDIA:");
      for (const [key, value] of Object.entries(socialMedia)) {
        contextParts.push(`• ${value.platform}: available on ${key}`);
      }
    }

    // ===== PART 9: EXAMPLES DATA (ONLY IF USER ASKS FOR EXAMPLES) =====
    if (wantsExamples) {
      const weddings = companyData.weddings || {};
      
      // Celebrity weddings
      if (weddings.celebrity?.featured) {
        contextParts.push("\n🌟 CELEBRITY WEDDINGS WE'VE CAPTURED:");
        weddings.celebrity.featured.forEach(w => {
          contextParts.push(`• ${w.couple} - ${w.location} (${w.date})`);
        });
      }
      
      // Featured weddings
      if (weddings.featured) {
        contextParts.push("\n💍 FEATURED WEDDINGS:");
        weddings.featured.forEach(w => {
          contextParts.push(`• ${w.couple} - ${w.location} at ${w.venue}`);
        });
      }
      
      // Pre-wedding shoots (NO location mentioned - only if user asks)
      if (weddings.prewedding) {
        contextParts.push("\n💕 PRE-WEDDING SHOOTS (IMPORTANT: Do NOT mention location/place in response unless user specifically asks for it):");
        weddings.prewedding.forEach(w => {
          contextParts.push(`• ${w.couple} - Style: ${w.style}`);
        });
      }
      
      // Destination weddings
      if (weddings.destination) {
        contextParts.push("\n🏖️ DESTINATION WEDDINGS:");
        weddings.destination.forEach(w => {
          contextParts.push(`• ${w.couple} - ${w.location} at ${w.venue}`);
        });
      }
    }
    
    // ===== PART 10: PORTFOLIO (ALWAYS INCLUDED - SUMMARY ONLY) =====
    const portfolio = companyData.portfolio || {};
    if (portfolio.description) {
      contextParts.push("\n🖼️ PORTFOLIO:");
      contextParts.push(`${portfolio.description}`);
      if (portfolio.couplesCount) {
        contextParts.push(`Total couples: ${portfolio.couplesCount}`);
      }
    }

    return contextParts.join("\n");
  }

  // ===== STATUS =====
  getStatus() {
    const total = Object.keys(this.scrapedData).length;
    const success = Object.values(this.scrapedData).filter(
      (r) => r.success,
    ).length;
    return {
      totalPages: total,
      successPages: success,
      failedPages: total - success,
      lastScrape: this.lastScrapeTime,
      isScraping: this.isScraping,
    };
  }
}

module.exports = new ScraperService();