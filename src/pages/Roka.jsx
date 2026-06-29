// src/pages/Roka.jsx
import React, { useState } from 'react';
import '../Styles/roka/Roka.css';
import RokaHero from '../Components/Roka/RokaHero';
import RokaIntro from '../Components/Roka/RokaIntro';
import RokaServices from '../Components/Roka/RokaServices';
import RokaServicesSection from '../Components/Roka/RokaServicesSection';
import RokaGallery from '../Components/Roka/RokaGallery';
import RokaFAQ from '../Components/Roka/RokaFAQ';
import RokaCTA from '../Components/Roka/RokaCTA';
import RokaOtherWork from '../Components/Roka/RokaOtherWork';

const Roka = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <RokaHero />
      <RokaIntro />
      <RokaServices onImageClick={setSelectedImage} />
      <RokaGallery onImageClick={setSelectedImage} />
      <RokaServicesSection />
      <RokaOtherWork />
      <RokaFAQ />
      <RokaCTA />
      

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="roka-lightbox"
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

export default Roka;