import React from 'react';
import CloseIcon from './CloseIcon';  // ✅ Import CloseIcon
import logo from '../assets/image/logo.jpeg';

const ChatHeader = ({ onClose }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="header-icon-circle">
          <img 
            src={logo} 
            alt="Fotographiya Logo" 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
        <h3>Fotographiya Assistant</h3>
      </div>
      <button className="close-btn" onClick={onClose}>
        <CloseIcon size={18} />  {/* ✅ Now CloseIcon is defined */}
      </button>
    </div>
  );
};

export default ChatHeader;