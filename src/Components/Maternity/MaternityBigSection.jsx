// src/components/maternity/MaternityBigSection.jsx
import React from 'react';
import styles from '../../Styles/maternity/Maternity.module.css';

// ===== ASSETS SE IMPORT =====
import bigImg from '../../assets/maternity/images/maternity1.jpg';

const MaternityBigSection = () => {
  return (
    <div className={`${styles.bigSection} scroll-reveal`}>
      <div className={styles.bigContainer}>
        
        {/* LEFT - BIG IMAGE (Choti) */}
        <div className={`${styles.bigImage} scroll-zoom`}>
          <img src={bigImg} alt="Maternity" />
        </div>
        
        {/* RIGHT - CONTENT (Same) */}
        <div className={`${styles.bigContent} scroll-slide-right`}>
          <h2 className={styles.bigTitle}>The Beauty of Motherhood</h2>
          <div className={styles.bigLine}></div>
          <p className={styles.bigDesc}>
            Maternity photography is a beautiful way to celebrate the journey of motherhood. 
            It captures the love, the anticipation, and the glow that comes with bringing new life into the world.
          </p>
          <p className={styles.bigText}>
            Every pregnancy is unique, and every mother deserves to have her story told through 
            stunning photographs that she can cherish for a lifetime. Our maternity sessions are 
            designed to make you feel comfortable, beautiful, and celebrated.
          </p>
          <p className={styles.bigText}>
            From intimate studio sessions to outdoor locations with natural lighting, we create 
            a personalized experience that reflects your style and personality. Whether you prefer 
            elegant and timeless or modern and artistic, we capture the essence of this special time.
          </p>
          <div className={styles.bigFeatures}>
            <div className={styles.bigFeature}>
              <span className={styles.bigFeatureIcon}>✦</span>
              <span>Personalized Sessions</span>
            </div>
            <div className={styles.bigFeature}>
              <span className={styles.bigFeatureIcon}>✦</span>
              <span>Professional Editing</span>
            </div>
            <div className={styles.bigFeature}>
              <span className={styles.bigFeatureIcon}>✦</span>
              <span>Emotional Storytelling</span>
            </div>
            <div className={styles.bigFeature}>
              <span className={styles.bigFeatureIcon}>✦</span>
              <span>Premium Prints</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MaternityBigSection;