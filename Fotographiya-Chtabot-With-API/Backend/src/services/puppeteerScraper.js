// Backend/src/services/puppeteerScraper.js
// ============================================
// 🦄 PUPPETEER SCRAPER - Full browser scraping
// ============================================

const puppeteer = require('puppeteer');
const companyData = require('../data/companyData');

/**
 * Scrape all pages from companyData using Puppeteer
 * Handles JavaScript-rendered content
 */
async function scrapeAllPages() {
    console.log('🦄 Starting Puppeteer scraper...');
    const results = {};
    let browser = null;

    try {
        // ✅ Windows Chrome path
        const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        console.log(`🔍 Using Chrome at: ${chromePath}`);

        browser = await puppeteer.launch({
            headless: true,
            executablePath: chromePath,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920,1080'
            ],
            timeout: 60000
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        // Get all URLs
        const urls = [];
        const pages = companyData.pages || {};
        
        for (const [key, url] of Object.entries(pages)) {
            if (url && typeof url === 'string' && url.startsWith('http')) {
                urls.push({ key, url });
            }
        }

        const links = companyData.links || [];
        if (Array.isArray(links)) {
            for (const url of links) {
                if (url && typeof url === 'string' && url.startsWith('http')) {
                    const exists = urls.some(u => u.url === url);
                    if (!exists) {
                        urls.push({ key: `link_${urls.length}`, url });
                    }
                }
            }
        }

        console.log(`🦄 Found ${urls.length} pages to scrape with Puppeteer`);

        // Scrape each page
        for (const { key, url } of urls) {
            try {
                console.log(`🦄 Scraping: ${key} - ${url}`);
                
                await page.goto(url, { 
                    waitUntil: 'networkidle2', 
                    timeout: 30000 
                });

                // ✅ FIX: Use setTimeout instead of page.waitForTimeout
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Extract data
                const data = await page.evaluate(() => {
                    const title = document.title || '';
                    const metaDesc = document.querySelector('meta[name="description"]');
                    const metaDescription = metaDesc ? metaDesc.getAttribute('content') || '' : '';
                    
                    const headings = [];
                    document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
                        const text = el.textContent.trim();
                        if (text && text.length > 0) headings.push(text);
                    });
                    
                    const paragraphs = [];
                    document.querySelectorAll('p').forEach(el => {
                        const text = el.textContent.trim();
                        if (text && text.length > 20) paragraphs.push(text);
                    });
                    
                    const listItems = [];
                    document.querySelectorAll('li').forEach(el => {
                        const text = el.textContent.trim();
                        if (text && text.length > 10) listItems.push(text);
                    });
                    
                    let content = '';
                    const contentSelectors = [
                        'main', 'article', '.content', '.main-content', 
                        '.page-content', '.section', '.container', 'body'
                    ];
                    
                    for (const selector of contentSelectors) {
                        const el = document.querySelector(selector);
                        if (el) {
                            content += el.textContent.trim() + '\n';
                            break;
                        }
                    }
                    
                    content = content
                        .replace(/\s+/g, ' ')
                        .replace(/\n{3,}/g, '\n\n')
                        .trim();
                    
                    return {
                        title,
                        metaDescription,
                        headings: headings.slice(0, 20),
                        paragraphs: paragraphs.slice(0, 30),
                        listItems: listItems.slice(0, 30),
                        content: content.slice(0, 5000)
                    };
                });

                results[key] = {
                    key,
                    url,
                    success: true,
                    title: data.title || key,
                    metaDescription: data.metaDescription || '',
                    headings: data.headings || [],
                    paragraphs: data.paragraphs || [],
                    listItems: data.listItems || [],
                    content: data.content || '',
                    scrapedAt: new Date().toISOString(),
                    source: 'Puppeteer'
                };

                console.log(`✅ Puppeteer scraped: ${key}`);

            } catch (error) {
                console.error(`❌ Puppeteer failed for ${key}:`, error.message);
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

        await browser.close();
        
        const successCount = Object.values(results).filter(r => r.success).length;
        console.log(`✅ Puppeteer completed: ${successCount}/${urls.length} pages scraped successfully`);
        
        return results;

    } catch (error) {
        console.error('❌ Puppeteer fatal error:', error.message);
        if (browser) {
            try { await browser.close(); } catch (e) {}
        }
        return results;
    }
}

module.exports = { scrapeAllPages };