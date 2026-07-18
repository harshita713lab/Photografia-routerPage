// Backend/src/services/scraperService.js
// ========================================
// HYBRID SCRAPER - EXACT COMPANY DATA ONLY
// ========================================

const axios = require("axios");
const cheerio = require("cheerio");
const companyData = require("../data/companyData");

function normalizeText(text) {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .replace(/[â€œâ€Â«Â»â€žâ€Ÿ]/g, '"')
        .replace(/[â€™â€˜']/g, "'")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function getSearchQueryVariants(query) {
    const normalized = normalizeText(query);
    const variants = new Set([normalized]);
    const aliasMap = {
        'pre wedding': 'prewedding',
        'pre-wedding': 'prewedding',
        'prewedding': 'prewedding',
        'baby showwer': 'baby',
        'baby shower': 'baby',
        'babyshower': 'baby',
        'engagement': 'roka',
        'engagement ceremony': 'roka',
        'engagement shoot': 'roka',
        'destination wedding': 'destination',
        'destination shoot': 'destination',
        'maternity shoot': 'maternity',
        'birthday shoot': 'birthday',
        'roka ceremony': 'roka',
        'corporate event': 'corporate',
        'goldenbox': 'golden box',
        'golden box': 'golden box',
        'golden package': 'golden',
        'silver package': 'silver',
        'premium package': 'premium',
    };
    for (const [alias, target] of Object.entries(aliasMap)) {
        if (normalized.includes(alias)) {
            variants.add(target);
            variants.add(alias);
        }
    }
    normalized.split(' ').forEach((token) => { if (token.length >= 2) variants.add(token); });
    return Array.from(variants);
}

function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    matrix[0] = Array.from({ length: a.length + 1 }, (_, j) => j);
    for (let i = 1; i <= b.length; i += 1) {
        for (let j = 1; j <= a.length; j += 1) {
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1)
            );
        }
    }
    return matrix[b.length][a.length];
}

function isFuzzyMatch(query, text) {
    const normalizedQuery = normalizeText(query);
    const normalizedText = normalizeText(text);
    if (!normalizedQuery || !normalizedText) return false;
    if (normalizedText.includes(normalizedQuery)) return true;
    const queryWords = normalizedQuery.split(' ').filter(Boolean);
    if (queryWords.length > 1 && queryWords.every((word) => normalizedText.includes(word))) return true;
    const compareLen = Math.min(normalizedText.length, normalizedQuery.length + 8);
    const distance = levenshteinDistance(normalizedQuery, normalizedText.slice(0, compareLen));
    const threshold = Math.max(1, Math.floor(normalizedQuery.length * 0.25));
    return distance <= threshold;
}

// Load improved puppeteer scraper
let puppeteerScraper = null;
try {
    console.log("🔍 Attempting to load IMPROVED puppeteerScraper...");
    const loaded = require('./improvedScraper');
    if (loaded && typeof loaded === "object" && loaded.scrapeAllPages) {
        puppeteerScraper = loaded;
        console.log("✅ ✨ IMPROVED Puppeteer scraper loaded successfully!");
    } else {
        console.log("⚠️ Improved scraper loaded but scrapeAllPages not found, trying fallback...");
        const fallback = require('./puppeteerScraper');
        if (fallback && typeof fallback === "object" && fallback.scrapeAllPages) {
            puppeteerScraper = fallback;
            console.log("✅ Fallback Puppeteer scraper loaded");
        }
    }
} catch (error) {
    console.log("⚠️ IMPROVED scraper not available, trying fallback: " + error.message);
    try {
        const fallback = require('./puppeteerScraper');
        if (fallback && typeof fallback === "object" && fallback.scrapeAllPages) {
            puppeteerScraper = fallback;
            console.log("✅ Fallback Puppeteer scraper loaded");
        }
    } catch (e) {
        console.log("⚠️ No scraper available: " + e.message);
    }
}

class ScraperService {
    constructor() {
        this.scrapedData = {};
        this.isScraping = false;
        this.lastScrapeTime = null;
        this.dataSource = "CACHED";
    }

    getDataSource() {
        return this.dataSource;
    }

