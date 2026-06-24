const aiService = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const nodemailer = require('nodemailer');

// ============================================
// EMAIL CONFIGURATION
// ============================================
const EMAIL_USER = 'harshitar713@gmail.com';
const EMAIL_PASS = 'wbjq mxre swqj ujrs';
const WHATSAPP_NUMBER = '918824127624';

const TEAM_EMAILS = [
  'harshitar713@gmail.com'
];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// ============================================
// ALERT FUNCTION
// ============================================
async function sendEmailAlert(userMessage, ip) {
  console.log('📧 Sending email alert for:', userMessage); // ✅ Debug log
  
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Fotographiya%20Team%2C%0A%0A📸%20I%20have%20a%20question%20about%3A%20${encodeURIComponent(userMessage)}%0A%0A📍%20IP%3A%20${ip}%0A🕐%20Time%3A%20${timestamp}%0A%0APlease%20assist%20me%20with%20my%20query.`;

  const emailBody = `
📸 **FOTOGRAPHIYA - New Lead Alert**

---

**Lead Details:**

🕐 Time: ${timestamp}
📱 IP Address: ${ip}
💬 Query Type: ${userMessage}

---

**📲 Quick Action:**

👉 Click this link to reply on WhatsApp:
${whatsappLink}

---
This is an automated alert from Fotographiya Chatbot.
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Fotographiya Alerts" <${EMAIL_USER}>`,
      to: TEAM_EMAILS.join(', '),
      subject: `📸 New Lead: ${userMessage} | ${timestamp.split(',')[0]}`,
      text: emailBody
    });
    console.log('✅ Email sent! Message ID:', info.messageId);
  } catch (error) {
    console.log('❌ Email Error:', error.message);
  }

  const log = `[${timestamp}] IP: ${ip} | Message: ${userMessage}\n`;
  fs.appendFileSync('logs/chat-requests.log', log);
}

// ============================================
// CONTROLLER
// ============================================
class ChatController {
  async sendMessage(req, res) {
    try {
      const { message, conversationId } = req.body;
      
      console.log('📩 Received in controller:', message); // ✅ Debug log
      
      if (!message) {
        return res.status(400).json({ 
          success: false,
          error: 'Message is required' 
        });
      }

      // ✅ SEND EMAIL ALERT
      const ip = req.ip || req.connection.remoteAddress;
      console.log('📧 Calling sendEmailAlert for:', message); // ✅ Debug log
      await sendEmailAlert(message, ip);

      const convId = conversationId || uuidv4();
      
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