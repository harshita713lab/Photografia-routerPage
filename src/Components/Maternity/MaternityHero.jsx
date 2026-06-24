// src/components/maternity/MaternityHero.jsx
import React from 'react';
import styles from '../../Styles/maternity/Maternity.module.css';

// ===== VIDEO IMPORT =====
import heroVideo from '../../assets/maternity/video/Video1.mp4';

const MaternityHero = () => {
  return (
    <div className={styles.maternityHero}>
      {/* ===== VIDEO BACKGROUND ===== */}
      <div className={styles.heroBackground}>
        <video
          className={styles.heroVideo}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className={styles.overlay}></div>

      {/* ===== CENTER - TITLE ===== */}
      <div className={styles.heroContent}>
        <div className={styles.contentWrapper}>
          
          {/* Decorative M */}
          <div className={`${styles.decorativeLetter} fade-in-down delay-1`}>M</div>
          
          <div className={`${styles.heroBadge} fade-in-up delay-1`}>MATERNITY</div>
          
          <h1 className={`${styles.heroTitle} title-reveal`}>
            <span className={styles.titleWord} style={{ animationDelay: '0.2s' }}>Maternity</span>
            <span className={styles.titleWord} style={{ animationDelay: '0.5s' }}>Photography</span>
          </h1>
          
          <div className={`${styles.heroDivider} fade-in delay-3`}></div>
          
          <p className={`${styles.heroSubtitle} fade-in-up delay-4`}>
            Capturing the beauty, love, and glow of motherhood
          </p>
          
          <p className={`${styles.heroDescription} fade-in-up delay-5`}>
            Every pregnancy is a unique journey. Let us tell your story through 
            stunning photographs that you'll cherish forever.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default MaternityHero;