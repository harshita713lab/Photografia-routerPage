const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

class AIService {
  constructor() {
    // Load config from JSON file
    this.configPath = path.join(__dirname, '../data/chatbot-config.json');
    this.conversationTree = this.loadConfig();
    console.log('✅ Chatbot config loaded successfully');
  }

  loadConfig() {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading config:', error.message);
      // Fallback config if file not found
      return {
        "menu": {
          "type": "menu",
          "message": "Welcome! How can I help you?",
          "options": [
            { "id": "services", "label": "Services", "icon": "photo_camera", "description": "Our services" },
            { "id": "pricing", "label": "Pricing", "icon": "payments", "description": "Our pricing" }
          ]
        }
      };
    }
  }

  // Reload config without restarting server
  reloadConfig() {
    this.conversationTree = this.loadConfig();
    console.log('🔄 Config reloaded');
    return this.conversationTree;
  }

  async getAIResponse(message, conversationId = null) {
    console.log('📩 Received message:', message);
    
    // Clean the message
    const cleanMessage = message.toLowerCase().trim();
    
    // Check if message exists in conversation tree
    if (this.conversationTree[cleanMessage]) {
      return this.conversationTree[cleanMessage];
    }
    
    // Handle greetings
    const greetings = ['hello', 'hi', 'hey', 'start', 'help', 'menu'];
    if (greetings.includes(cleanMessage)) {
      return this.conversationTree['menu'];
    }
    
    // Keyword matching
    if (cleanMessage.includes('service') || cleanMessage.includes('offer')) {
      return this.conversationTree['services'] || this.conversationTree['menu'];
    }
    
    if (cleanMessage.includes('price') || cleanMessage.includes('cost') || cleanMessage.includes('package')) {
      return this.conversationTree['pricing'] || this.conversationTree['menu'];
    }
    
    if (cleanMessage.includes('tip') || cleanMessage.includes('advice') || cleanMessage.includes('guide')) {
      return this.conversationTree['tips'] || this.conversationTree['menu'];
    }
    
    if (cleanMessage.includes('portfolio') || cleanMessage.includes('gallery') || cleanMessage.includes('work')) {
      return this.conversationTree['portfolio'] || this.conversationTree['menu'];
    }
    
    if (cleanMessage.includes('contact') || cleanMessage.includes('email') || cleanMessage.includes('phone')) {
      return this.conversationTree['contact'] || this.conversationTree['menu'];
    }
    
    // Default: Show menu with all options
    return {
      type: 'menu',
      message: "I didn't quite understand that. Here's what I can help you with:",
      options: [
        { "id": "menu", "label": "Main Menu", "icon": "home", "description": "See all options" },
        { "id": "services", "label": "Our Services", "icon": "photo_camera", "description": "Explore our services" },
        { "id": "pricing", "label": "Pricing & Packages", "icon": "payments", "description": "Check our pricing" },
        { "id": "tips", "label": "Photography Tips", "icon": "tips_and_updates", "description": "Get expert advice" },
        { "id": "portfolio", "label": "View Portfolio", "icon": "collections", "description": "See our work" },
        { "id": "contact", "label": "Contact Us", "icon": "contact_mail", "description": "Get in touch" }
      ]
    };
  }
}

module.exports = new AIService();