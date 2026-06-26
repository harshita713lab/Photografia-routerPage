const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const fs = require('fs');
const chatRoutes = require('./src/routes/chatRoutes');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CREATE LOGS FOLDER
// ============================================
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// ============================================
// CORS - FIXED
// ============================================
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://192.168.1.28:5173'   // ← ADD THIS LINE FOR PHONE ACCESS!
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// SECURITY & MIDDLEWARE
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// ============================================
// LOG ALL REQUESTS
// ============================================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const log = `[${timestamp}] ${ip} - ${req.method} ${req.url}\n`;
  fs.appendFileSync('logs/access.log', log);
  next();
});

// ============================================
// DASHBOARD ROUTE
// ============================================
app.get('/dashboard', (req, res) => {
  try {
    const logs = fs.readFileSync('logs/chat-requests.log', 'utf8');
    const lines = logs.split('\n').filter(Boolean).reverse().slice(0, 50);
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fotographiya Chatbot Dashboard</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        h1 { color: #000; border-bottom: 3px solid #000; padding-bottom: 10px; }
        .container { max-width: 900px; margin: 0 auto; }
        .log { background: white; padding: 12px 16px; margin: 8px 0; border-radius: 8px; border-left: 4px solid #000; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .ip { color: #0066cc; font-weight: bold; }
        .msg { color: #008000; font-weight: 500; }
        .time { color: #888; font-size: 12px; }
        .stats { background: #000; color: #fff; padding: 15px 20px; border-radius: 8px; margin-bottom: 20px; }
        .stats span { font-size: 20px; font-weight: bold; }
        .empty { text-align: center; padding: 40px; color: #999; }
        .refresh-btn { background: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-bottom: 15px; }
        .refresh-btn:hover { background: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📊 Fotographiya Chatbot Dashboard</h1>
        <div class="stats">
          <strong>Total Requests Today:</strong> <span>${lines.length}</span>
        </div>
        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
    `;

    if (lines.length === 0) {
      html += `<div class="empty">No requests yet. Chatbot is waiting for users! 🤖</div>`;
    } else {
      lines.forEach(line => {
        const match = line.match(/\[(.*?)\] IP: (.*?) \| Message: (.*)/);
        if (match) {
          html += `
            <div class="log">
              <span class="ip">📱 ${match[2]}</span>
              <span class="msg">💬 ${match[3]}</span>
              <br>
              <span class="time">🕐 ${match[1]}</span>
            </div>
          `;
        }
      });
    }

    html += `
      </div>
    </body>
    </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.send(`
      <h1>📊 Dashboard</h1>
      <p>No logs yet. Start using the chatbot!</p>
    `);
  }
});

// ============================================
// API ROUTES
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

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Fotographiya Chatbot API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      sendMessage: 'POST /api/chat/message',
      health: 'GET /health',
      dashboard: 'GET /dashboard'
    }
  });
});

// ============================================
// 404 & ERROR HANDLERS
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});