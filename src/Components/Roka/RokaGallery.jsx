// src/components/roka/RokaGallery.jsx
import React from 'react';
import GalleryGrid from '../common/GalleryGrid';
import styles from '../../Styles/roka/RokaGallery.module.css';

const RokaGallery = ({ onImageClick }) => {
  const galleryImages = [
    { id: 1, src: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Roka 1", orientation: "landscape" },
    { id: 2, src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=800", alt: "Roka 2", orientation: "portrait" },
    { id: 3, src: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600&h=600", alt: "Roka 3", orientation: "square" },
    { id: 4, src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Roka 4", orientation: "landscape" },
    { id: 5, src: "https://images.pexels.com/photos/34819639/pexels-photo-34819639/free-photo-of-romantic-beachside-maternity-couple-portrait.jpeg?w=600&h=800", alt: "Roka 5", orientation: "portrait" },
    { id: 6, src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=600", alt: "Roka 6", orientation: "square" },
  ];

  return (
    <div className={`${styles.gallerySection} scroll-fade-up`}>
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.sectionTitle} scroll-fade-up delay-1`}>Our Work</h2>
        <div className={`${styles.sectionLine} scroll-fade-up delay-2`}></div>
        <p className={`${styles.sectionSubtitle} scroll-fade-up delay-3`}>A glimpse into beautiful Roka ceremonies</p>
      </div>
      <div className="stagger-children">
        <GalleryGrid images={galleryImages} onImageClick={onImageClick} />
      </div>
    </div>
  );
};

export default RokaGallery;