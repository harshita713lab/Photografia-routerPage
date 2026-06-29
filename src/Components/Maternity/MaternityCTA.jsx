// src/Components/Maternity/MaternityCTA.jsx
import React from 'react';
import '../../Styles/maternity/Maternity.css';

const MaternityCTA = ({ onButtonClick }) => {
  return (
    <div className="maternity-cta scroll-fade-up">
      <div className="cta-wrapper">
        <h3 className="cta-title scroll-fade-up delay-1">CELEBRATE YOUR JOURNEY</h3>
        <div className="cta-divider scroll-fade-up delay-2"></div>
        <p className="cta-text scroll-fade-up delay-3">
          Professional photography capturing the beauty, grace, and love of motherhood.
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

export default MaternityCTA;