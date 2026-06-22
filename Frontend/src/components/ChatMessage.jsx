import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-bubble">
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;