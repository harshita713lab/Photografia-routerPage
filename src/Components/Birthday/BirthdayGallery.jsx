// src/components/birthday/BirthdayGallery.jsx
import React from 'react';
import styles from '../../Styles/birthday/Birthday.module.css';

// ===== ASSETS SE IMPORT (SAHI PATH) =====
import img1 from '../../assets/birthday/image/img1.jpg';
import img2 from '../../assets/birthday/image/birthday2.jpg';
import img3 from '../../assets/birthday/image/birthday3.jpg';
import img4 from '../../assets/birthday/image/birthday4.jpg';
import img5 from '../../assets/birthday/image/birthday5.jpg';
import img6 from '../../assets/birthday/image/birthday6.webp';
import img7 from '../../assets/birthday/image/birthday7.jpg';
import img8 from '../../assets/birthday/image/birthday8.jpg';

const BirthdayGallery = ({ onImageClick }) => {
  const galleryImages = [
    // LANDSCAPE (width 2x, height 1x)
    { id: 1, src: img1, alt: "Birthday Landscape 1", orientation: "landscape" },
    { id: 4, src: img4, alt: "Birthday Landscape 2", orientation: "landscape" },
    
    // PORTRAIT (height 2x, width 1x)
    { id: 2, src: img2, alt: "Birthday Portrait 1", orientation: "portrait" },
    { id: 5, src: img5, alt: "Birthday Portrait 2", orientation: "portrait" },
    
    // SQUARE (1x1)
    { id: 3, src: img3, alt: "Birthday Square 1", orientation: "square" },
    { id: 6, src: img6, alt: "Birthday Square 2", orientation: "square" },
    { id: 7, src: img7, alt: "Birthday Square 3", orientation: "square" },
    { id: 8, src: img8, alt: "Birthday Square 4", orientation: "square" },
  ];

  const getOrientationClass = (orientation) => {
    switch(orientation) {
      case 'landscape': return styles.galleryLandscape;
      case 'portrait': return styles.galleryPortrait;
      default: return styles.gallerySquare;
    }
  };

  return (
    <div className={`${styles.gallerySection} scroll-reveal`}>
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.sectionTitle} fade-in-up delay-1`}>Birthday Gallery</h2>
        <div className={`${styles.sectionLine} fade-in-up delay-2`}></div>
        <p className={`${styles.sectionSubtitle} fade-in-up delay-3`}>
          A glimpse into our beautiful birthday celebrations
        </p>
      </div>
      
      <div className={`${styles.galleryGrid} stagger-children`}>
        {galleryImages.map((img) => (
          <div 
            key={img.id} 
            className={`${styles.galleryItem} ${getOrientationClass(img.orientation)}`}
            onClick={() => onImageClick && onImageClick(img.src)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayGallery;