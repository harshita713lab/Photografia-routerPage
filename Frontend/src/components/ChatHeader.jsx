import React from 'react';
import BotIcon from './BotIcon';
import CloseIcon from './CloseIcon';

const ChatHeader = ({ onClose }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="header-icon-circle">
          <BotIcon size={24} color="#FFFFFF" />
        </div>
        <h3>Fotographiya Assistant</h3>
      </div>
      <button className="close-btn" onClick={onClose}>
        <CloseIcon size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;