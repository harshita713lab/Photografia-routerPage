// src/components/maternity/MaternityCTA.jsx
import React from 'react';
import styles from '../../Styles/maternity/Maternity.module.css';

const MaternityCTA = ({ onButtonClick }) => {
  return (
    <div className={`${styles.maternityCtaSection} scroll-reveal`}>
      <div className={styles.maternityCtaContainer}>
        <h2 className={`${styles.maternityCtaTitle} fade-in-delay-1`}>
          Celebrate Your<br />
          <span className={styles.maternityCtaTitleHighlight}>Maternity Journey</span>
        </h2>
        <div className={`${styles.maternityCtaDivider} fade-in-delay-2`}></div>
        <p className={`${styles.maternityCtaText} fade-in-delay-3`}>
          Professional photography capturing the beauty, love, and glow of your pregnancy journey.
        </p>
        <button 
          className={`${styles.maternityCtaButton} fade-in-delay-4`} 
          onClick={onButtonClick}
        >
          Book Your Session
        </button>
      </div>
    </div>
  );
};

export default MaternityCTA;