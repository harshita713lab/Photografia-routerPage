// src/pages/maternityPage/Maternity.jsx
import React, { useState } from 'react';
import MaternityHero from '../../components/maternity/MaternityHero';
import MaternityBigSection from '../../components/maternity/MaternityBigSection';
import MaternityGallery from '../../components/maternity/MaternityGallery';
import MaternityBlog from '../../components/maternity/MaternityBlog';
import MaternityServices from '../../components/maternity/MaternityServices';
import MaternityCarousel from '../../components/maternity/MaternityCarousel';
import MaternityFAQ from '../../components/maternity/MaternityFAQ';
import MaternityOtherWork from '../../components/maternity/MaternityOtherWork';
import MaternityCTA from '../../components/maternity/MaternityCTA';
import '../../Styles/global/animations.css';
import '../../Styles/maternity/Maternity.module.css';

const Maternity = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCTAClick = () => {
    alert("🎉 Thank you! We'll contact you shortly to book your maternity photography session.");
  };

  return (
    <>
      <MaternityHero />
      <MaternityBigSection />
      <MaternityGallery onImageClick={(src) => setSelectedImage(src)} />
      <MaternityBlog />
      <MaternityServices />
      <MaternityOtherWork />
      <MaternityCarousel />
      <MaternityFAQ />
      <MaternityCTA onButtonClick={handleCTAClick} />

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content">
            <img src={selectedImage} alt="Full size" className="lightbox-image" />
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Maternity;