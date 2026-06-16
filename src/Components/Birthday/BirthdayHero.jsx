// src/components/birthday/BirthdayHero.jsx
import React from 'react';
import styles from '../../Styles/birthday/Birthday.module.css';

// ===== ASSETS SE IMPORT =====
import heroImg from '../../assets/birthday/image/img1.jpg';
import gridImg1 from '../../assets/birthday/image/birthday2.jpg';
import gridImg2 from '../../assets/birthday/image/birthday3.jpg';
import gridImg3 from '../../assets/birthday/image/birthday4.jpg';
import gridImg4 from '../../assets/birthday/image/birthday5.jpg';

const BirthdayHero = () => {
  const images = [
    { id: 1, src: gridImg1, alt: "Birthday 1" },
    { id: 2, src: gridImg2, alt: "Birthday 2" },
    { id: 3, src: gridImg3, alt: "Birthday 3" },
    { id: 4, src: gridImg4, alt: "Birthday 4" },
  ];

  return (
    <div className={styles.birthdayHero}>
      {/* Background */}
      <div className={styles.heroBackground}>
        <img
          src={heroImg}
          alt="Birthday Celebration"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.overlay}></div>

      {/* LEFT SIDE - TITLE */}
      <div className={styles.heroContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.heroBadge}>CELEBRATE</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine}>Birthday</span>
            <span className={styles.titleHighlight}>Special</span>
          </h1>
          <div className={styles.heroDivider}></div>
          <p className={styles.heroSubtitle}>
            Capturing the joy, laughter, and unforgettable moments
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - 4 IMAGES */}
      <div className={styles.imageGridContainer}>
        <div className={styles.imageGrid}>
          {images.map((img) => (
            <div key={img.id} className={styles.gridItem}>
              <img src={img.src} alt={img.alt} className={styles.gridImage} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthdayHero;