// src/pages/Maternity.jsx
import React, { useState } from 'react';
import '../Styles/maternity/Maternity.css';
import MaternityHero from '../Components/Maternity/MaternityHero';
import MaternityIntro from '../Components/Maternity/MaternityIntro';
import MaternityServices from '../Components/Maternity/MaternityServices';
import MaternityServicesSection from '../Components/Maternity/MaternityServicesSection';
import MaternityGallery from '../Components/Maternity/MaternityGallery';
import MaternityCarousel from '../Components/Maternity/MaternityCarousel';
import MaternityFAQ from '../Components/Maternity/MaternityFAQ';
import MaternityCTA from '../Components/Maternity/MaternityCTA';
import MaternityOtherWork from '../Components/Maternity/MaternityOtherWork';

const Maternity = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <MaternityHero />
      <MaternityIntro />
      <MaternityGallery onImageClick={setSelectedImage} />
      <MaternityServices onImageClick={setSelectedImage} />
      <MaternityServicesSection />
      <MaternityOtherWork />
      <MaternityCarousel />
      <MaternityFAQ />
      <MaternityCTA />
      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="maternity-lightbox"
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img 
              src={selectedImage} 
              alt="Full size" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} 
            />
            <button 
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '40px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Maternity;