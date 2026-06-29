// src/Components/Roka/RokaHero.jsx
import React from 'react';
import "../../Styles/roka/Roka.css";

const RokaHero = () => {
  return (
    <div className="roka-hero">
      <div className="hero-background">
        <img
          src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Roka Ceremony"
          className="hero-image"
        />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-text-container">
          <div className="hero-badge">SACRED BEGINNINGS</div>
          <h1 className="hero-title">
            <span className="title-line">Roka</span>
            <span className="title-highlight">Ceremony</span>
          </h1>
          <div className="hero-divider"></div>
          <p className="hero-subtitle">
            Where two hearts meet and two families become one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RokaHero;