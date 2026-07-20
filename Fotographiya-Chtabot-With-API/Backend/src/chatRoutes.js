const express = require("express");
const router = express.Router();
const { getAIResponse } = require("./services/aiService");
const scraperService = require("./services/scraperService");

// ============================================
// ✅ SHOOT TYPE DETECTION (for AI context)
// ============================================

const SHOOT_TYPE_KEYWORDS = {
  baby: [
    "baby shoot",
    "baby photo",
    "baby photography",
    "newborn",
    "infant",
    "baby photoshoot",
  ],
  maternity: [
    "maternity",
    "maternity shoot",
    "maternity photo",
    "pregnancy shoot",
    "expecting mother",
    "pregnancy photo",
  ],
  corporate: [
    "corporate",
    "corporate event",
    "corporate shoot",
    "business event",
    "company event",
    "conference",
    "corporate photography",
  ],
  roka: [
    "roka",
    "roka shoot",
    "roka ceremony",
    "roka photography",
    "roka photo",
    "engagement ceremony",
  ],
  anniversary: [
    "anniversary",
    "anniversary shoot",
    "anniversary photo",
    "anniversary photography",
    "wedding anniversary",
  ],
  birthday: [
    "birthday",
    "birthday shoot",
    "birthday party",
    "birthday photo",
    "birthday photography",
    "kids birthday",
    "cake smash",
  ],
};

function detectShootType(message) {
  if (typeof message !== "string") return null;
  const msg = message.toLowerCase();

  for (const [type, keywords] of Object.entries(SHOOT_TYPE_KEYWORDS)) {
    if (keywords.some((kw) => msg.includes(kw))) {
      return type;
    }
  }
  return null;
}

// ============================================
// ✅ PACKAGE / PRICE DETECTION (flag for AI)
// ============================================

function isPriceQuery(message) {
  if (typeof message !== "string") return false;
  const msg = message.toLowerCase().trim();
  const priceKeywords = [
    "price", "cost", "budget", "how much", "charges", 
    "fees", "kitna", "pricing", "rate", "rates", "amount",
    "package price", "package cost"
  ];
  return priceKeywords.some((keyword) => msg.includes(keyword));
}

function isPackageQuery(message) {
  if (typeof message !== "string") return false;
  const msg = message.toLowerCase().trim();
  
  // Check for specific package names
  const specificPackages = ["pearl", "gold", "platinum", "diamond", "silver", "premium", "golden"];
  for (const pkg of specificPackages) {
    if (msg.includes(pkg)) return true;
  }
  
  // Check for general package keywords
  const packageKeywords = [
    "package", "packages", "what packages", "which packages",
    "tell me about", "details about", "what's included"
  ];
  return packageKeywords.some((keyword) => msg.includes(keyword));
}

// ============================================
// ✅ OFF-TOPIC KEYWORDS (Only truly unrelated topics)
// ============================================
const ALLOWED_TOPICS = [
  "fotographiya",
  "photography",
  "services",
  "packages",
  "goldenbox",
  "academy",
  "wedding",
  "pre-wedding",
  "destination",
  "celebrity",
  "team",
  "contact",
  "price",
  "cost",
  "budget",
  "portfolio",
  "gallery",
  "about",
  "founder",
  "maternity",
  "birthday",
  "roka",
  "corporate",
  "reviews",
  "location",
  "instagram",
  "facebook",
  "youtube",
  "linkedin",
  "medium",
  "reddit",
  "pexels",
  "social media",
  "social accounts",
  "all social",
  "silver",
  "golden",
  "premium",
  "contact us",
  "reach us",
  "help",
  "support",
  "customer care",
  "address",
  "studio",
  "kota",
  "rajasthan",
  "where is fotographiya",
  "reviews",
  "customer review",
  "testimonial",
  "feedback",
  "golden box",
  "qr photo",
  "course",
  "training",
  "internship",
  "example",
  "examples",
  "sample",
  "samples",
  "couples",
  "couple",
  "namaste",
  "hello",
  "hi",
  "hey",
  "how are you",
  "good morning",
  "good evening",
  "baby",
  "newborn",
  "anniversary",
  "conference",
  "event",
  "baby shower",
  "pregnancy",
  "expecting",
  "corporate event",
  "business",
  "company",
  "roka ceremony",
  "engagement",
  "wedding anniversary",
  "cake smash",
];

const OFF_TOPIC_KEYWORDS = [
  "bts",
  "kpop",
  "ipl",
  "cricket",
  "movie",
  "actor",
  "singer",
  "song",
  "netflix",
  "prime",
  "hotstar",
  "football",
  "prime minister",
  "president",
  "modi",
  "trump",
  "china",
  "pakistan",
  "anime",
  "manga",
  "game of thrones",
  "marvel",
  "dc",
  "hollywood",
  "bollywood",
  "tiktok",
  "instagram influencer",
  "youtube video",
  "recipe",
  "food",
  "weather",
  "news",
  "politics",
  "sports",
  "cricket match",
];

