import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatMessages = ({ messages, isLoading, onOptionSelect, onSubmitForm }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages && messages.map((msg, index) => (
        <ChatMessage 
          key={msg.id} 
          message={msg} 
          onOptionSelect={onOptionSelect}
          onSubmitForm={onSubmitForm}
          isLastMessage={index === messages.length - 1}
        />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;