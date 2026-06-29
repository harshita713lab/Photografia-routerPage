// src/Components/Birthday/BirthdayGallery.jsx
import React from 'react';
import '../../Styles/birthday/Birthday.css';
// ✅ Local image imports
import img1 from '../../assets/birthday/image/img1.jpg';
import img2 from '../../assets/birthday/image/birthday2.jpg';
import img3 from '../../assets/birthday/image/birthday3.jpg';
import img4 from '../../assets/birthday/image/birthday4.jpg';
import img5 from '../../assets/birthday/image/birthday5.jpg';
import img6 from '../../assets/birthday/image/birthday6.webp';
import img7 from '../../assets/birthday/image/birthday7.jpg';
import img8 from '../../assets/birthday/image/birthday8.jpg';

const BirthdayGallery = ({ onImageClick }) => {
  const images = [
    { id: 1, src: img1, alt: "Birthday 1", orientation: "landscape" },
    { id: 2, src: img2, alt: "Birthday 2", orientation: "portrait" },
    { id: 3, src: img3, alt: "Birthday 3", orientation: "square" },
    { id: 4, src: img4, alt: "Birthday 4", orientation: "landscape" },
    { id: 5, src: img5, alt: "Birthday 5", orientation: "portrait" },
    { id: 6, src: img6, alt: "Birthday 6", orientation: "square" },
    { id: 7, src: img7, alt: "Birthday 7", orientation: "landscape" },
    { id: 8, src: img8, alt: "Birthday 8", orientation: "portrait" },
  ];

  return (
    <div className="birthday-gallery scroll-fade-up">
      <div className="gallery-header">
        <h2 className="gallery-title scroll-fade-up delay-1">Our Work</h2>
        <div className="gallery-line scroll-fade-up delay-2"></div>
        <p className="gallery-subtitle scroll-fade-up delay-3">A glimpse into beautiful birthday celebrations</p>
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

export default BirthdayGallery;