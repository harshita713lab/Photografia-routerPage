import React from 'react';

const OptionButton = ({ option, onClick }) => {
  const handleClick = () => {
    if (onClick && option.id) {
      onClick(option.id);
    }
  };

  return (
    <button 
      className="option-btn"
      onClick={handleClick}
    >
      <div className="option-content">
        <span className="material-icons option-icon">
          {option.icon || 'arrow_forward'}
        </span>
        <div className="option-text">
          <span className="option-label">{option.label || 'Option'}</span>
          {option.description && (
            <span className="option-description">{option.description}</span>
          )}
        </div>
        <span className="material-icons option-arrow">chevron_right</span>
      </div>
    </button>
  );
};

export default OptionButton;