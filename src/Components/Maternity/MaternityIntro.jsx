// src/Components/Maternity/MaternityIntro.jsx
import React from 'react';
import '../../Styles/maternity/Maternity.css';
// ✅ Local image import
import introImage from '../../assets/maternity/images/maternity1.jpg';

const MaternityIntro = () => {
  return (
    <div className="maternity-intro scroll-fade-up">
      <div className="intro-container">
        <div className="intro-image-column scroll-slide-left">
          <div className="intro-image-wrapper">
            <img 
              src={introImage}
              alt="Maternity" 
              className="intro-image" 
            />
          </div>
        </div>
        <div className="intro-content-column scroll-slide-right">
          <div className="intro-content-wrapper">
            <div className="intro-badge">ABOUT MATERNITY PHOTOGRAPHY</div>
            <h2 className="intro-title">
              Celebrating the Beauty of <br />
              <span className="intro-title-highlight">Motherhood</span>
            </h2>
            <div className="intro-divider"></div>
            <p className="intro-description">
              Maternity photography is a beautiful way to celebrate the journey of pregnancy 
              and the miracle of new life. We capture the glow, the love, and the anticipation.
            </p>
            <p className="intro-description">
              From intimate studio sessions to outdoor shoots, we create timeless images 
              that celebrate the beauty and strength of every expecting mother.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaternityIntro;