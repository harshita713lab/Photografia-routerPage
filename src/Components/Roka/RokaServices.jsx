// src/components/roka/RokaServices.jsx
import React from 'react';
import AlternatingContent from '../common/AlternatingContent';
import styles from '../../Styles/roka/RokaServices.module.css';  // ← PATH CHECK

const RokaServices = ({ onImageClick }) => {
  const alternatingSections = [
    {
      id: 1,
      image: "https://cliveblair.co.uk/wp-content/uploads/2025/06/asian-roka-pre-wedding-event-0063.jpg",
      badge: "ABOUT ROKA CEREMONY",
      title: "A Sacred Beginning of",
      highlightText: "Two Hearts and Two Families",
      paragraphs: [
        "The Roka ceremony is one of the most cherished pre-wedding rituals in Indian culture.",
        "From the moment the groom's family arrives to the tilak ceremony, every detail is filled with meaning.",
        "Our photography captures not just the rituals, but the emotions behind them."
      ],
      showDivider: true
    },
    {
      id: 2,
      image: "https://cliveblair.co.uk/wp-content/uploads/2025/06/asian-roka-pre-wedding-event-0054.jpg",
      badge: "TRADITIONS & RITUALS",
      title: "Capturing Every",
      highlightText: "Sacred Moment",
      paragraphs: [
        "Every ritual in a Roka ceremony holds deep cultural significance.",
        "We document not just the actions, but the emotions behind them.",
        "These photographs become heirlooms that will remind you of your love story."
      ],
      showDivider: true
    }
  ];

  return (
    <div className={styles.servicesContainer}>  {/* ← YE CSS USE HO RAHA */}
      <AlternatingContent
        sections={alternatingSections}
        onImageClick={onImageClick}
        showDivider={true}
        dividerColor="#FFFFFF"
      />
    </div>
  );
};

export default RokaServices;