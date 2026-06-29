// src/Components/Maternity/MaternityServices.jsx
import React from 'react';
import '../../Styles/maternity/Maternity.css';
// ✅ Local image imports
import serviceImage1 from '../../assets/maternity/images/maternity2.jpg';
import serviceImage2 from '../../assets/maternity/images/maternity3.jpg';

const MaternityServices = ({ onImageClick }) => {
  const sections = [
    {
      id: 1,
      image: serviceImage1,
      badge: "MATERNITY PHOTOGRAPHY",
      title: "Capturing the Beauty of",
      highlightText: "Motherhood",
      paragraphs: [
        "Maternity photography is a beautiful way to celebrate the journey of pregnancy and the miracle of new life.",
        "We capture the glow, the love, and the anticipation that comes with expecting a baby.",
        "Our photographs become cherished memories that families treasure for generations."
      ]
    },
    {
      id: 2,
      image: serviceImage2,
      badge: "PREGNANCY SESSIONS",
      title: "Every Moment is",
      highlightText: "Precious",
      paragraphs: [
        "From intimate studio sessions to outdoor shoots, we create timeless images that celebrate the beauty and strength of every expecting mother.",
        "We document the love, the connection, and the pure joy of this special time.",
        "Let us help you preserve these precious moments forever."
      ]
    }
  ];

  return (
    <div className="maternity-services">
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

export default MaternityServices;