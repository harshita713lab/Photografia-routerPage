// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const aiService = require('./aiService');

const app = express();

// Generate Session ID (just for tracking, not saving)
function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Fotographiya ChatBot API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========== CHAT ROUTE (No Database) ==========
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId = generateSessionId() } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Only keep last 10 messages for context (in memory)
    // This is temporary and will be lost on server restart
    const chatHistory = [
      {
        role: 'user',
        content: message
      }
    ];

    // Generate AI response
    let aiResponse;
    let aiModel = 'mixtral-8x7b-32768';

    try {
      const response = await aiService.generateResponse(chatHistory);
      aiResponse = response.content;
      aiModel = response.model || aiModel;
    } catch (error) {
      console.error('AI Service Error:', error.message);
      aiResponse = "I'm having trouble connecting. Please try again later.";
    }

    // Return ONLY the AI response
    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        sessionId: sessionId,
        timestamp: new Date(),
        model: aiModel
      }
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message'
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;