const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const aiService = require('../services/aiService');

router.post('/message', chatController.sendMessage);

// ✅ NEW: Form submission route
router.post('/form', chatController.handleFormSubmission);

router.post('/reload-config', (req, res) => {
  try {
    const config = aiService.reloadConfig();
    res.json({ 
      success: true, 
      message: 'Config reloaded successfully',
      config: config 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Chat API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;