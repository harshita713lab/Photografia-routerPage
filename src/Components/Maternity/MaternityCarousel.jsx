// src/Components/Maternity/MaternityCarousel.jsx
import React, { useState } from 'react';
import '../../Styles/maternity/Maternity.css';
// ✅ Local image imports
import slide1 from '../../assets/maternity/images/maternity1.jpg';
import slide2 from '../../assets/maternity/images/maternity2.jpg';
import slide3 from '../../assets/maternity/images/maternity3.jpg';
import slide4 from '../../assets/maternity/images/maternity4.jpg';

const MaternityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { id: 1, src: slide1, alt: "Slide 1" },
    { id: 2, src: slide2, alt: "Slide 2" },
    { id: 3, src: slide3, alt: "Slide 3" },
    { id: 4, src: slide4, alt: "Slide 4" },
  ];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="maternity-carousel scroll-fade-up">
      <div className="carousel-header">
        <h2 className="carousel-title scroll-fade-up delay-1">Maternity Moments</h2>
        <div className="carousel-line scroll-fade-up delay-2"></div>
        <p className="carousel-subtitle scroll-fade-up delay-3">A collection of beautiful maternity sessions</p>
      </div>
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="carousel-slide">
                <img src={slide.src} alt={slide.alt} />
              </div>
            ))}
          </div>
        </div>
        <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>‹</button>
        <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>›</button>
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'carousel-dot-active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MaternityCarousel;