    getScrapedData() {
        return this.scrapedData;
    }

    getAllPageUrls() {
        return [
            { key: 'home', url: 'https://www.fotographiya.com' },
            { key: 'about', url: 'https://www.fotographiya.com/about' },
            { key: 'services', url: 'https://www.fotographiya.com/services' },
            { key: 'wedding', url: 'https://www.fotographiya.com/services/wedding-photography' },
            { key: 'prewedding', url: 'https://www.fotographiya.com/services/prewedding-photography' },
            { key: 'destination', url: 'https://www.fotographiya.com/services/destination-wedding' },
            { key: 'anniversary', url: 'https://www.fotographiya.com/services/anniversary-photography' },
            { key: 'corporate', url: 'https://www.fotographiya.com/services/corporate-photography' },
            { key: 'academy', url: 'https://www.fotographiya.com/fotographiya-academy' },
            { key: 'portfolio', url: 'https://www.fotographiya.com/portfolio' },
            { key: 'contact', url: 'https://www.fotographiya.com/contact' },
            { key: 'maternity', url: 'https://www.fotographiya.com/services/maternity-photography' },
            { key: 'birthday', url: 'https://www.fotographiya.com/services/birthday-photography' },
            { key: 'roka', url: 'https://www.fotographiya.com/services/roka-photography' }
        ];
    }

