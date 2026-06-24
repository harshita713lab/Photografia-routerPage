import React from 'react';
import OptionButton from './OptionButton';

const OptionGrid = ({ options, onSelect }) => {
  // Agar options nahi hain ya empty hain toh null return karein
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="option-grid">
      {options.map((option) => (
        <OptionButton 
          key={option.id || Math.random().toString()}
          option={option}
          onClick={onSelect}
        />
      ))}
    </div>
  );
};

export default OptionGrid;