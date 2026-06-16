// src/components/birthday/BirthdayCTA.jsx
import React from 'react';
import styles from '../../Styles/birthday/Birthday.module.css';

const BirthdayCTA = ({ onButtonClick }) => {
  return (
    <div className={`${styles.ctaSection} scroll-reveal`}>
      <div className={styles.ctaContainer}>
        <h2 className={`${styles.ctaTitle} fade-in-delay-1`}>
          Capture Your <br />
          <span className={styles.ctaTitleHighlight}>Birthday Moments</span>
        </h2>
        <div className={`${styles.ctaDivider} fade-in-delay-2`}></div>
        <p className={`${styles.ctaText} fade-in-delay-3`}>
          Professional photography capturing every smile, every laugh, and every unforgettable moment of your special day.
        </p>
        <button 
          className={`${styles.ctaButton} fade-in-delay-4`} 
          onClick={onButtonClick}
        >
          Book Your Session
        </button>
      </div>
    </div>
  );
};

export default BirthdayCTA;