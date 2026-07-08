// ChatMessage.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/ChatBot.css';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Custom components for markdown rendering
  const markdownComponents = {
    // Custom link rendering
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="chat-inline-link"
      >
        {children}
      </a>
    ),
    
    // Custom paragraph rendering
    p: ({ children }) => (
      <p className="message-text">{children}</p>
    ),
    
    // Custom bold rendering
    strong: ({ children }) => (
      <strong className="chat-bold">{children}</strong>
    ),
    
    // Custom list rendering
    ul: ({ children }) => (
      <ul className="chat-list">{children}</ul>
    ),
    
    li: ({ children }) => (
      <li className="chat-list-item">• {children}</li>
    ),
  };

  return (
    <div className={`message-wrapper ${isBot ? 'bot' : 'user'}`}>
      <div className="message-avatar">
        {isBot ? (
          <img src="/src/assets/logo/logo.jpeg" alt="Bot" className="avatar-img" />
        ) : (
          <div className="user-avatar">👤</div>
        )}
      </div>
      <div className="message-content">
        <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
          {isBot ? (
            <ReactMarkdown components={markdownComponents}>
              {message.text}
            </ReactMarkdown>
          ) : (
            <p className="message-text">{message.text}</p>
          )}
        </div>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

export default ChatMessage;