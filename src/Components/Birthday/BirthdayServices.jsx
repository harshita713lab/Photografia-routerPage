// src/Components/Birthday/BirthdayServices.jsx
import React from 'react';
import "../../Styles/birthday/Birthday.css";
// ✅ Local image imports
import serviceImage1 from '../../assets/birthday/image/birthday3.jpg';
import serviceImage2 from '../../assets/birthday/image/birthday4.jpg';

const BirthdayServices = ({ onImageClick }) => {
  const sections = [
    {
      id: 1,
      image: serviceImage1,
      badge: "BIRTHDAY PHOTOGRAPHY",
      title: "Capturing the Joy of",
      highlightText: "Your Special Day",
      paragraphs: [
        "Birthday photography is about capturing the joy, laughter, and love that fills the air on your special day.",
        "From the first slice of cake to the last dance, we freeze those moments forever.",
        "Our photography tells the story of your celebration with authenticity and emotion."
      ]
    },
    {
      id: 2,
      image: serviceImage2,
      badge: "MILESTONE CELEBRATIONS",
      title: "Making Every Moment",
      highlightText: "Unforgettable",
      paragraphs: [
        "Whether it's a child's first birthday or a milestone celebration, we capture the essence of your special day.",
        "Our photography tells the story of your celebration with authenticity and emotion.",
        "We preserve the smiles, laughter, and love that make your birthday truly memorable."
      ]
    }
  ];

  return (
    <div className="birthday-services">
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

export default BirthdayServices;