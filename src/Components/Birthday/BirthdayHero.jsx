// src/Components/Birthday/BirthdayHero.jsx
import React from 'react';
import '../../Styles/birthday/Birthday.css';
// ✅ Local image imports
import heroImage from '../../assets/birthday/image/img1.jpg';
import gridImg1 from '../../assets/birthday/image/birthday2.jpg';
import gridImg2 from '../../assets/birthday/image/birthday3.jpg';
import gridImg3 from '../../assets/birthday/image/birthday4.jpg';
import gridImg4 from '../../assets/birthday/image/birthday5.jpg';

const BirthdayHero = () => {
  return (
    <div className="birthday-hero">
      <div className="hero-background">
        <img
          src={heroImage}
          alt="Birthday Celebration"
          className="hero-image"
        />
      </div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        {/* LEFT SIDE - Title */}
        <div className="hero-left">
          <div className="hero-text-container">
            <div className="hero-badge">CELEBRATE LIFE</div>
            <h1 className="hero-title">
              <span className="title-line">Birthday</span>
              <span className="title-highlight">Photography</span>
            </h1>
            <div className="hero-divider"></div>
            <p className="hero-subtitle">
              Capturing your special moments, one smile at a time.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - 2x2 Grid Images */}
        <div className="hero-right">
          <div className="hero-grid">
            <div className="hero-grid-item">
              <img src={gridImg1} alt="Birthday 1" />
            </div>
            <div className="hero-grid-item">
              <img src={gridImg2} alt="Birthday 2" />
            </div>
            <div className="hero-grid-item">
              <img src={gridImg3} alt="Birthday 3" />
            </div>
            <div className="hero-grid-item">
              <img src={gridImg4} alt="Birthday 4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayHero;