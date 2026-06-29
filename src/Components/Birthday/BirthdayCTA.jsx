// src/Components/Birthday/BirthdayCTA.jsx
import React from 'react';
import '../../Styles/birthday/Birthday.css';

const BirthdayCTA = ({ onButtonClick }) => {
  return (
    <div className="birthday-cta scroll-fade-up">
      <div className="cta-wrapper">
        <h3 className="cta-title scroll-fade-up delay-1">CELEBRATE YOUR SPECIAL DAY</h3>
        <div className="cta-divider scroll-fade-up delay-2"></div>
        <p className="cta-text scroll-fade-up delay-3">
          Professional photography capturing every smile, every laugh, and every beautiful moment.
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

export default BirthdayCTA;