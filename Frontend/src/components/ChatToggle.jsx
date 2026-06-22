import React from 'react';
import ChatIcon from './ChatIcon';

const ChatToggle = ({ onClick, isOpen }) => {
  return (
    <button 
      className="chat-toggle-btn" 
      onClick={onClick}
      aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
    >
      <ChatIcon size={28} color="#FFFFFF" />
    </button>
  );
};

export default ChatToggle;