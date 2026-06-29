// src/Components/Maternity/MaternityHero.jsx
import React, { useRef, useEffect } from 'react';
import '../../Styles/maternity/Maternity.css';
// ✅ Local video import
import heroVideo from '../../assets/maternity/video/Video1.mp4';

const MaternityHero = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }, []);

  return (
    <div className="maternity-hero">
      <div className="hero-background">
        <video
          ref={videoRef}
          src={heroVideo}
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        {/* CENTER - Title only */}
        <div className="hero-center">
          <div className="hero-text-container">
            <div className="hero-badge">CELEBRATING MOTHERHOOD</div>
            <h1 className="hero-title">
              <span className="title-line">Maternity</span>
              <span className="title-highlight">Photography</span>
            </h1>
            <div className="hero-divider"></div>
            <p className="hero-subtitle">
              Capturing the beauty and grace of motherhood.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaternityHero;