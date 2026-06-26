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
  onSendMessage,
  onOptionSelect,
  onSubmitForm  // ← ADD THIS
}) => {
  return (
    <div className={`chat-window ${isOpen ? 'open' : ''}`}>
      <ChatHeader onClose={onClose} />
      <ChatMessages 
        messages={messages} 
        isLoading={isLoading}
        onOptionSelect={onOptionSelect}
        onSubmitForm={onSubmitForm}  // ← PASS THIS
      />
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