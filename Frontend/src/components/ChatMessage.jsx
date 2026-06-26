import React, { useState } from 'react';
import OptionGrid from './OptionGrid';
import FormInput from './FormInput';

const ChatMessage = ({ message, onOptionSelect, onSubmitForm, isLastMessage = false }) => {
  const isUser = message.sender === 'user';
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const handleFormChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!onSubmitForm || !message.formFields) return;

    const requiredFields = message.formFields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.id] || !formData[f.id].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields:\n${missingFields.map(f => `• ${f.label}`).join('\n')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitForm(message, formData);
      setFormData({});
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionClick = (option) => {
    if (isOptionSelected) return;
    
    setIsOptionSelected(true);
    
    if (option.action) {
      if (option.action.startsWith('tel:')) {
        window.location.href = option.action;
        return;
      }
      if (option.action.startsWith('https://wa.me/')) {
        window.open(option.action, '_blank');
        return;
      }
    }
    
    if (onOptionSelect) {
      onOptionSelect(option.id);
    }
  };

  const renderMessageWithLinks = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [, label, url] = match;
        return (
          <a key={index} href={url} className="message-link" target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const isForm = message.type === 'form' && message.formFields;
  
  // Only disable options if this is the last message AND an option has been selected
  const shouldDisableOptions = !isLastMessage || isOptionSelected;

  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-bubble">
        {message.title && !isUser && (
          <div className="message-title">
            <span className="material-icons message-title-icon">info</span>
            {message.title}
          </div>
        )}
        
        <div className="message-text">
          {renderMessageWithLinks(message.text || message.message)}
        </div>

        {!isUser && isForm && (
          <form className="chat-form" onSubmit={handleFormSubmit}>
            {message.formFields.map((field) => (
              <FormInput
                key={field.id}
                field={field}
                value={formData[field.id] || ''}
                onChange={handleFormChange}
              />
            ))}
            <button 
              type="submit" 
              className="form-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (message.submitLabel || 'Submit')}
            </button>
          </form>
        )}
        
        {!isUser && message.options && message.options.length > 0 && (
          <OptionGrid 
            options={message.options} 
            onSelect={handleOptionClick}
            isDisabled={shouldDisableOptions}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;