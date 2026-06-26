const aiService = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const nodemailer = require('nodemailer');

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
// SEND FORM DATA EMAIL (ONLY FOR FORMS)
// ============================================
async function sendFormEmail(formData, formTitle, ip) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  const time = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
  
  let formFieldsHtml = '';
  let formFieldsText = '';
  
  const fieldLabels = {
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    email: 'Email Address',
    eventDate: 'Event Date',
    eventType: 'Type of Event',
    location: 'Event Location',
    guestCount: 'Expected Guest Count',
    packageSelected: 'Package Interested In',
    budget: 'Budget Range',
    specialRequests: 'Special Requests',
    queryType: 'Query Type',
    message: 'Message',
    requirements: 'Requirements',
    packageType: 'Package Type'
  };

  for (const [key, value] of Object.entries(formData)) {
    const label = fieldLabels[key] || key;
    const displayValue = value || 'Not provided';
    formFieldsHtml += `
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #333; width: 40%;">${label}</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0; color: #555;">${displayValue}</td>
      </tr>
    `;
    formFieldsText += `${label}: ${displayValue}\n`;
  }

  const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: #000000; padding: 25px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { color: #cccccc; margin: 5px 0 0 0; font-size: 14px; }
        .content { padding: 30px; }
        .badge { display: inline-block; background: #000000; color: #ffffff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 15px; }
        .form-title { font-size: 20px; font-weight: 700; color: #000000; margin: 0 0 5px 0; }
        .form-subtitle { color: #666666; font-size: 14px; margin: 0 0 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table tr:last-child td { border-bottom: none; }
        .divider { border: none; border-top: 2px solid #f0f0f0; margin: 20px 0; }
        .footer { background: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; }
        .footer p { margin: 5px 0; color: #666666; font-size: 13px; }
        .footer strong { color: #000000; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: #ffffff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px; }
        .call-btn { display: inline-block; background: #000000; color: #ffffff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px; }
        .meta-info { color: #888888; font-size: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #f0f0f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FOTOGRAPHIYA</h1>
          <p>New Form Submission Alert</p>
        </div>
        <div class="content">
          <div class="badge">NEW LEAD</div>
          <h2 class="form-title">${formTitle}</h2>
          <p class="form-subtitle">Submitted on ${date} at ${time}</p>
          
          <table class="table">
            <tbody>
              ${formFieldsHtml}
            </tbody>
          </table>
          
          <hr class="divider">
          
          <div style="text-align: center; margin: 15px 0;">
            <p style="font-weight: 600; color: #333; margin-bottom: 10px;">Quick Actions</p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Fotographiya%20Team%2C%0A%0AI%20received%20a%20new%20form%20submission%20from%20${encodeURIComponent(formData.fullName || 'a customer')}.%0A%0ACan%20you%20please%20assist%3F" class="whatsapp-btn">Reply on WhatsApp</a>
            <a href="tel:+${WHATSAPP_NUMBER}" class="call-btn">Call Now</a>
          </div>
          
          <div class="meta-info">
            <p>IP Address: ${ip}</p>
            <p>Submission Time: ${timestamp}</p>
            <p>This is an automated alert from Fotographiya Chatbot.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 <strong>Fotographiya</strong> — Premium Photography & Cinematography</p>
          <p style="font-size: 12px; color: #999;">This email was automatically generated. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textEmail = `
============================================
FOTOGRAPHIYA - New Form Submission
============================================

Form: ${formTitle}
Date: ${date}
Time: ${time}
IP Address: ${ip}

--------------------------------------------
FORM DETAILS
--------------------------------------------
${formFieldsText}
--------------------------------------------

Quick Actions:
• WhatsApp: https://wa.me/${WHATSAPP_NUMBER}
• Call: +${WHATSAPP_NUMBER}

--------------------------------------------
This is an automated alert from Fotographiya Chatbot.
© 2026 Fotographiya — Premium Photography & Cinematography
============================================
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Fotographiya Alerts" <${EMAIL_USER}>`,
      to: TEAM_EMAILS.join(', '),
      subject: `${formTitle} | ${date} | ${formData.fullName || 'New Lead'}`,
      html: htmlEmail,
      text: textEmail
    });
    console.log('✅ Form email sent! Message ID:', info.messageId);
  } catch (error) {
    console.log('❌ Email Error:', error.message);
  }

  const log = `[${timestamp}] IP: ${ip} | Form: ${formTitle} | Data: ${JSON.stringify(formData)}\n`;
  fs.appendFileSync('logs/chat-requests.log', log);
}

// ============================================
// SEND CHAT ALERT EMAIL (ONLY FOR CHAT OPTIONS)
// ============================================
async function sendChatAlert(userMessage, ip) {
  // ✅ SKIP email for form-related options (they will send form email instead)
  const formOptions = ['book_event', 'send_call_request', 'bespoke_pricing', 'check_availability', 'customize_package'];
  
  // ✅ If user clicked a form option, DON'T send chat email
  if (formOptions.includes(userMessage)) {
    console.log('⏭️ Skipping chat email for form option:', userMessage);
    return;
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  const time = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

  const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: #000000; padding: 25px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
        .header p { color: #cccccc; margin: 5px 0 0 0; font-size: 14px; }
        .content { padding: 30px; }
        .badge { display: inline-block; background: #2196F3; color: #ffffff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
        .query-box { background: #f8f8f8; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #000000; margin: 15px 0; }
        .query-box p { margin: 0; font-size: 16px; color: #333; }
        .divider { border: none; border-top: 2px solid #f0f0f0; margin: 20px 0; }
        .footer { background: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; }
        .footer p { margin: 5px 0; color: #666666; font-size: 13px; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: #ffffff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px; }
        .call-btn { display: inline-block; background: #000000; color: #ffffff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px; }
        .meta-info { color: #888888; font-size: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #f0f0f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FOTOGRAPHIYA</h1>
          <p>New Chat Interaction</p>
        </div>
        <div class="content">
          <div class="badge">CHAT QUERY</div>
          <h2 style="font-size: 18px; font-weight: 700; color: #000000; margin: 0 0 5px 0;">User Selected Option</h2>
          <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">Submitted on ${date} at ${time}</p>
          
          <div class="query-box">
            <p><strong>Query:</strong> ${userMessage}</p>
          </div>
          
          <hr class="divider">
          
          <div style="text-align: center; margin: 15px 0;">
            <p style="font-weight: 600; color: #333; margin-bottom: 10px;">Quick Actions</p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Fotographiya%20Team%2C%0A%0AA%20user%20selected%20%22${encodeURIComponent(userMessage)}%22%20in%20the%20chatbot.%0A%0ACan%20you%20please%20assist%3F" class="whatsapp-btn">Reply on WhatsApp</a>
            <a href="tel:+${WHATSAPP_NUMBER}" class="call-btn">Call Now</a>
          </div>
          
          <div class="meta-info">
            <p>IP Address: ${ip}</p>
            <p>Time: ${timestamp}</p>
            <p>This is an automated alert from Fotographiya Chatbot.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 <strong>Fotographiya</strong> — Premium Photography & Cinematography</p>
          <p style="font-size: 12px; color: #999;">This email was automatically generated. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textEmail = `
============================================
FOTOGRAPHIYA - New Chat Interaction
============================================

Date: ${date}
Time: ${time}
IP Address: ${ip}

--------------------------------------------
QUERY
--------------------------------------------
${userMessage}
--------------------------------------------

Quick Actions:
• WhatsApp: https://wa.me/${WHATSAPP_NUMBER}
• Call: +${WHATSAPP_NUMBER}

--------------------------------------------
This is an automated alert from Fotographiya Chatbot.
© 2026 Fotographiya — Premium Photography & Cinematography
============================================
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Fotographiya Alerts" <${EMAIL_USER}>`,
      to: TEAM_EMAILS.join(', '),
      subject: `New Chat: ${userMessage} | ${date}`,
      html: htmlEmail,
      text: textEmail
    });
    console.log('✅ Chat email sent! Message ID:', info.messageId);
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
      
      console.log('📩 Received in controller:', message);
      
      if (!message) {
        return res.status(400).json({ 
          success: false,
          error: 'Message is required' 
        });
      }

      const ip = req.ip || req.connection.remoteAddress;
      
      // ✅ Send chat email (but skip form options)
      await sendChatAlert(message, ip);

      const convId = conversationId || uuidv4();
      const response = await aiService.getAIResponse(message, convId);

      res.json({
        success: true,
        type: response.type || 'text',
        message: response.message,
        options: response.options || null,
        action: response.action || null,
        formFields: response.formFields || null,
        submitLabel: response.submitLabel || null,
        successMessage: response.successMessage || null,
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

  async handleFormSubmission(req, res) {
    try {
      const { formData, formTitle, conversationId } = req.body;
      const ip = req.ip || req.connection.remoteAddress;
      
      console.log('📝 Form submitted:', formData);
      
      // ✅ ONLY send form email (no duplicate chat email)
      await sendFormEmail(formData, formTitle, ip);
      
      res.json({
        success: true,
        message: 'Form submitted successfully',
        conversationId
      });
    } catch (error) {
      console.error('Form Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit form'
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