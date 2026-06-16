// src/pages/rokaPage/Roka.jsx
import React, { useState } from 'react';
import OtherWork from '../../components/common/OtherWork';
import RokaHero from '../../components/roka/RokaHero';
import RokaServices from '../../components/roka/RokaServices';
import RokaServicesSection from '../../components/roka/RokaServicesSection';
import RokaGallery from '../../components/roka/RokaGallery';
import RokaBlog from '../../components/roka/RokaBlog';
import RokaFAQ from '../../components/roka/RokaFAQ';
import RokaCTA from '../../components/roka/RokaCTA';
import VideoGrid from '../../components/common/VideoGrid';

const Roka = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (src) => {
    setSelectedImage(src);
  };

  const handleCTAClick = () => {
    alert("Booking session!");
  };

  const blogData = [
    {
      id: 1,
      title: "The Perfect Roka Ceremony Guide",
      subtitle: "Wedding Planning",
      description: "Everything you need to know about planning the perfect Roka ceremony.",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 2,
      title: "Roka Photography Tips",
      subtitle: "Photography Tips",
      description: "How to capture the most beautiful moments during your Roka ceremony.",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      title: "Traditional Roka Rituals",
      subtitle: "Traditions",
      description: "Understanding the significance of each ritual in a Roka ceremony.",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  const handleBlogClick = (blog) => {
    console.log("Blog clicked:", blog);
  };

  const videoData = [
    {
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      poster: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Roka Ceremony Highlights"
    }
  ];

  return (
    <>
      <RokaHero />
      <RokaServices onImageClick={handleImageClick} />
      <RokaBlog 
        blogs={blogData} 
        onBlogClick={handleBlogClick}
        sectionTitle="Roka Blogs"
        sectionSubtitle="Tips and inspiration for your Roka ceremony"
      />
      <RokaGallery onImageClick={handleImageClick} />
      <RokaServicesSection />
      <VideoGrid 
        videos={videoData}
        singleVideoSize="fullscreen"
        fullWidth={true}
      />
      <RokaFAQ />
      <OtherWork />
      <RokaCTA onButtonClick={handleCTAClick} />

      {selectedImage && (
        <div 
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
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img 
              src={selectedImage} 
              alt="Full size" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} 
            />
            <button 
              onClick={() => setSelectedImage(null)}
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