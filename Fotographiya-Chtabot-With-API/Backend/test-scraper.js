// test-scraper.js
const dotenv = require('dotenv');
dotenv.config();

// ✅ Import the actual scraper service
const scraperService = require('./src/services/scraperService');

async function test() {
    console.log('🔄 Testing scraper...');
    console.log('========================================');
    
    // Check if scraper is available
    console.log('🔍 scraperService type:', typeof scraperService);
    console.log('🔍 scrapeAllPages type:', typeof scraperService.scrapeAllPages);
    console.log('🔍 dataSource:', scraperService.dataSource);
    console.log('========================================');
    
    // Run scrape
    console.log('\n🚀 Starting scrape...');
    const results = await scraperService.scrapeAllPages();
    
    console.log('\n📊 RESULTS:');
    console.log('========================================');
    console.log('Data source:', scraperService.dataSource);
    console.log('Pages scraped:', Object.keys(results).length);
    console.log('Last scrape:', scraperService.lastScrapeTime);
    console.log('Is scraping:', scraperService.isScraping);
    console.log('========================================\n');
    
    // Check content for each page
    console.log('📄 PAGE CONTENT SUMMARY:');
    console.log('----------------------------------------');
    
    let totalContent = 0;
    let pagesWithContent = 0;
    
    for (const [key, data] of Object.entries(results)) {
        const contentLength = data.content?.length || 0;
        const hasContent = contentLength > 100;
        const success = data.success ? '✅' : '❌';
        
        console.log(`${success} ${key}:`);
        console.log(`   URL: ${data.url || 'N/A'}`);
        console.log(`   Title: ${data.title || 'No title'}`);
        console.log(`   Content Length: ${contentLength} chars`);
        console.log(`   Paragraphs: ${data.paragraphs?.length || 0}`);
        console.log(`   Headings: ${data.headings?.length || 0}`);
        console.log(`   Has Content: ${hasContent ? '✅ YES' : '❌ NO'}`);
        
        if (hasContent) {
            pagesWithContent++;
            totalContent += contentLength;
            console.log(`   Preview: ${data.content.slice(0, 150)}...`);
        }
        console.log('----------------------------------------');
    }
    
    console.log('\n📊 SUMMARY:');
    console.log(`✅ Pages with content: ${pagesWithContent}/${Object.keys(results).length}`);
    console.log(`📝 Total content length: ${totalContent} chars`);
    console.log(`📌 Data Source: ${scraperService.dataSource}`);
    
    if (scraperService.dataSource === 'LIVE') {
        console.log('🎉 SUCCESS: Live data is being used!');
    } else {
        console.log('⚠️ WARNING: Using cached data. Check scraper logs above for errors.');
    }
}

test().catch(error => {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
});