const INTERNATIONAL_KEYWORDS = [
  "bali",
  "maldives",
  "thailand",
  "dubai",
  "uae",
  "usa",
  "uk",
  "europe",
  "america",
  "canada",
  "australia",
  "singapore",
  "malaysia",
  "international",
  "outside india",
  "abroad",
  "foreign",
  "overseas",
  "shoot outside india",
  "outside country",
  "foreign country",
  "other country",
];

// ============================================
// ✅ HELPER FUNCTIONS
// ============================================
function isOffTopic(message) {
  const msgLower = message.toLowerCase().trim();
  const isAllowed = ALLOWED_TOPICS.some((topic) => msgLower.includes(topic));
  if (isAllowed) return false;
  return OFF_TOPIC_KEYWORDS.some((kw) => msgLower.includes(kw));
}

function isInternationalQuestion(message) {
  if (typeof message !== "string") return false;
  const msg = message.toLowerCase().trim();
  return INTERNATIONAL_KEYWORDS.some((keyword) => msg.includes(keyword));
}

// ============================================
// ✅ CHAT MESSAGE ROUTE
// ============================================
router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    console.log(`📩 Message: ${message} | Session: ${sessionId || "N/A"}`);

    // 🔥 STEP 1: Check for international question
    if (isInternationalQuestion(message)) {
  return res.json({
    success: true,
    data: {
      message: "**Fotographiya works primarily within India, I can tell you all about our wedding destinations, photography packages, and services across the country.\nWhat would you like to know? 😊",
      timestamp: new Date().toISOString(),
      dataSource: 'CACHED'
    }
  });
}

    // 🔥 STEP 2: Check if it's an off-topic question
    if (isOffTopic(message)) {
      return res.json({
        success: true,
        data: {
          message:
            "**📸 I'm Here to Help!**\nI can help you with any questions about Fotographiya.\n• Ask me about wedding photography, pre-wedding shoots, or destination weddings\n• I can tell you about packages, services, and portfolio examples\n• Feel free to ask about the Fotographiya team, GoldenBox, or Academy\nTell me what you would like to know about Fotographiya! 😊",
          timestamp: new Date().toISOString(),
          dataSource: "CACHED",
        },
      });
    }

    // 🔥 STEP 3: Detect flags for AI
    const shootType = detectShootType(message);
    const wantsPrice = isPriceQuery(message);
    const wantsPackage = isPackageQuery(message);

    // 🔥 STEP 4: Ensure live scraped data is available before building context
    if (scraperService.dataSource !== "LIVE" && !scraperService.isScraping) {
      console.log("🔄 No LIVE data yet, fetching live website content before answering...");
      await scraperService.scrapeAllPages();
    }

    const context = scraperService.buildContextForAI(message, false, shootType);
    // ✅ VERIFICATION STEP: Log the context being sent to the AI
    console.log("--- AI CONTEXT START ---");
    console.log(context);
    console.log("--- AI CONTEXT END ---");
    const reply = await getAIResponse(
      message,
      context,
      sessionId || "default",
      false,
      shootType,
      wantsPrice,
      wantsPackage,
    );

    // ✅ NEW: Get data source from scraper service
    const dataSource = scraperService.dataSource || "UNKNOWN";

    // ✅ Log data source for debugging
    console.log(`📊 Data source: ${dataSource}`);

    res.json({
      success: true,
      data: {
        message: reply,
        timestamp: new Date().toISOString(),
        dataSource: dataSource, // ✅ ADDED - Tells frontend if data is LIVE or CACHED
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process your request.",
    });
  }
});

// ============================================
// ✅ NEW: SCRAPING STATUS ENDPOINT
// ============================================
router.get("/scrape-status", async (req, res) => {
  try {
    const status = scraperService.getStatus
      ? scraperService.getStatus()
      : {
          message: "Status method not available",
        };

    const dataSource = scraperService.dataSource || "UNKNOWN";

    res.json({
      success: true,
      data: {
        dataSource: dataSource,
        status: status,
        lastScrape: scraperService.lastScrapeTime || null,
        isScraping: scraperService.isScraping || false,
        pagesScraped: Object.keys(scraperService.scrapedData || {}).length,
      },
    });
  } catch (error) {
    console.error("Status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get scrape status",
    });
  }
});

// ============================================
// ✅ NEW: FORCE SCRAPE ENDPOINT
// ============================================
router.post("/force-scrape", async (req, res) => {
  try {
    console.log("🔄 Force scraping triggered...");

    // Check if already scraping
    if (scraperService.isScraping) {
      return res.json({
        success: false,
        message: "Scraping already in progress. Please wait.",
      });
    }

    // Start scraping
    const results = await scraperService.scrapeAllPages();

    const successCount = Object.values(results).filter((r) => r.success).length;
    const totalCount = Object.keys(results).length;

    res.json({
      success: true,
      message: `Scraping completed: ${successCount}/${totalCount} pages scraped successfully`,
      data: {
        totalPages: totalCount,
        successPages: successCount,
        failedPages: totalCount - successCount,
        dataSource: scraperService.dataSource || "UNKNOWN",
        scrapedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Force scrape error:", error);
    res.status(500).json({
      success: false,
      message: "Force scraping failed: " + error.message,
    });
  }
});

module.exports = router;
