// src/components/birthday/BirthdayCarousel.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../Styles/birthday/Birthday.module.css';

// ===== ASSETS SE IMPORT (Only existing files) =====
import img1 from '../../assets/birthday/image/img1.jpg';
import img2 from '../../assets/birthday/image/birthday2.jpg';
import img3 from '../../assets/birthday/image/birthday3.jpg';
import img4 from '../../assets/birthday/image/birthday4.jpg';
import img5 from '../../assets/birthday/image/birthday5.jpg';
import img6 from '../../assets/birthday/image/birthday6.webp';
import img7 from '../../assets/birthday/image/birthday7.jpg';
import img8 from '../../assets/birthday/image/birthday8.jpg';

const BirthdayCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const images = [
    { id: 1, src: img1, alt: "Birthday 1" },
    { id: 2, src: img2, alt: "Birthday 2" },
    { id: 3, src: img3, alt: "Birthday 3" },
    { id: 4, src: img4, alt: "Birthday 4" },
    { id: 5, src: img5, alt: "Birthday 5" },
    { id: 6, src: img6, alt: "Birthday 6" },
    { id: 7, src: img7, alt: "Birthday 7" },
    { id: 8, src: img8, alt: "Birthday 8" },
  ];

  const totalSlides = images.length;

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }
    }, 3000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    startAutoSlide();
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    startAutoSlide();
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    startAutoSlide();
  };

  return (
    <div 
      className={`${styles.sliderSection} scroll-reveal`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.sliderContainer}>
        <div className={styles.sliderWrapper}>
          <div 
            className={styles.sliderTrack}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img) => (
              <div key={img.id} className={styles.slideItem}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>

        <button className={`${styles.sliderBtn} ${styles.sliderBtnPrev}`} onClick={prevSlide}>
          ❮
        </button>
        <button className={`${styles.sliderBtn} ${styles.sliderBtnNext}`} onClick={nextSlide}>
          ❯
        </button>

        <div className={styles.sliderDots}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCarousel;