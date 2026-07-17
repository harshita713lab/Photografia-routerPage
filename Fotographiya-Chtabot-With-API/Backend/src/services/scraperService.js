// Backend/src/services/scraperService.js
// ========================================
// HYBRID SCRAPER - LIVE DATA + DIRECT URLs
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
        .replace(/[â€™â€˜']/g, "'" )
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


// âœ… FIXED: Simple require with correct path
let puppeteerScraper = null;
try {
    console.log("ðŸ” Attempting to load puppeteerScraper...");
    // âœ… Use correct relative path (same folder)
    const loaded = require('./puppeteerScraper');
    if (loaded && typeof loaded === "object" && loaded.scrapeAllPages) {
        puppeteerScraper = loaded;
        console.log("âœ… Puppeteer scraper loaded successfully");
    } else {
        console.log("âš ï¸ Puppeteer loaded but scrapeAllPages not found");
    }
} catch (error) {
    console.log("âš ï¸ Puppeteer scraper not available: " + error.message);
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

    // ================================================
    // âœ… DIRECT URLs - NO external files needed!
    // ================================================
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
            console.log(`ðŸŒ Scraping with Cheerio: ${key} - ${url}`);

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
            console.error(`âŒ Error scraping ${key}:`, error.message);
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
            console.log("â³ Scraping already in progress...");
            return this.scrapedData;
        }

        this.isScraping = true;
        let finalResults = {};

        // ðŸ”¥ TRY PUPPETEER FIRST
        console.log("ðŸ”„ Trying Puppeteer scraper for LIVE data...");

        if (puppeteerScraper && typeof puppeteerScraper.scrapeAllPages === "function") {
            try {
                console.log("âœ… Using Puppeteer scraper...");
                const puppeteerResults = await puppeteerScraper.scrapeAllPages();

                const successCount = Object.values(puppeteerResults).filter(
                    (r) => r.success === true && r.content && r.content.length > 100
                ).length;

                if (successCount > 0) {
                    console.log(`âœ… Puppeteer scraped ${successCount} pages successfully!`);
                    finalResults = puppeteerResults;
                    this.scrapedData = finalResults;
                    this.lastScrapeTime = new Date();
                    this.isScraping = false;
                    this.dataSource = "LIVE";
                    return this.scrapedData;
                } else {
                    console.log("âš ï¸ Puppeteer scraped 0 pages with content. Falling back...");
                }
            } catch (error) {
                console.log("âš ï¸ Puppeteer failed:", error.message);
            }
        } else {
            console.log("âš ï¸ Puppeteer scraper not available, using Cheerio");
        }

        // ðŸŸ¡ FALLBACK: Cheerio scraper
        console.log("ðŸ”„ Starting Cheerio website scrape...");

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
            console.log(`âœ… Cheerio scraped ${cheerioSuccessCount} pages with content!`);
            finalResults = results;
            this.dataSource = "LIVE";
        } else {
            console.log("âš ï¸ No content from any scraper. Using CACHED data.");
            this.dataSource = "CACHED";
        }

        this.scrapedData = finalResults;
        this.lastScrapeTime = new Date();
        this.isScraping = false;

        return this.scrapedData;
    }

    // ================================================
    // ðŸ” SEARCH FUNCTIONS
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
            console.log(`âœ… Found ${liveResults.length} results in LIVE data`);
            return liveResults;
        }
        console.log("âš ï¸ No LIVE data found");
        return [];
    }

    buildContextForAI(userMessage, wantsExamples, shootType) {
        const contextParts = [];
        console.log(`ðŸ” Building AI context for: "${userMessage}"`);

        contextParts.push(`ðŸ“Š DATA SOURCE: ${this.dataSource === "LIVE" ? "LIVE (Website)" : "CACHED"}`);
        contextParts.push(`- Use LIVE WEBSITE DATA first. Only use cached company fallback if no live website data answers the query.`);

        const results = this.searchHybrid(userMessage);

        if (results.length > 0) {
            contextParts.push(`\nðŸ“„ **LIVE WEBSITE DATA:**`);
            for (const result of results) {
                contextParts.push(`\nðŸ“Œ **${result.title}**:`);
                let count = 0;
                for (const match of result.matches) {
                    if (count >= 3) break;
                    contextParts.push(`  ${match.snippet}`);
                    count++;
                }
            }
        } else {
            contextParts.push(`\nðŸ“„ No live data found for this query.`);
            contextParts.push(`- NOTE: If the user is asking about packages, example shoots, or couple names, use the HARDCODED company fallback data (companyData) for package names and example couple names. Only use hardcoded examples when live website data does not answer the question.`);
        }

        const totalPages = Object.keys(this.scrapedData).length;
        const successPages = Object.values(this.scrapedData).filter(r => r.success).length;
        contextParts.push(`\nðŸ“Š Scraped: ${successPages}/${totalPages} pages`);

        contextParts.push(`\nðŸ“Œ RULES:`);
        contextParts.push(`- Always refer to company as "Fotographiya"`);
        contextParts.push(`- Always refer to team as "the Fotographiya team"`);
        contextParts.push(`- NEVER say "I don't know"`);

        return contextParts.join("\n");
    }
}

module.exports = new ScraperService();

