// src/Components/Maternity/MaternityGallery.jsx
import React from 'react';
import '../../Styles/maternity/Maternity.css';
// ✅ Local image imports
import img1 from '../../assets/maternity/images/maternity1.jpg';
import img2 from '../../assets/maternity/images/maternity2.jpg';
import img3 from '../../assets/maternity/images/maternity3.jpg';
import img4 from '../../assets/maternity/images/maternity4.jpg';
import img5 from '../../assets/maternity/images/maternity5.jpg';
import img6 from '../../assets/maternity/images/maternity6.jpg';
import img7 from '../../assets/maternity/images/maternity7.jpg';
import img8 from '../../assets/maternity/images/maternity8.jpg';

const MaternityGallery = ({ onImageClick }) => {
  const images = [
    { id: 1, src: img1, alt: "Maternity 1", orientation: "landscape" },
    { id: 2, src: img2, alt: "Maternity 2", orientation: "portrait" },
    { id: 3, src: img3, alt: "Maternity 3", orientation: "square" },
    { id: 4, src: img4, alt: "Maternity 4", orientation: "landscape" },
    { id: 5, src: img5, alt: "Maternity 5", orientation: "portrait" },
    { id: 6, src: img6, alt: "Maternity 6", orientation: "square" },
    { id: 7, src: img7, alt: "Maternity 7", orientation: "landscape" },
    { id: 8, src: img8, alt: "Maternity 8", orientation: "portrait" },
  ];

  return (
    <div className="maternity-gallery scroll-fade-up">
      <div className="gallery-header">
        <h2 className="gallery-title scroll-fade-up delay-1">Our Work</h2>
        <div className="gallery-line scroll-fade-up delay-2"></div>
        <p className="gallery-subtitle scroll-fade-up delay-3">A glimpse into beautiful maternity sessions</p>
      </div>
      <div className="gallery-grid stagger-children">
        {images.map((img) => {
          let sizeClass = 'gallery-square';
          if (img.orientation === 'landscape') sizeClass = 'gallery-landscape';
          else if (img.orientation === 'portrait') sizeClass = 'gallery-portrait';
          return (
            <div 
              key={img.id} 
              className={`gallery-item ${sizeClass}`} 
              onClick={() => onImageClick && onImageClick(img.src)}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaternityGallery;