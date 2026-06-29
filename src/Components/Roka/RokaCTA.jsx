// src/Components/Roka/RokaCTA.jsx
import React from 'react';
import "../../Styles/roka/Roka.css";

const RokaCTA = ({ onButtonClick }) => {
  return (
    <div className="roka-cta scroll-fade-up">
      <div className="cta-wrapper">
        <h3 className="cta-title scroll-fade-up delay-1">BEGIN YOUR ROKA JOURNEY</h3>
        <div className="cta-divider scroll-fade-up delay-2"></div>
        <p className="cta-text scroll-fade-up delay-3">
          Professional photography capturing every blessing, every smile, and every beautiful moment.
        </p>
        <button 
          className="cta-button scroll-zoom delay-4 hover-scale" 
          onClick={onButtonClick}
        >
          BOOK YOUR SESSION
        </button>
      </div>
    </div>
  );
};

export default RokaCTA;