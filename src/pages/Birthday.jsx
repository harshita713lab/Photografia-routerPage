// src/pages/Birthday.jsx
import React, { useState } from 'react';
import '../Styles/birthday/Birthday.css';
import BirthdayHero from '../Components/Birthday/BirthdayHero';
import BirthdayIntro from '../Components/Birthday/BirthdayIntro';
import BirthdayServices from '../Components/Birthday/BirthdayServices';
import BirthdayServicesSection from '../Components/Birthday/BirthdayServicesSection';
import BirthdayGallery from '../Components/Birthday/BirthdayGallery';
import BirthdayCarousel from '../Components/Birthday/BirthdayCarousel';
import BirthdayFAQ from '../Components/Birthday/BirthdayFAQ';
import BirthdayCTA from '../Components/Birthday/BirthdayCTA';
import BirthdayOtherWork from '../Components/Birthday/BirthdayOtherWork';

const Birthday = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <BirthdayHero />
      <BirthdayIntro />
      <BirthdayGallery onImageClick={setSelectedImage} />
      <BirthdayServices onImageClick={setSelectedImage} />
      <BirthdayServicesSection />
      <BirthdayOtherWork />
      <BirthdayCarousel />
      <BirthdayFAQ />
      <BirthdayCTA />
      

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="birthday-lightbox"
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

export default Birthday;