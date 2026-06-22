import React from 'react';
import SendIcon from './SendIcon';

const ChatInput = ({ value, onChange, onSend, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend();
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask me anything..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !value.trim()}>
        <SendIcon size={18} />
      </button>
    </form>
  );
};

export default ChatInput;