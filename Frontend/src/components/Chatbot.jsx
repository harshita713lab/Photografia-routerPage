import React, { useState } from 'react';
import ChatToggle from './ChatToggle';
import ChatWindow from './ChatWindow';
import '../style/chatBotStyle.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Welcome to Fotographiya! How can I assist you today?', 
      sender: 'bot',
      type: 'menu',
      options: [
        { id: 'services', label: '📸 Our Services', description: 'Learn about our photography services' },
        { id: 'pricing', label: '💰 Pricing & Packages', description: 'Check our pricing plans' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (messageText) => {
    if (!messageText || !messageText.trim()) return;

    // Add user message
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
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText,
          conversationId: conversationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

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
        action: data.action || null
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
      setInputValue('');
    }
  };

  const handleOptionSelect = (optionId) => {
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
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={() => handleSendMessage(inputValue)}
        onOptionSelect={handleOptionSelect}
      />
    </>
  );
};

export default Chatbot;