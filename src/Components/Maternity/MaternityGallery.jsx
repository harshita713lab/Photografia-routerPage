// src/components/maternity/MaternityGallery.jsx
import React from 'react';
import styles from '../../Styles/maternity/Maternity.module.css';

// ===== ASSETS SE IMPORT =====
import img1 from '../../assets/maternity/images/maternity1.jpg';
import img2 from '../../assets/maternity/images/maternity2.jpg';
import img3 from '../../assets/maternity/images/maternity3.jpg';
import img4 from '../../assets/maternity/images/maternity4.jpg';
import img5 from '../../assets/maternity/images/maternity5.jpg';
import img6 from '../../assets/maternity/images/maternity6.jpg';
import img7 from '../../assets/maternity/images/maternity7.jpg';
import img8 from '../../assets/maternity/images/maternity8.jpg';

const MaternityGallery = ({ onImageClick }) => {
  const galleryImages = [
    // LANDSCAPE (width 2x, height 1x)
    { id: 1, src: img1, alt: "Maternity Landscape 1", orientation: "landscape" },
    { id: 4, src: img4, alt: "Maternity Landscape 2", orientation: "landscape" },
    { id: 7, src: img7, alt: "Maternity Landscape 3", orientation: "landscape" },
    
    // PORTRAIT (height 2x, width 1x)
    { id: 2, src: img2, alt: "Maternity Portrait 1", orientation: "portrait" },
    { id: 5, src: img5, alt: "Maternity Portrait 2", orientation: "portrait" },
    { id: 8, src: img8, alt: "Maternity Portrait 3", orientation: "portrait" },
    
    // SQUARE (1x1)
    { id: 3, src: img3, alt: "Maternity Square 1", orientation: "square" },
    { id: 6, src: img6, alt: "Maternity Square 2", orientation: "square" },
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
        <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Maternity Gallery</h2>
        <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
        <p className={`${styles.sectionSubtitle} fade-in-delay-3`}>
          A glimpse into the beautiful journey of motherhood
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

export default MaternityGallery;