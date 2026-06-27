import React, { useState, useEffect } from 'react';
import ChatToggle from './ChatToggle';
import ChatWindow from './ChatWindow';
import '../style/chatBotStyle.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const defaultMenu = {
      id: Date.now(),
      text: 'Welcome to Fotographiya. How can I assist you today?',
      sender: 'bot',
      type: 'menu',
      options: [
        { id: 'services', label: 'Our Services', description: 'Learn about our photography services' },
        { id: 'pricing', label: 'Pricing & Packages', description: 'Check our pricing plans' },
        { id: 'about_us', label: 'About Us', description: 'Know more about Fotographiya' },
        { id: 'contact_us', label: 'Contact Us', description: 'Get in touch with us' }
      ]
    };
    setMessages([defaultMenu]);
    fetchInitialMenu();
  }, []);

  const fetchInitialMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'menu' })
      });
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      console.log('Backend menu loaded:', data);
    } catch (error) {
      console.error('Backend not available, keeping default menu');
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const getMenuMessage = () => ({
    id: Date.now() + 100,
    text: 'Here is the main menu again. How can I help you?',
    sender: 'bot',
    type: 'menu',
    options: [
      { id: 'services', label: 'Our Services', description: 'Learn about our photography services' },
      { id: 'pricing', label: 'Pricing & Packages', description: 'Check our pricing plans' },
      { id: 'about_us', label: 'About Us', description: 'Know more about Fotographiya' },
      { id: 'contact_us', label: 'Contact Us', description: 'Get in touch with us' }
    ]
  });

  const handleSendMessage = async (messageText) => {
    if (!messageText || !messageText.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: messageText, 
      sender: 'user' 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          conversationId: conversationId
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'bot',
        type: data.type || 'text',
        options: data.options || null,
        action: data.action || null,
        formFields: data.formFields || null,
        submitLabel: data.submitLabel || null,
        successMessage: data.successMessage || null,
        title: data.title || null
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formMessage, formData) => {
    console.log('📝 Form submitted:', formData);
    
    if (formMessage.successMessage) {
      const successMsg = {
        id: Date.now() + 1,
        text: formMessage.successMessage,
        sender: 'bot',
        type: 'text',
        options: formMessage.options || []
      };
      setMessages(prev => [...prev, successMsg]);
    }

    try {
      const response = await fetch(`${API_URL}/api/chat/form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          formTitle: formMessage.title || 'Form Submission',
          conversationId: conversationId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Form data sent successfully:', data);
      }
    } catch (error) {
      console.error('❌ Error sending form:', error);
    }
  };

  const handleOptionSelect = (optionId) => {
    console.log('Option clicked:', optionId);
    
    // Handle WhatsApp
    if (optionId === 'whatsapp' || optionId === 'whatsapp_action') {
      window.open('https://wa.me/918824127624', '_blank');
      
      setTimeout(() => {
        const menuMessage = {
          id: Date.now() + 2,
          text: '📱 WhatsApp chat opened in a new tab.\n\nOur team will respond to you shortly.\n\nWhat would you like to do next?',
          sender: 'bot',
          type: 'text',
          options: [
            { id: 'menu', label: '← Back to Main Menu' },
            { id: 'call_now', label: '📞 Call Us Now' }
          ]
        };
        setMessages(prev => [...prev, menuMessage]);
      }, 500);
      return;
    }
    
    // Handle Call
    if (optionId === 'call_action') {
      window.location.href = 'tel:+918824127624';
      
      setTimeout(() => {
        const menuMessage = {
          id: Date.now() + 2,
          text: '📞 Call initiated.\n\nIs there anything else I can help you with?',
          sender: 'bot',
          type: 'text',
          options: [
            { id: 'menu', label: '← Back to Main Menu' }
          ]
        };
        setMessages(prev => [...prev, menuMessage]);
      }, 500);
      return;
    }
    
    // Handle "Back to Menu"
    if (optionId === 'menu') {
      const menuMessage = getMenuMessage();
      setMessages(prev => [...prev, menuMessage]);
      return;
    }
    
    // Regular option
    handleSendMessage(optionId);
  };

  return (
    <>
      <ChatToggle onClick={toggleChat} isOpen={isOpen} />
      <ChatWindow 
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        isLoading={isLoading}
        onOptionSelect={handleOptionSelect}
        onSubmitForm={handleFormSubmit}
      />
    </>
  );
};

export default Chatbot;