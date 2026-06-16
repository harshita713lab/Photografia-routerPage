// src/components/common/GalleryGrid.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../Styles/common/GalleryGrid.module.css';

const GalleryGrid = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return <p className={styles.noImages}>No photos available.</p>;
  }

  const [imageDimensions, setImageDimensions] = useState({});

  useEffect(() => {
    const loadDimensions = async () => {
      const dimensions = {};
      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = () => {
            const ratio = img.width / img.height;
            // Manual orientation override if provided
            if (images[i].orientation) {
              dimensions[i] = images[i].orientation;
            } else if (ratio > 1.2) {
              dimensions[i] = 'landscape';
            } else if (ratio < 0.8) {
              dimensions[i] = 'portrait';
            } else {
              dimensions[i] = 'square';
            }
            resolve();
          };
          img.onerror = () => { 
            dimensions[i] = images[i].orientation || 'square'; 
            resolve(); 
          };
          img.src = images[i].src;
        });
      }
      setImageDimensions(dimensions);
    };
    loadDimensions();
  }, [images]);

  return (
    <div className={styles.galleryMainWrapper}>
      <div className={styles.galleryGrid}>
        {images.map((photo, index) => {
          const orientation = imageDimensions[index] || photo.orientation || 'square';
          let sizeClass = styles.gridItemSquare;
          if (orientation === 'landscape') sizeClass = styles.gridItemLandscape;
          else if (orientation === 'portrait') sizeClass = styles.gridItemPortrait;
          
          return (
            <div 
              key={photo.id || index} 
              className={`${styles.gridItem} ${sizeClass}`} 
              onClick={() => onImageClick && onImageClick(photo.src)}
            >
              <img src={photo.src} alt={photo.alt || "Gallery Image"} loading="lazy" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryGrid;