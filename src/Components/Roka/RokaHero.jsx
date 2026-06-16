// src/components/roka/RokaHero.jsx
import React from 'react';
import styles from '../../Styles/roka/RokaHero.module.css';

const RokaHero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBackground}>
        <img
          src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Roka Ceremony"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.overlay}></div>
      <div className={styles.heroContent}>
        <div className={styles.heroTextContainer}>
          <div className={styles.heroBadge}>SACRED BEGINNINGS</div>
          
          <h1 className={styles.heroTitle}>
            <span className={`${styles.titleLine} hero-title-anim`}>Roka</span>
            <span className={`${styles.titleHighlight} hero-title-anim-delay`}>Ceremony</span>
          </h1>
          
          <div className={styles.heroDivider}></div>
          <p className={styles.heroSubtitle}>
            Where two hearts meet and two families become one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RokaHero;