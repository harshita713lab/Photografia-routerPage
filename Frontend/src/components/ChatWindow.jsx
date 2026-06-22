import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatWindow = ({ 
  isOpen, 
  onClose, 
  messages, 
  isLoading,
  inputValue,
  onInputChange,
  onSendMessage
}) => {
  return (
    <div className={`chat-window ${isOpen ? 'open' : ''}`}>
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput 
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWindow;