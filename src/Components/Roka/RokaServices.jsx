// src/Components/Roka/RokaServices.jsx
import React from 'react';
import "../../Styles/roka/Roka.css";

const RokaServices = ({ onImageClick }) => {
  const sections = [
    {
      id: 1,
      image: "https://cliveblair.co.uk/wp-content/uploads/2025/06/asian-roka-pre-wedding-event-0063.jpg",
      badge: "ABOUT ROKA CEREMONY",
      title: "A Sacred Beginning of",
      highlightText: "Two Hearts and Two Families",
      paragraphs: [
        "The Roka ceremony is one of the most cherished pre-wedding rituals in Indian culture.",
        "From the moment the groom's family arrives to the tilak ceremony, every detail is filled with meaning.",
        "Our photography captures not just the rituals, but the emotions behind them."
      ]
    },
    {
      id: 2,
      image: "https://cliveblair.co.uk/wp-content/uploads/2025/06/asian-roka-pre-wedding-event-0054.jpg",
      badge: "TRADITIONS & RITUALS",
      title: "Capturing Every",
      highlightText: "Sacred Moment",
      paragraphs: [
        "Every ritual in a Roka ceremony holds deep cultural significance.",
        "We document not just the actions, but the emotions behind them.",
        "These photographs become heirlooms that will remind you of your love story."
      ]
    }
  ];

  return (
    <div className="roka-services">
      <div className="alt-container">
        {sections.map((section, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={section.id} className="alt-section">
              <div className={`alt-inner ${isLeft ? 'alt-inner-left' : 'alt-inner-right'}`}>
                <div className={`alt-image-col ${isLeft ? 'scroll-slide-left' : 'scroll-slide-right'}`}>
                  <div className="alt-image-wrap">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="alt-image"
                      onClick={() => onImageClick && onImageClick(section.image)}
                    />
                  </div>
                </div>
                <div className={`alt-content-col ${isLeft ? 'scroll-slide-right' : 'scroll-slide-left'}`}>
                  <div className="alt-content-wrap">
                    <div className="alt-badge">{section.badge}</div>
                    <h2 className="alt-title">
                      {section.title}
                      <br />
                      <span className="alt-title-highlight">{section.highlightText}</span>
                    </h2>
                    <div className="alt-divider"></div>
                    {section.paragraphs.map((para, idx) => (
                      <p key={idx} className="alt-description">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RokaServices;