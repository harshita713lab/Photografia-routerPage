// src/components/roka/HeroImageWithContent.jsx
import React from 'react';
import styles from '../../Styles/roka/HeroImageWithContent.module.css';  // ← FIXED PATH

const HeroImageWithContent = ({ 
  imageUrl, 
  sections, 
  onImageClick 
}) => {
  return (
    <div className={styles.heroImageContainer}>
      <div className={styles.imageWrapper}>
        <img 
          src={imageUrl} 
          alt="Hero background" 
          className={styles.heroImage}
          onClick={onImageClick}
        />
        <div className={styles.overlayGradient}></div>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.contentInner}>
          {sections.map((section, index) => (
            <div key={index} className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.sectionLine}></div>
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className={styles.sectionText}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroImageWithContent;