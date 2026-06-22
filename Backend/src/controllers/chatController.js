const aiService = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');

class ChatController {
  // Send message and get response
  async sendMessage(req, res) {
    try {
      const { message, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false,
          error: 'Message is required' 
        });
      }

      // Get AI response
      const response = await aiService.getAIResponse(message);
      const convId = conversationId || uuidv4();

      res.json({
        success: true,
        message: response,
        conversationId: convId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Chat Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get response. Please try again.'
      });
    }
  }

  // Get conversation history (for future implementation)
  async getHistory(req, res) {
    try {
      const { conversationId } = req.params;
      
      // TODO: Implement conversation history storage
      res.json({
        success: true,
        conversationId,
        history: [],
        message: 'History feature coming soon'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get history'
      });
    }
  }

  // Clear conversation (for future implementation)
  async clearConversation(req, res) {
    try {
      const { conversationId } = req.params;
      
      // TODO: Implement conversation clearing
      res.json({
        success: true,
        message: 'Conversation cleared successfully',
        conversationId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to clear conversation'
      });
    }
  }
}

module.exports = new ChatController();