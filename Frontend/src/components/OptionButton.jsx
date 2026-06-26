import React from 'react';

const OptionButton = ({ option, onClick, isDisabled = false }) => {
  const handleClick = () => {
    if (isDisabled) return;
    if (onClick) {
      onClick(option);
    }
  };

  // Check if it's a call button
  const isCallButton = option.action && option.action.startsWith('tel:');
  const isWhatsAppButton = option.action && option.action.startsWith('https://wa.me/');

  return (
    <button 
      className={`option-btn ${isCallButton ? 'call-btn' : ''} ${isWhatsAppButton ? 'whatsapp-btn' : ''} ${isDisabled ? 'option-disabled' : ''}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      <div className="option-content">
        <span className="material-icons option-icon">
          {isCallButton ? 'phone' : isWhatsAppButton ? 'whatsapp' : (option.icon || 'arrow_forward')}
        </span>
        <div className="option-text">
          <span className="option-label">{option.label || 'Option'}</span>
          {option.description && (
            <span className="option-description">{option.description}</span>
          )}
        </div>
        <span className="material-icons option-arrow">
          {isCallButton ? 'call' : isWhatsAppButton ? 'chat' : 'chevron_right'}
        </span>
      </div>
    </button>
  );
};

export default OptionButton;