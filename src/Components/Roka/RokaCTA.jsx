// src/components/roka/RokaCTA.jsx
import React from 'react';
import styles from '../../Styles/roka/RokaCTA.module.css';

const RokaCTA = ({ onButtonClick }) => {
  return (
    <div className={`${styles.ctaSection} scroll-fade-up`}>
      <div className={styles.ctaWrapper}>
        <h3 className={`${styles.ctaTitle} scroll-fade-up delay-1`}>BEGIN YOUR ROKA JOURNEY</h3>
        <div className={`${styles.ctaDivider} scroll-fade-up delay-2`}></div>
        <p className={`${styles.ctaText} scroll-fade-up delay-3`}>
          Professional photography capturing every blessing, every smile, and every beautiful moment.
        </p>
        <button 
          className={`${styles.ctaButton} scroll-zoom delay-4 hover-scale`} 
          onClick={onButtonClick}
        >
          BOOK YOUR SESSION
        </button>
      </div>
    </div>
  );
};

export default RokaCTA;