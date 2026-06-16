// src/pages/birthdayPage/Birthday.jsx
import React, { useState } from 'react';
import BirthdayHero from '../../components/birthday/BirthdayHero';
import BirthdayServices from '../../components/birthday/BirthdayServices';
import BirthdayGallery from '../../components/birthday/BirthdayGallery';
import BirthdayBlog from '../../components/birthday/BirthdayBlog';
import '../../Styles/global/animations.css';
import '../../Styles/birthday/Birthday.module.css';
import BirthdayOtherWork from '../../Components/Birthday/BirthdayOtherWork';
import BirthdayCarousel from '../../Components/Birthday/BirthdayCarousel';
import BirthdayFAQ from '../../Components/Birthday/BirthdayFAQ';
import BirthdayCTA from '../../Components/Birthday/BirthdayCTA';

const Birthday = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <BirthdayHero />
      <BirthdayGallery onImageClick={(src) => setSelectedImage(src)} />
      <BirthdayBlog />
      <BirthdayServices />
      <BirthdayOtherWork />
      <BirthdayCarousel />
      <BirthdayFAQ />
      <BirthdayCTA />

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

export default Birthday;