const s = require('./src/services/scraperService');
console.log('DataSource:', s.dataSource);
console.log('Scraped keys:', Object.keys(s.scrapedData));
console.log('Scraped count:', Object.keys(s.scrapedData).length);

if (Object.keys(s.scrapedData).length > 0) {
  const keys = Object.keys(s.scrapedData);
  for (const key of keys) {
    const page = s.scrapedData[key];
    console.log('');
    console.log('--- ' + key + ' ---');
    console.log('Success:', page.success);
    console.log('Title:', page.title);
    if (page.content) {
      console.log('Content length:', page.content.length);
      console.log('Content preview:', page.content.substring(0, 200));
    }
    if (page.error) {
      console.log('Error:', page.error);
    }
  }
} else {
  console.log('No scraped data. Calling scrapeAllPages...');
  s.scrapeAllPages().then(() => {
    console.log('After scrape - DataSource:', s.dataSource);
    console.log('After scrape - Scraped keys:', Object.keys(s.scrapedData));
    console.log('After scrape - Scraped count:', Object.keys(s.scrapedData).length);
    
    if (Object.keys(s.scrapedData).length > 0) {
      const keys = Object.keys(s.scrapedData);
      for (const key of keys) {
        const page = s.scrapedData[key];
        console.log('');
        console.log('--- ' + key + ' ---');
        console.log('Success:', page.success);
        console.log('Title:', page.title);
        if (page.content) {
          console.log('Content length:', page.content.length);
          console.log('Content preview:', page.content.substring(0, 200));
        }
        if (page.error) {
          console.log('Error:', page.error);
        }
      }
    }
  });
}