// src/Components/Birthday/BirthdayIntro.jsx
import React from 'react';
import '../../Styles/birthday/Birthday.css';
// ✅ Local image import
import introImage from '../../assets/birthday/image/birthday2.jpg';

const BirthdayIntro = () => {
  return (
    <div className="birthday-intro scroll-fade-up">
      <div className="intro-container">
        <div className="intro-image-column scroll-slide-left">
          <div className="intro-image-wrapper">
            <img 
              src={introImage}
              alt="Birthday Celebration" 
              className="intro-image" 
            />
          </div>
        </div>
        <div className="intro-content-column scroll-slide-right">
          <div className="intro-content-wrapper">
            <div className="intro-badge">ABOUT BIRTHDAY PHOTOGRAPHY</div>
            <h2 className="intro-title">
              Every Birthday Tells a <br />
              <span className="intro-title-highlight">Beautiful Story</span>
            </h2>
            <div className="intro-divider"></div>
            <p className="intro-description">
              Birthday photography is about capturing the joy, laughter, and love that fills the air on your special day.
              From the first slice of cake to the last dance, we freeze those moments forever.
            </p>
            <p className="intro-description">
              Whether it's a child's first birthday or a milestone celebration, our photography tells the story 
              of your celebration with authenticity and emotion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayIntro;