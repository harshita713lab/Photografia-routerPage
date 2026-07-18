// ============================================
// 🧪 TEST IMPROVED SCRAPER
// Run with: node test-improved-scraper.js
// ============================================

const { scrapeAllPagesImproved } = require('./src/services/improvedScraper');
const fs = require('fs');
const path = require('path');

async function testScraper() {
    console.log('\n' + '🔴'.repeat(30));
    console.log('🧪 IMPROVED SCRAPER TEST');
    console.log('🔴'.repeat(30) + '\n');

    try {
        console.log('⏳ Starting scraper...\n');
        const results = await scrapeAllPagesImproved();

        // Analyze results
        const successCount = Object.values(results).filter(r => r.success).length;
        const totalPages = Object.keys(results).length;
        const totalContent = Object.values(results).reduce((sum, r) => sum + (r.content?.length || 0), 0);

        console.log('\n📊 TEST RESULTS:');
        console.log(`   ✅ Successful: ${successCount}/${totalPages}`);
        console.log(`   📝 Total content: ${totalContent} characters`);
        console.log(`   💾 Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n`);

        // Detailed breakdown
        console.log('📋 DETAILED RESULTS:');
        console.log('-'.repeat(80));
        
        Object.values(results).forEach(page => {
            const status = page.success ? '✅' : '❌';
            const chars = page.content?.length || 0;
            console.log(`${status} ${page.key.padEnd(15)} | ${chars.toString().padEnd(6)} chars | ${page.url}`);
        });

        console.log('-'.repeat(80));

        // Save results to file
        const outputPath = path.join(__dirname, 'scraper-test-results.json');
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`\n💾 Results saved to: ${outputPath}`);

        // Show sample content from first successful page
        const firstSuccess = Object.values(results).find(r => r.success);
        if (firstSuccess) {
            console.log(`\n📄 Sample from '${firstSuccess.key}' page:`);
            console.log('-'.repeat(80));
            console.log(firstSuccess.content.slice(0, 300));
            console.log('...\n');
        }

        if (successCount >= 8) {
            console.log('🎉 ✨ EXCELLENT! Scraper is working great! ✨');
        } else if (successCount >= 5) {
            console.log('👍 Good! Scraper got most pages.');
        } else {
            console.log('⚠️  Warning: Scraper success rate is low. Check website or network.');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run test
testScraper().then(() => {
    console.log('\n✅ Test completed!');
    process.exit(0);
}).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
