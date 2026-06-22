import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="message bot-message">
      <div className="message-bubble typing-indicator">
        <span>●</span>
        <span>●</span>
        <span>●</span>
      </div>
    </div>
  );
};

export default TypingIndicator;