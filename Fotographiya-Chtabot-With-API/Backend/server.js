// ============================================
// ✅ STEP 1: .env LOAD KARO (SABSE PEHLE)
// ============================================
const dotenv = require('dotenv');
dotenv.config();

// ✅ DEBUG: Check API Keys
console.log('========================================');
console.log('🔑 API Keys Status:');
console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Not found'}`);
console.log(`GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Found' : '❌ Not found'}`);
console.log(`MISTRAL_API_KEY: ${process.env.MISTRAL_API_KEY ? '✅ Found' : '❌ Not found'}`);
console.log(`CEREBRAS_API_KEY: ${process.env.CEREBRAS_API_KEY ? '✅ Found' : '❌ Not found'}`);
console.log('========================================');

// ============================================
// ✅ STEP 2: BAAKI IMPORTS
// ============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const chatRoutes = require('./src/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ============================================
// ✅ API ROUTES
// ============================================
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Fotographiya Chatbot API',
    timestamp: new Date().toISOString()
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Fotographiya Chatbot API',
    status: 'Running',
    endpoints: {
      sendMessage: 'POST /api/chat/message',
      scrapeStatus: 'GET /api/chat/scrape-status',
      forceScrape: 'POST /api/chat/force-scrape',
      health: 'GET /health'
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// ============================================
// 🔄 AUTO-SCRAPE ON STARTUP
// ============================================
// ============================================
// 🔄 AUTO-SCRAPE ON STARTUP
// ============================================
const scraperService = require('./src/services/scraperService');

// ✅ DEBUG - Check what's available
console.log('🔍 scraperService.getDataSource type:', typeof scraperService.getDataSource);
console.log('🔍 scraperService.scrapeAllPages type:', typeof scraperService.scrapeAllPages);
console.log('🔍 scraperService.dataSource value:', scraperService.dataSource);

// Scrape immediately on startup
setTimeout(async () => {
  console.log('🔄 Starting initial website scrape...');
  try {
    await scraperService.scrapeAllPages();
    // ✅ FIX: Use dataSource directly instead of getDataSource()
    console.log(`✅ Initial scrape completed! Data source: ${scraperService.dataSource || 'UNKNOWN'}`);
  } catch (error) {
    console.error('❌ Initial scrape failed:', error.message);
    console.log('⚠️ Using fallback data until next scrape...');
  }
}, 3000);

// Schedule periodic scraping (every 6 hours)
setInterval(async () => {
  console.log('🔄 Scheduled scrape starting...');
  try {
    await scraperService.scrapeAllPages();
    console.log(`✅ Scheduled scrape completed. Source: ${scraperService.dataSource || 'UNKNOWN'}`);
  } catch (error) {
    console.error('❌ Scheduled scrape failed:', error.message);
  }
}, 6 * 60 * 60 * 1000);

console.log('📊 Scraping scheduled: Initial in 3s, then every 6 hours');

// ============================================
// 🚀 START SERVER (ONLY ONCE!)
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Chat API: http://localhost:${PORT}/api/chat`);
});