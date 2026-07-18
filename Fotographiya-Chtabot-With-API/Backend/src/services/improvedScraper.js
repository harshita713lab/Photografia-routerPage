// ============================================
// 🚀 IMPROVED PUPPETEER SCRAPER
// Production-Ready with Retry Logic & Better Error Handling
// ============================================

const fs = require('fs');
const path = require('path');

let puppeteer;
try {
    puppeteer = require('puppeteer-extra');
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    puppeteer.use(StealthPlugin());
    console.log('✅ Puppeteer Extra loaded');
} catch (e) {
    console.log('⚠️ Using plain puppeteer');
    puppeteer = require('puppeteer');
}

// ============================================
// 🔍 CHROME PATH DETECTION
// ============================================
function findChromePath() {
    if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
        return process.env.CHROME_PATH;
    }

    const paths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ];

    for (const p of paths) {
        try {
            if (fs.existsSync(p)) {
                console.log(`✅ Found Chrome at: ${p}`);
                return p;
            }
        } catch (e) {}
    }
    return null;
}

// ============================================
// 📊 PAGE URLS
// ============================================
const PAGE_URLS = [
    { key: 'home', url: 'https://www.fotographiya.com', timeout: 45000 },
    { key: 'about', url: 'https://www.fotographiya.com/about', timeout: 40000 },
    { key: 'services', url: 'https://www.fotographiya.com/services', timeout: 45000 },
    { key: 'wedding', url: 'https://www.fotographiya.com/services/wedding-photography', timeout: 40000 },
    { key: 'prewedding', url: 'https://www.fotographiya.com/services/prewedding-photography', timeout: 40000 },
    { key: 'destination', url: 'https://www.fotographiya.com/services/destination-wedding', timeout: 40000 },
    { key: 'anniversary', url: 'https://www.fotographiya.com/services/anniversary-photography', timeout: 40000 },
    { key: 'corporate', url: 'https://www.fotographiya.com/services/corporate-photography', timeout: 40000 },
    { key: 'academy', url: 'https://www.fotographiya.com/fotographiya-academy', timeout: 40000 },
    { key: 'portfolio', url: 'https://www.fotographiya.com/portfolio', timeout: 45000 },
    { key: 'contact', url: 'https://www.fotographiya.com/contact', timeout: 35000 },
    { key: 'maternity', url: 'https://www.fotographiya.com/services/maternity-photography', timeout: 40000 },
    { key: 'birthday', url: 'https://www.fotographiya.com/services/birthday-photography', timeout: 40000 },
    { key: 'roka', url: 'https://www.fotographiya.com/services/roka-photography', timeout: 40000 }
];

// ============================================
// 🎯 EXTRACT DATA FROM PAGE
// ============================================
async function extractPageData(page, key, url) {
    try {
        console.log(`📖 Extracting content from ${key}...`);
        
        const data = await page.evaluate(() => {
            const clean = (text) => {
                if (!text) return '';
                return text
                    .toString()
                    .trim()
                    .replace(/\s+/g, ' ')
                    .slice(0, 500); // Limit each text to 500 chars
            };

            // Get page title
            const title = document.title || '';

            // Get meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            const metaDescription = metaDesc ? metaDesc.getAttribute('content') || '' : '';

            // Get all headings
            const headings = [];
            document.querySelectorAll('h1, h2, h3, h4, h5').forEach(el => {
                const text = clean(el.textContent);
                if (text.length > 3) {
                    headings.push(text);
                }
            });

            // Get paragraphs with substantial content
            const paragraphs = [];
            document.querySelectorAll('p').forEach(el => {
                const text = clean(el.textContent);
                if (text.length > 20) {
                    paragraphs.push(text);
                }
            });

            // Get list items
            const listItems = [];
            document.querySelectorAll('li').forEach(el => {
                const text = clean(el.textContent);
                if (text.length > 5) {
                    listItems.push(text);
                }
            });

            // Get all text content (backup)
            let fullContent = '';
            const mainElement = document.querySelector('main, article, [role="main"]');
            if (mainElement) {
                fullContent = clean(mainElement.textContent);
            }

            if (!fullContent || fullContent.length < 100) {
                const bodyText = document.body.textContent || '';
                fullContent = clean(bodyText);
            }

            return {
                title: title || 'Unknown',
                metaDescription: metaDescription || '',
                headings: headings.slice(0, 20),
                paragraphs: paragraphs.slice(0, 30),
                listItems: listItems.slice(0, 30),
                content: fullContent.slice(0, 5000)
            };
        });

        return {
            success: true,
            data,
            error: null
        };
    } catch (error) {
        console.error(`❌ Extract error for ${key}:`, error.message);
        return {
            success: false,
            data: null,
            error: error.message
        };
    }
}

