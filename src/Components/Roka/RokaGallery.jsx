// src/Components/Roka/RokaGallery.jsx
import React from 'react';
import "../../Styles/roka/Roka.css";

const RokaGallery = ({ onImageClick }) => {
  const images = [
    { id: 1, src: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Roka 1", orientation: "landscape" },
    { id: 2, src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=800", alt: "Roka 2", orientation: "portrait" },
    { id: 3, src: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600&h=600", alt: "Roka 3", orientation: "square" },
    { id: 4, src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Roka 4", orientation: "landscape" },
    { id: 5, src: "https://images.pexels.com/photos/34819639/pexels-photo-34819639/free-photo-of-romantic-beachside-maternity-couple-portrait.jpeg?w=600&h=800", alt: "Roka 5", orientation: "portrait" },
    { id: 6, src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=600", alt: "Roka 6", orientation: "square" },
    { id: 7, src: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Roka 7", orientation: "landscape" },
    { id: 8, src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=800", alt: "Roka 8", orientation: "portrait" },
  ];

  return (
    <div className="roka-gallery scroll-fade-up">
      <div className="gallery-header">
        <h2 className="gallery-title scroll-fade-up delay-1">Our Work</h2>
        <div className="gallery-line scroll-fade-up delay-2"></div>
        <p className="gallery-subtitle scroll-fade-up delay-3">A glimpse into beautiful Roka ceremonies</p>
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

export default RokaGallery;