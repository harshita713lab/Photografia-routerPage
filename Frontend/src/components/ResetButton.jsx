import React from 'react';

const ResetButton = ({ onReset }) => {
  return (
    <button className="reset-btn" onClick={onReset} title="Start New Conversation">
      🔄
    </button>
  );
};

export default ResetButton;