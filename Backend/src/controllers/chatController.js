const aiService = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');

class ChatController {
  async sendMessage(req, res) {
    try {
      const { message, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false,
          error: 'Message is required' 
        });
      }

      const convId = conversationId || uuidv4();
      
      // Get AI response with structured format
      const response = await aiService.getAIResponse(message, convId);

      res.json({
        success: true,
        type: response.type || 'text',
        message: response.message,
        options: response.options || null,
        action: response.action || null,
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

  // Reset conversation
  async resetConversation(req, res) {
    try {
      const { conversationId } = req.params;
      
      res.json({
        success: true,
        message: 'Conversation reset successfully',
        conversationId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to reset conversation'
      });
    }
  }
}

module.exports = new ChatController();