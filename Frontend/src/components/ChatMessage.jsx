import React from 'react';
import OptionGrid from './OptionGrid';

const ChatMessage = ({ message, onOptionSelect }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-bubble">
        {message.title && !isUser && (
          <div className="message-title">
            <span className="material-icons message-title-icon">info</span>
            {message.title}
          </div>
        )}
        
        <div className="message-text">
          {message.text || message.message}
        </div>
        
        {!isUser && message.options && message.options.length > 0 && (
          <OptionGrid 
            options={message.options} 
            onSelect={onOptionSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;