// src/Components/Roka/RokaIntro.jsx
import React from 'react';
import "../../Styles/roka/Roka.css";

const RokaIntro = () => {
  return (
    <div className="roka-intro scroll-fade-up">
      <div className="intro-container">
        <div className="intro-image-column scroll-slide-left">
          <div className="intro-image-wrapper">
            <img 
              src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Roka Ceremony" 
              className="intro-image" 
            />
          </div>
        </div>
        <div className="intro-content-column scroll-slide-right">
          <div className="intro-content-wrapper">
            <div className="intro-badge">ABOUT ROKA CEREMONY</div>
            <h2 className="intro-title">
              A Sacred Beginning of <br />
              <span className="intro-title-highlight">Two Hearts and Two Families</span>
            </h2>
            <div className="intro-divider"></div>
            <p className="intro-description">
              The Roka ceremony is one of the most cherished pre-wedding rituals in Indian culture. 
              It marks the formal announcement that two families have agreed to the union of their children.
            </p>
            <p className="intro-description">
              From the moment the groom's family arrives to the tilak ceremony, from the exchange of 
              rings and gifts to the heartfelt blessings of elders – every detail is filled with meaning and emotion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RokaIntro;