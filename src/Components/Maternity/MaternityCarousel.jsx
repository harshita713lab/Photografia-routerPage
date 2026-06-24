// src/components/maternity/MaternityCarousel.jsx
import React, { useEffect, useRef, useState } from 'react';
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

const MaternityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const images = [
    { id: 1, src: img1, alt: "Maternity 1" },
    { id: 2, src: img2, alt: "Maternity 2" },
    { id: 3, src: img3, alt: "Maternity 3" },
    { id: 4, src: img4, alt: "Maternity 4" },
    { id: 5, src: img5, alt: "Maternity 5" },
    { id: 6, src: img6, alt: "Maternity 6" },
    { id: 7, src: img7, alt: "Maternity 7" },
    { id: 8, src: img8, alt: "Maternity 8" },
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
      className={`${styles.maternityCarouselSection} scroll-reveal`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.maternityCarouselContainer}>
        
        <div className={styles.sectionHeader}>
          <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Maternity Moments</h2>
          <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
          <p className={`${styles.sectionSubtitle} fade-in-delay-3`}>
            A glimpse into the beautiful journey of motherhood
          </p>
        </div>

        <div className={styles.maternityCarouselWrapper}>
          <div 
            className={styles.maternityCarouselTrack}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img) => (
              <div key={img.id} className={styles.maternityCarouselItem}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button className={`${styles.maternityCarouselBtn} ${styles.maternityCarouselBtnPrev}`} onClick={prevSlide}>
          ❮
        </button>
        <button className={`${styles.maternityCarouselBtn} ${styles.maternityCarouselBtnNext}`} onClick={nextSlide}>
          ❯
        </button>

        {/* Dots */}
        <div className={styles.maternityCarouselDots}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.maternityDot} ${index === currentIndex ? styles.maternityDotActive : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MaternityCarousel;