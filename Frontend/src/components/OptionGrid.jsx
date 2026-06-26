import React from 'react';
import OptionButton from './OptionButton';

const OptionGrid = ({ options, onSelect, isDisabled = false }) => {
  if (!options || options.length === 0) {
    return null;
  }

  const handleOptionClick = (option) => {
    // Prevent clicking if disabled
    if (isDisabled) return;
    
    // If option has an action, handle it
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
    // Otherwise, send the option ID to the parent
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="option-grid">
      {options.map((option) => (
        <OptionButton 
          key={option.id || Math.random().toString()}
          option={option}
          onClick={() => handleOptionClick(option)}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
};

export default OptionGrid;