    // ===== Cheerio Fallback Scraper =====
    async scrapePage(url, key) {
        try {
            console.log(`🌐 Scraping with Cheerio: ${key} - ${url}`);

            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
                },
                timeout: 15000,
            });

            const $ = cheerio.load(response.data);
            $("script, style, nav, footer, header, .nav, .menu, .sidebar, .ads, .popup").remove();

            const title = $("title").text().trim();
            const metaDescription = $('meta[name="description"]').attr("content") || "";

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
            $("main, article, .content, .main-content, .page-content, .section, .container, body").each((i, el) => {
                content += $(el).text().trim() + "\n";
            });
            content = content.replace(/\s+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

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

    // ===== SCRAPE ALL PAGES =====
    async scrapeAllPages() {
        if (this.isScraping) {
            console.log("⏳ Scraping already in progress...");
            return this.scrapedData;
        }

        this.isScraping = true;
        let finalResults = {};

        // TRY PUPPETEER FIRST
        console.log("🔧 Trying Puppeteer scraper for LIVE data...");

        if (puppeteerScraper && typeof puppeteerScraper.scrapeAllPages === "function") {
            try {
                console.log("✅ Using Puppeteer scraper...");
                const puppeteerResults = await puppeteerScraper.scrapeAllPages();

                const successCount = Object.values(puppeteerResults).filter(
                    (r) => r.success === true && r.content && r.content.length > 100
                ).length;

                if (successCount > 0) {
                    console.log(`✅ Puppeteer scraped ${successCount} pages successfully!`);
                    finalResults = puppeteerResults;
                    this.scrapedData = finalResults;
                    this.lastScrapeTime = new Date();
                    this.isScraping = false;
                    this.dataSource = "LIVE";
                    return this.scrapedData;
                } else {
                    console.log("⚠️ Puppeteer scraped 0 pages with content. Falling back...");
                }
            } catch (error) {
                console.log("⚠️ Puppeteer failed:", error.message);
            }
        } else {
            console.log("⚠️ Puppeteer scraper not available, using Cheerio");
        }

        // FALLBACK: Cheerio scraper
        console.log("🔧 Starting Cheerio website scrape...");

        const pageUrls = this.getAllPageUrls();
        const results = {};

        for (const { key, url } of pageUrls) {
            const result = await this.scrapePage(url, key);
            results[result.key] = result;
        }

        const cheerioSuccessCount = Object.values(results).filter(
            (r) => r.success && r.content && r.content.length > 100
        ).length;

        if (cheerioSuccessCount > 0) {
            console.log(`✅ Cheerio scraped ${cheerioSuccessCount} pages with content!`);
            finalResults = results;
            this.dataSource = "LIVE";
        } else {
            console.log("⚠️ No content from any scraper. Using CACHED data.");
            this.dataSource = "CACHED";
        }

        this.scrapedData = finalResults;
        this.lastScrapeTime = new Date();
        this.isScraping = false;

        return this.scrapedData;
    }

    // ================================================
    // 🔍 SEARCH FUNCTIONS
    // ================================================
    searchInScrapedData(query) {
        const results = [];
        const queryVariants = getSearchQueryVariants(query);
        const normalizedQuery = normalizeText(query);

        for (const [key, data] of Object.entries(this.scrapedData)) {
            if (!data.success) continue;

            const matches = [];
            const normalizedKey = normalizeText(key);

            if (
                queryVariants.some(
                    (variant) =>
                        normalizedKey === normalizeText(variant) ||
                        normalizedKey.includes(normalizeText(variant))
                )
            ) {
                matches.push({ type: "page", snippet: `Relevant page: ${data.title || key}` });
            }

            const fields = [
                { type: "title", text: data.title },
                { type: "metaDescription", text: data.metaDescription },
                { type: "content", text: data.content },
                ...((data.headings || []).map((text) => ({ type: "heading", text }))),
                ...((data.paragraphs || []).map((text) => ({ type: "paragraph", text }))),
                ...((data.listItems || []).map((text) => ({ type: "list", text }))),
            ];

            for (const field of fields) {
                if (!field.text || matches.length >= 5) continue;
                const normalizedText = normalizeText(field.text);

                if (
                    queryVariants.some(
                        (variant) =>
                            normalizedText.includes(normalizeText(variant)) ||
                            isFuzzyMatch(variant, normalizedText)
                    ) ||
                    (normalizedQuery && normalizedQuery.split(" ").every((word) => normalizedText.includes(word)))
                ) {
                    const snippet = field.text.length > 220 ? `${field.text.slice(0, 220).trim()}...` : field.text;
                    matches.push({ type: field.type, snippet });
                }
            }

            if (matches.length > 0) {
                results.push({
                    page: key,
                    title: data.title || key,
                    source: "LIVE (Scraped)",
                    matches: matches.slice(0, 5),
                });
            }
        }

        return results;
    }

    searchHybrid(query) {
        const liveResults = this.searchInScrapedData(query);
        if (liveResults.length > 0) {
            console.log(`✅ Found ${liveResults.length} results in LIVE data`);
            return liveResults;
        }
        console.log("⚠️ No LIVE data found");
        return [];
    }

    // ================================================
    // 📌 GET EXACT COMPANY DATA (NO HALLUCINATION)
    // ================================================

    getHardcodedPackages() {
        return companyData.packages || {};
    }

    // ✅ FIX: Return EXACT data from companyData - NO extra fields!
    getHardcodedCouples() {
        const couples = [];
        
        // ✅ Featured weddings - EXACT data only
        if (companyData.weddings && companyData.weddings.featured) {
            for (const wedding of companyData.weddings.featured) {
                couples.push({
                    name: wedding.couple || '',
                    location: wedding.location || '',
                    description: wedding.description || '',
                    venue: wedding.venue || '',
                    services: wedding.services || [],
                    date: wedding.date || '',
                    type: 'featured'
                });
            }
        }
        
        // ✅ Pre-wedding shoots - EXACT data only (NO fake locations!)
        if (companyData.weddings && companyData.weddings.prewedding) {
            for (const shoot of companyData.weddings.prewedding) {
                couples.push({
                    name: shoot.couple || '',
                    style: shoot.style || '',
                    highlights: shoot.highlights || [],
                    type: 'prewedding'
                    // ❌ NO location field - it doesn't exist in companyData!
                });
            }
        }
        
        // ✅ Celebrity weddings - EXACT data only
        if (companyData.weddings && companyData.weddings.celebrity && companyData.weddings.celebrity.featured) {
            for (const celeb of companyData.weddings.celebrity.featured) {
                couples.push({
                    name: celeb.couple || '',
                    location: celeb.location || '',
                    description: celeb.description || '',
                    highlights: celeb.highlights || [],
                    date: celeb.date || '',
                    type: 'celebrity'
                });
            }
        }
        
        // ✅ Destination weddings - EXACT data only
        if (companyData.weddings && companyData.weddings.destination) {
            for (const dest of companyData.weddings.destination) {
                couples.push({
                    name: dest.couple || '',
                    location: dest.location || '',
                    description: dest.description || '',
                    venue: dest.venue || '',
                    style: dest.style || '',
                    highlights: dest.highlights || [],
                    date: dest.date || '',
                    type: 'destination'
                });
            }
        }
        
        return couples;
    }

    // ✅ NEW: Get exact pre-wedding data (NO fake locations!)
    getExactPreWeddingData() {
        if (companyData.weddings && companyData.weddings.prewedding) {
            return companyData.weddings.prewedding;
        }
        return [];
    }

    // ✅ NEW: Get exact destination wedding data
    getExactDestinationData() {
        if (companyData.weddings && companyData.weddings.destination) {
            return companyData.weddings.destination;
        }
        return [];
    }

    // ✅ NEW: Get exact featured wedding data
    getExactFeaturedWeddings() {
        if (companyData.weddings && companyData.weddings.featured) {
            return companyData.weddings.featured;
        }
        return [];
    }

    // ================================================
    // 📌 BUILD AI CONTEXT - EXACT DATA ONLY!
    // ================================================
    buildContextForAI(userMessage, wantsExamples, shootType) {
        const contextParts = [];
        const msgLower = userMessage.toLowerCase();

        console.log(`🔍 Building AI context for: "${userMessage}"`);
        console.log(`📌 Shoot type: ${shootType || 'none'}`);

        // ============================================
        // 🔥 STEP 1: ALWAYS include hardcoded packages
        // ============================================
        const packages = this.getHardcodedPackages();
        if (packages && Object.keys(packages).length > 0) {
            contextParts.push(`📦 **FOTOGRAPHIYA PACKAGES (FROM COMPANY DATA):**`);
            
            for (const [key, pkg] of Object.entries(packages)) {
                if (pkg.name && pkg.includes) {
                    contextParts.push(`• ${pkg.name}: ${pkg.includes.join(', ')}`);
                }
            }
            contextParts.push(`- NO PRICING information is available in company data.`);
            contextParts.push(`- Direct users to contact the Fotographiya team for pricing.`);
            contextParts.push(``);
        }

        // ============================================
        // 🔥 STEP 2: Check if user is asking about PRE-WEDDING
        // ============================================
        const isPreWeddingQuery = msgLower.includes('pre') || 
                                   msgLower.includes('pre-wedding') || 
                                   msgLower.includes('prewedding') ||
                                   shootType === 'prewedding';

        if (isPreWeddingQuery) {
            const preWeddingData = this.getExactPreWeddingData();
            if (preWeddingData && preWeddingData.length > 0) {
                contextParts.push(`💕 **PRE-WEDDING SHOOTS (FROM COMPANY DATA - EXACT):**`);
                contextParts.push(`- ONLY use the following exact data. DO NOT add locations or details that don't exist.`);
                
                for (const shoot of preWeddingData) {
                    let line = `• ${shoot.couple || 'Couple'}`;
                    if (shoot.style) line += ` - Style: ${shoot.style}`;
                    if (shoot.highlights && shoot.highlights.length > 0) {
                        line += ` [${shoot.highlights.join(', ')}]`;
                    }
                    contextParts.push(line);
                }
                contextParts.push(`- ⚠️ These couples DO NOT have specific locations in the data.`);
                contextParts.push(`- NEVER invent locations like "Jaipur" or "Udaipur" for pre-wedding shoots.`);
                contextParts.push(``);
            }
        }

        // ============================================
        // 🔥 STEP 3: Check if user is asking about DESTINATION WEDDINGS
        // ============================================
        const isDestinationQuery = msgLower.includes('destination') || 
                                    msgLower.includes('destination wedding') ||
                                    shootType === 'destination';

        if (isDestinationQuery) {
            const destData = this.getExactDestinationData();
            if (destData && destData.length > 0) {
                contextParts.push(`🏖️ **DESTINATION WEDDINGS (FROM COMPANY DATA - EXACT):**`);
                contextParts.push(`- ONLY use the following exact data.`);
                
                for (const dest of destData) {
                    let line = `• ${dest.couple || 'Couple'}`;
                    if (dest.location) line += ` at ${dest.location}`;
                    if (dest.venue) line += ` (${dest.venue})`;
                    if (dest.style) line += ` - ${dest.style}`;
                    if (dest.highlights && dest.highlights.length > 0) {
                        line += ` [${dest.highlights.join(', ')}]`;
                    }
                    contextParts.push(line);
                }
                contextParts.push(`- ⚠️ ONLY use the couples listed above.`);
                contextParts.push(`- DO NOT invent couples like "Rohan & Kavya" in Goa.`);
                contextParts.push(``);
            }
        }

        // ============================================
        // 🔥 STEP 4: Check if user is asking about FEATURED WEDDINGS
        // ============================================
        const isFeaturedQuery = msgLower.includes('featured') || 
                                 msgLower.includes('wedding') ||
                                 msgLower.includes('couple') ||
                                 msgLower.includes('example');

        if (isFeaturedQuery && !isPreWeddingQuery && !isDestinationQuery) {
            const featuredData = this.getExactFeaturedWeddings();
            if (featuredData && featuredData.length > 0) {
                contextParts.push(`💍 **FEATURED WEDDINGS (FROM COMPANY DATA - EXACT):**`);
                
                for (const wedding of featuredData) {
                    let line = `• ${wedding.couple || 'Couple'}`;
                    if (wedding.location) line += ` at ${wedding.location}`;
                    if (wedding.venue) line += ` (${wedding.venue})`;
                    if (wedding.services && wedding.services.length > 0) {
                        line += ` - ${wedding.services.join(', ')}`;
                    }
                    contextParts.push(line);
                }
                contextParts.push(``);
            }
        }

        // ============================================
        // 🔥 STEP 5: Add general company info
        // ============================================
        contextParts.push(`🏢 **COMPANY INFO (FROM COMPANY DATA):**`);
        contextParts.push(`- Name: ${companyData.company?.name || 'Fotographiya'}`);
        contextParts.push(`- Tagline: ${companyData.company?.tagline || 'Integrating technology in the art of wedding photography'}`);
        contextParts.push(`- Location: ${companyData.company?.location || 'Kota, Rajasthan, India'}`);
        contextParts.push(`- Founded: ${companyData.company?.established || '2023'} by ${companyData.company?.founder || 'Mohit Barthunia'}`);
        contextParts.push(`- Team: ${companyData.team?.total || '50+'} professionals`);
        contextParts.push(`- Rating: ${companyData.company?.rating || '4.9/5'}`);
        contextParts.push(`- Customers: ${companyData.company?.customers || '200+ Happy Couples'}`);
        contextParts.push(``);

        // ============================================
        // 🔥 STEP 6: Data source info
        // ============================================
        contextParts.push(`📡 **DATA SOURCE:** ${this.dataSource === "LIVE" ? "LIVE (Website)" : "COMPANY DATA (Hardcoded)"}`);
        contextParts.push(`- ✅ For packages and couple examples, ALWAYS use COMPANY DATA.`);
        contextParts.push(`- ❌ NEVER invent data that doesn't exist in the company data.`);
        contextParts.push(`- ⚠️ If a couple's location is not in the data, DO NOT add one.`);
        contextParts.push(``);

        // ============================================
        // 🔥 STEP 7: RULES
        // ============================================
        contextParts.push(`📌 **RULES:**`);
        contextParts.push(`- Always refer to company as "Fotographiya"`);
        contextParts.push(`- Always refer to team as "the Fotographiya team"`);
        contextParts.push(`- NEVER say "I don't know" - always redirect positively`);
        contextParts.push(`- DO NOT share: photographer count, pricing, contact details`);
        contextParts.push(`- Keep responses SHORT: 2-5 lines maximum`);
        contextParts.push(`- ONLY use data that exists in the COMPANY DATA`);
        contextParts.push(`- NEVER invent couple names, locations, or venues`);
        contextParts.push(`- If asked about something not in data, say: "The Fotographiya team would be happy to share more details."`);

        return contextParts.join("\n");
    }
}

module.exports = new ScraperService();