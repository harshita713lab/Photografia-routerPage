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
      sender: 'bot' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: inputValue, 
      sender: 'user' 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
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

      const botResponse = {
        id: Date.now() + 1,
        text: data.message || 'I received your message!',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        onSendMessage={handleSendMessage}
      />
    </>
  );
};

export default Chatbot;