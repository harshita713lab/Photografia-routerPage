const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send message
router.post('/message', chatController.sendMessage);

// Get conversation history
router.get('/history/:conversationId', chatController.getHistory);

// Clear conversation
router.delete('/clear/:conversationId', chatController.clearConversation);

// Health check for chat
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Chat API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;