// src/components/roka/RokaIntro.jsx
import React from 'react';
import styles from '../../Styles/roka/RokaIntro.module.css';
import alternatingImg from '../../assets/images/roka/roka-alternating.jpg';

const RokaIntro = () => {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <img src={alternatingImg} alt="Roka Ceremony" className={styles.image} />
          </div>
        </div>
        <div className={styles.contentColumn}>
          <div className={styles.contentWrapper}>
            <div className={styles.badge}>ABOUT ROKA CEREMONY</div>
            <h2 className={styles.title}>
              A Sacred Beginning of <br />
              <span className={styles.titleHighlight}>Two Hearts and Two Families</span>
            </h2>
            <div className={styles.divider}></div>
            <p className={styles.description}>
              The Roka ceremony is one of the most cherished pre-wedding rituals in Indian culture. 
              It marks the formal announcement that two families have agreed to the union of their children.
            </p>
            <p className={styles.description}>
              From the moment the groom's family arrives to the tilak ceremony, from the exchange of 
              rings and gifts to the heartfelt blessings of elders – every detail is filled with meaning and emotion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RokaIntro;