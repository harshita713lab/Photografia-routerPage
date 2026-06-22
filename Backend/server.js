const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const chatRoutes = require('./src/routes/chatRoutes');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Routes
app.use('/api/chat', chatRoutes);
// Routes
app.use('/api/chat', chatRoutes);

// Add this test route
app.get('/test-gemini', async (req, res) => {
  try {
    const aiService = require('./src/services/aiService');
    const response = await aiService.getAIResponse('Hello, tell me about your services');
    res.json({ success: true, message: response });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

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
      getHistory: 'GET /api/chat/history/:conversationId',
      clearConversation: 'DELETE /api/chat/clear/:conversationId',
      health: 'GET /api/chat/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});