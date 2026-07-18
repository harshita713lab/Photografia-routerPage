// Test script to check if live data is actually being fetched from links
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testScrapeStatus() {
  console.log('=== TEST 1: Scrape Status ===');
  const res = await axios.get(`${BASE_URL}/api/chat/scrape-status`);
  console.log(`Data Source: ${res.data.data.dataSource}`);
  console.log(`Pages Scraped: ${res.data.data.pagesScraped}`);
  console.log(`Last Scrape: ${res.data.data.lastScrape}`);
  console.log(`Is Scraping: ${res.data.data.isScraping}`);
  console.log('');
  return res.data.data;
}

async function testChatMessage(message, sessionId) {
  console.log(`=== TEST: "${message}" ===`);
  const res = await axios.post(`${BASE_URL}/api/chat/message`, {
    message,
    sessionId: sessionId || 'test-' + Date.now()
  });
  console.log(`Data Source: ${res.data.data.dataSource}`);
  console.log(`Response: ${res.data.data.message}`);
  console.log('');
  return res.data.data;
}

async function main() {
  try {
    // Test 1: Check scrape status
    const status = await testScrapeStatus();
    
    if (status.dataSource === 'LIVE') {
      console.log('✅ DATA SOURCE IS LIVE - Scraping from website is working!');
    } else {
      console.log('⚠️ Data source is CACHED - Using hardcoded data');
    }
    console.log('');
    
    // Test 2: Send a chat message
    await testChatMessage('Tell me about pre-wedding photography packages');
    
    // Test 3: Ask about wedding photography
    await testChatMessage('What wedding packages do you offer?');
    
    // Test 4: Ask about pricing
    await testChatMessage('How much does wedding photography cost?');
    
    // Test 5: Ask about specific couple
    await testChatMessage('Tell me about Yash and Sakshi wedding');
    
    console.log('=== ALL TESTS COMPLETED ===');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

main();