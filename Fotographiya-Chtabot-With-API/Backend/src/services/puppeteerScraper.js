// Backend/src/services/puppeteerScraper.js
// ============================================
// CLEAN PUPPETEER SCRAPER - NO BAD PATHS!
// ============================================

const fs = require('fs');

// Load puppeteer
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

/**
 * Find Chrome on system
 */
function findChromePath() {
    // Check env var first
    if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
        return process.env.CHROME_PATH;
    }

    const paths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ];

    for (const p of paths) {
        try {
            if (fs.existsSync(p)) return p;
        } catch (e) {}
    }
    return null;
}

/**
 * Scrape all pages
 */
async function scrapeAllPages() {
    console.log('🦄 Starting Puppeteer scraper...');
    const results = {};
    let browser = null;

    try {
        const chromePath = findChromePath();

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
            ],
            timeout: 60000,
            ignoreHTTPSErrors: true
        };

        if (chromePath) {
            launchOptions.executablePath = chromePath;
            console.log('🚀 Using Chrome:', chromePath);
        } else {
            console.log('🔄 Using bundled Chromium');
        }

        console.log('🚀 Launching browser...');
        browser = await puppeteer.launch(launchOptions);
        console.log('✅ Browser launched');

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        // Block images only
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });

        // URLs to scrape
        const urls = [
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

        console.log(`🦄 Found ${urls.length} pages to scrape`);

        for (const { key, url } of urls) {
            try {
                console.log(`🦄 Scraping: ${key}`);

                try {
                    await page.goto(url, {
                        waitUntil: 'networkidle2',
                        timeout: 30000
                    });
                } catch (e) {
                    console.log(`⏰ Timeout for ${key}, using domcontentloaded`);
                    await page.goto(url, {
                        waitUntil: 'domcontentloaded',
                        timeout: 20000
                    });
                }

                // Wait for content
                await new Promise(r => setTimeout(r, 4000));

                // Extract data
                const data = await page.evaluate(() => {
                    const clean = (el) => el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
                    
                    const title = document.title || '';
                    
                    const meta = document.querySelector('meta[name="description"]');
                    const metaDescription = meta ? meta.getAttribute('content') || '' : '';
                    
                    const headings = [];
                    document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
                        const t = clean(el);
                        if (t && t.length > 0) headings.push(t);
                    });
                    
                    const paragraphs = [];
                    document.querySelectorAll('p').forEach(el => {
                        const t = clean(el);
                        if (t && t.length > 30) paragraphs.push(t);
                    });
                    
                    const listItems = [];
                    document.querySelectorAll('li').forEach(el => {
                        const t = clean(el);
                        if (t && t.length > 10) listItems.push(t);
                    });
                    
                    let content = '';
                    const selectors = ['main', 'article', '.content', '.main-content', '.container', 'body'];
                    for (const s of selectors) {
                        const el = document.querySelector(s);
                        if (el) {
                            content = clean(el);
                            if (content.length > 100) break;
                        }
                    }
                    
                    return {
                        title,
                        metaDescription,
                        headings: headings.slice(0, 30),
                        paragraphs: paragraphs.slice(0, 40),
                        listItems: listItems.slice(0, 40),
                        content: content.slice(0, 8000)
                    };
                });

                const hasContent = data.content && data.content.length > 100;

                results[key] = {
                    key,
                    url,
                    success: hasContent || data.paragraphs.length > 0,
                    title: data.title || key,
                    metaDescription: data.metaDescription || '',
                    headings: data.headings || [],
                    paragraphs: data.paragraphs || [],
                    listItems: data.listItems || [],
                    content: data.content || '',
                    scrapedAt: new Date().toISOString(),
                    source: 'Puppeteer'
                };

                console.log(`✅ ${key} - ${data.content?.length || 0} chars`);

            } catch (error) {
                console.error(`❌ Failed ${key}:`, error.message);
                results[key] = {
                    key,
                    url,
                    success: false,
                    error: error.message,
                    title: '',
                    metaDescription: '',
                    headings: [],
                    paragraphs: [],
                    listItems: [],
                    content: '',
                    source: 'Puppeteer (Failed)'
                };
            }
        }

        await browser.close().catch(() => {});
        
        const successCount = Object.values(results).filter(r => r.success).length;
        console.log(`✅ Done: ${successCount}/${urls.length} pages`);
        
        return results;

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        if (browser) await browser.close().catch(() => {});
        return results;
    }
}

// ✅ EXPORT
module.exports = { scrapeAllPages };