// ============================================
// 🔄 SCRAPE SINGLE PAGE WITH RETRIES
// ============================================
async function scrapeSinglePage(page, { key, url, timeout }) {
    const MAX_RETRIES = 2;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`\n🔄 [${key}] Attempt ${attempt}/${MAX_RETRIES}...`);

            // Navigate to page
            try {
                console.log(`  ⏳ Loading ${url}...`);
                await page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: timeout
                });
            } catch (navError) {
                if (navError.message.includes('Timeout')) {
                    console.log(`  ⏰ Timeout with networkidle2, retrying with domcontentloaded...`);
                    await page.goto(url, {
                        waitUntil: 'domcontentloaded',
                        timeout: timeout - 5000
                    });
                } else {
                    throw navError;
                }
            }

            // Wait for content to render
            console.log(`  ⏳ Waiting for content to render...`);
            await new Promise(r => setTimeout(r, 3000));

            // Wait for body to have content
            await page.waitForSelector('body', { timeout: 5000 }).catch(() => {});

            // Extract data
            const result = await extractPageData(page, key, url);

            if (result.success && result.data.content && result.data.content.length > 100) {
                console.log(`  ✅ Success! Got ${result.data.content.length} chars of content`);
                return {
                    key,
                    url,
                    success: true,
                    title: result.data.title,
                    metaDescription: result.data.metaDescription,
                    headings: result.data.headings,
                    paragraphs: result.data.paragraphs,
                    listItems: result.data.listItems,
                    content: result.data.content,
                    scrapedAt: new Date().toISOString(),
                    source: 'Puppeteer-Improved',
                    attempt: attempt
                };
            } else {
                lastError = 'No substantial content extracted';
                console.log(`  ⚠️ Limited content: ${result.data?.content?.length || 0} chars`);
            }

        } catch (error) {
            lastError = error.message;
            console.log(`  ❌ Error: ${error.message}`);
            
            if (attempt < MAX_RETRIES) {
                console.log(`  ⏳ Waiting 2s before retry...`);
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    // All retries failed
    console.log(`  ❌ Failed after ${MAX_RETRIES} attempts`);
    return {
        key,
        url,
        success: false,
        title: '',
        metaDescription: '',
        headings: [],
        paragraphs: [],
        listItems: [],
        content: '',
        error: lastError,
        source: 'Puppeteer-Improved (Failed)'
    };
}

// ============================================
// 🚀 MAIN SCRAPER FUNCTION
// ============================================
async function scrapeAllPagesImproved() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 IMPROVED PUPPETEER SCRAPER - STARTING');
    console.log('='.repeat(60));

    const results = {};
    let browser = null;
    const startTime = Date.now();

    try {
        // Find Chrome
        const chromePath = findChromePath();
        console.log(`\n📍 Chrome path: ${chromePath || 'Using bundled Chromium'}`);

        // Launch browser
        const launchOptions = {
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080',
                '--disable-web-security',
                '--no-first-run',
                '--disable-extensions',
                '--disable-blink-features=AutomationControlled',
            ],
            timeout: 60000,
            ignoreHTTPSErrors: true,
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        };

        if (chromePath) {
            launchOptions.executablePath = chromePath;
        }

        console.log('\n🚀 Launching browser...');
        browser = await puppeteer.launch(launchOptions);
        console.log('✅ Browser launched\n');

        // Create page
        const page = await browser.newPage();
        
        // Set realistic user agent
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        // Block unnecessary resources (images only)
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const resourceType = req.resourceType();
            if (['image', 'stylesheet', 'font'].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Scrape each page
        console.log(`📋 Scraping ${PAGE_URLS.length} pages...\n`);
        
        for (const pageConfig of PAGE_URLS) {
            const result = await scrapeSinglePage(page, pageConfig);
            results[pageConfig.key] = result;
            
            // Small delay between pages
            await new Promise(r => setTimeout(r, 1000));
        }

        await browser.close();

        // Summary
        const successCount = Object.values(results).filter(r => r.success).length;
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        console.log('\n' + '='.repeat(60));
        console.log('📊 SCRAPING COMPLETE');
        console.log('='.repeat(60));
        console.log(`✅ Successful: ${successCount}/${PAGE_URLS.length} pages`);
        console.log(`⏱️  Duration: ${duration} seconds`);
        console.log('='.repeat(60) + '\n');

        return results;

    } catch (error) {
        console.error('\n❌ FATAL ERROR:', error.message);
        if (browser) await browser.close().catch(() => {});
        return results;
    }
}

// ============================================
// 📤 EXPORT
// ============================================
module.exports = { 
    scrapeAllPagesImproved,
    scrapeAllPages: scrapeAllPagesImproved // Also export as scrapeAllPages for compatibility
};
