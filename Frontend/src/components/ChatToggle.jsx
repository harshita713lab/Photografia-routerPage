import React from 'react';
// ❌ Remove: import ChatIcon from './ChatIcon';
import logo from '../assets/image/logo.jpeg';  // ✅ Add logo import

const ChatToggle = ({ onClick, isOpen }) => {
  return (
    <button 
      className="chat-toggle-btn" 
      onClick={onClick}
      aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
    >
      {/* ✅ Replace ChatIcon with Logo Image */}
      <img 
        src={logo} 
        alt="Fotographiya" 
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
    </button>
  );
};

export default ChatToggle;