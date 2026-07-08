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

    // Golden Box special check
    const goldenBoxKeywords = [
      "golden box", "goldenbox", "gb", "qr photo", "instant photo",
      "golden box system", "golden box technology"
    ];
    const isGoldenBoxQuery = goldenBoxKeywords.some(
      (kw) => queryLower.includes(kw) || kw.includes(queryLower),
    );

    const goldenBox = companyData.goldenBox || {};
    if (isGoldenBoxQuery && Object.keys(goldenBox).length > 0) {
      let goldenBoxContent = `📦 GOLDENBOX: ${goldenBox.description || "AI-powered photo delivery system"}`;
      if (goldenBox.features && Array.isArray(goldenBox.features)) {
        goldenBoxContent += "\nFeatures: " + goldenBox.features.join(", ");
      }
      if (goldenBox.aiPowered) {
        goldenBoxContent += "\n" + goldenBox.aiPowered;
      }

      return [{
        page: "goldenbox",
        url: companyData.company?.website || "https://www.fotographiya.com",
        title: "GoldenBox - AI Photo Delivery System",
        source: "HARDCODED (Golden Box Direct)",
        matches: [{
          type: "content",
          snippet: goldenBoxContent.slice(0, 300),
        }, ],
      }, ];
    }

    for (const [key, data] of Object.entries(this.scrapedData)) {
      if (!data.success) continue;

      const matches = [];

      if (data.content && this.textMatchesQuery(data.content, query)) {
        const idx = data.content.toLowerCase().indexOf(queryLower);
        const snippet = data.content.substring(
          Math.max(0, idx - 60),
          Math.min(data.content.length, idx + 120),
        );
        matches.push({ type: "content", snippet: snippet.trim() });
      }

      for (const heading of data.headings || []) {
        if (this.textMatchesQuery(heading, query)) {
          matches.push({ type: "heading", snippet: heading });
        }
      }

      for (const para of data.paragraphs || []) {
        if (this.textMatchesQuery(para, query)) {
          const idx = para.toLowerCase().indexOf(queryLower);
          const snippet = para.substring(
            Math.max(0, idx - 40),
            Math.min(para.length, idx + 80),
          );
          matches.push({ type: "paragraph", snippet: snippet.trim() });
        }
      }

      for (const item of data.listItems || []) {
        if (this.textMatchesQuery(item, query)) {
          matches.push({ type: "list", snippet: item });
        }
      }

      if (matches.length > 0) {
        results.push({
          page: key,
          url: data.url,
          title: data.title || key,
          source: "LIVE (Scraped)",
          matches: matches.slice(0, 5),
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
        url: companyData.company?.website || "https://www.fotographiya.com",
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
          url: companyData.company?.website || "https://www.fotographiya.com",
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

    if (liveResults.length > 0) {
      console.log(`✅ Found ${liveResults.length} results in LIVE data`);
      return liveResults;
    }

    console.log(`⚠️ No live data found, searching hardcoded data...`);
    let hardcodedResults = this.searchInHardcodedData(query);

    if (hardcodedResults.length > 0) {
      console.log(
        `✅ Found ${hardcodedResults.length} results in HARDCODED data`,
      );
      return hardcodedResults;
    }

    console.log(`❌ No data found in live or hardcoded`);
    return [];
  }

  // ================================================
  // 🧠 BUILD AI CONTEXT - FIXED
  // ================================================
  buildContextForAI(userMessage) {
    const query = userMessage.toLowerCase();
    const contextParts = [];

    // ===== PART 1: BASIC INFO =====
    // ✅ SAFE ACCESS
    const c = companyData.company || {};

    contextParts.push(`🏢 COMPANY: ${c.name || 'Fotographiya'}`);
    contextParts.push(`📍 Location: ${c.location || 'Kota, Rajasthan, India'}`);
    contextParts.push(`📞 Phone: ${c.phone || '+91 9001110144'}`);
    contextParts.push(`📧 Email: ${c.email || 'fotographiyaworld@gmail.com'}`);
    contextParts.push(`🌐 Website: [Fotographiya Website](${c.website || 'https://www.fotographiya.com'})`);
    contextParts.push(`👤 Founder: ${c.founder || 'Mohit Barthunia'}`);
    contextParts.push(`📅 Established: ${c.established || '2023'}`);
    contextParts.push(`⭐ Rating: ${c.rating || '4.6/5'}`);
    contextParts.push(`👥 Customers: ${c.customers || '100+ Happy Couples'}`);

    // ===== PART 2: TEAM CONTEXT =====
    contextParts.push("\n👥 TEAM STRUCTURE:");
    contextParts.push(`Total Employees: 50+`);
    contextParts.push(`Team Size Range: 11-50 employees`);

    const team = companyData.team || {};
    contextParts.push(`\n📋 TEAM DEPARTMENTS:`);
    contextParts.push(`• Production Team: 10+ members (Photographers, Cinematographers, Drone Operators)`);
    contextParts.push(`• Tech Team: 10+ members (Software Developers, AI & Technology)`);
    contextParts.push(`• Operations Team: 20+ members (Photo Editors, Video Editors, Album Designers)`);
    contextParts.push(`• Management: 5+ members (Leadership, Strategy)`);
    contextParts.push(`• Sales Team: 3+ members`);
    contextParts.push(`• Digital Marketing: 3+ members`);

    if (team.roles && Array.isArray(team.roles)) {
      contextParts.push(`\n📌 TEAM ROLES:`);
      for (const role of team.roles) {
        contextParts.push(`• ${role}`);
      }
    }

    // ===== PART 3: SOCIAL MEDIA =====
    const socialMedia = companyData.socialMedia || {};
    if (Object.keys(socialMedia).length > 0) {
      contextParts.push("\n📱 SOCIAL MEDIA:");
      const platformNames = {
        instagram: "Instagram",
        facebook: "Facebook",
        youtube: "YouTube",
        linkedin: "LinkedIn",
        reddit: "Reddit",
        medium: "Medium",
        pexels: "Pexels",
      };
      for (const [platform, data] of Object.entries(socialMedia)) {
        const url = data?.url || data;
        const name = platformNames[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
        contextParts.push(`• ${name}: [${name}](${url})`);
      }
    }

    // ===== PART 4: PAGE LINKS =====
    contextParts.push("\n🔗 ALL PAGE LINKS:");
    const pageNames = {
      home: "Homepage",
      about: "About Us",
      services: "Our Services",
      wedding: "Wedding Photography",
      prewedding: "Pre-Wedding Photography",
      destination: "Destination Wedding",
      anniversary: "Anniversary Photography",
      corporate: "Corporate Photography",
      academy: "Fotographiya Academy",
      portfolio: "Portfolio Gallery",
      contact: "Contact Us",
    };

    const pages = companyData.pages || {};
    for (const [key, url] of Object.entries(pages)) {
      const name = pageNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
      contextParts.push(`• ${name}: [${name}](${url})`);
    }

    // ===== PART 5: GOLDEN BOX CONTEXT =====
    const goldenBoxKeywords = [
      "golden box", "goldenbox", "gb", "qr photo", "instant photo"
    ];
    const isGoldenBoxQuery = goldenBoxKeywords.some(
      (kw) => query.includes(kw) || kw.includes(query)
    );

    const goldenBox = companyData.goldenBox || {};
    if (isGoldenBoxQuery && Object.keys(goldenBox).length > 0) {
      contextParts.push("\n✨ GOLDENBOX DETAILS:");
      contextParts.push(`Description: ${goldenBox.description || "AI-powered photo delivery system"}`);
      if (goldenBox.features && Array.isArray(goldenBox.features)) {
        contextParts.push(`Features: ${goldenBox.features.join(", ")}`);
      }
      if (goldenBox.aiPowered) {
        contextParts.push(`AI Powered: ${goldenBox.aiPowered}`);
      }
      if (goldenBox.steps) {
        const steps = goldenBox.steps;
        contextParts.push(`How it works: ${steps.capture || "Capture"} → ${steps.processing || "AI Processing"} → ${steps.qrDisplay || "QR Display"} → ${steps.download || "Download"}`);
      }
    }

    // ===== PART 6: HYBRID SEARCH =====
    const searchResults = this.searchHybrid(query);

    if (searchResults && searchResults.length > 0) {
      const source = searchResults[0].source || "UNKNOWN";
      contextParts.push(`\n📄 SEARCH RESULTS (Source: ${source}):`);

      for (const result of searchResults.slice(0, 4)) {
        contextParts.push(`\n--- ${result.page?.toUpperCase() || "INFO"} ---`);
        if (result.url) contextParts.push(`URL: ${result.url}`);
        if (result.title) contextParts.push(`Title: ${result.title}`);
        if (result.source) contextParts.push(`Source: ${result.source}`);

        if (result.matches && Array.isArray(result.matches)) {
          for (const match of result.matches.slice(0, 3)) {
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