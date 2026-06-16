// src/components/roka/RokaBlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/roka/RokaBlogDetail.module.css';
import HeroImageWithContent from './HeroImageWithContent';
import GalleryGrid from '../common/GalleryGrid';

const RokaBlogDetail = ({ blog }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h2>Blog Not Found</h2>
        <button onClick={() => navigate('/roka')}>Go Back</button>
      </div>
    );
  }

  const heroSections = [
    {
      title: "ABOUT THIS ARTICLE",
      paragraphs: [blog.description]
    },
    {
      title: "THE SIGNIFICANCE OF ROKA",
      paragraphs: [
        "The Roka ceremony is one of the most cherished pre-wedding rituals in Indian culture.",
        "From the moment the groom's family arrives to the tilak ceremony, every detail is filled with meaning.",
        "Professional photography ensures that every moment is preserved for generations."
      ]
    }
  ];

  const galleryImages = [
    { id: 1, src: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Roka 1", orientation: "landscape" },
    { id: 2, src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=800", alt: "Roka 2", orientation: "portrait" },
    { id: 3, src: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600&h=600", alt: "Roka 3", orientation: "square" },
    { id: 4, src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Roka 4", orientation: "landscape" },
    { id: 5, src: "https://images.pexels.com/photos/34819639/pexels-photo-34819639/free-photo-of-romantic-beachside-maternity-couple-portrait.jpeg?w=600&h=800", alt: "Roka 5", orientation: "portrait" },
    { id: 6, src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=600", alt: "Roka 6", orientation: "square" },
  ];

  return (
    <div className={styles.blogDetailContainer}>
      
      {/* ===== 1. HERO SECTION ===== */}
      <div className={styles.blogHero}>
        <img src={blog.image} alt={blog.title} className={styles.blogHeroImage} />
        <div className={styles.blogHeroOverlay}>
          <div className={styles.blogHeroContent}>
            <span className={styles.blogHeroSubtitle}>{blog.subtitle}</span>
            <h1 className={styles.blogHeroTitle}>{blog.title}</h1>
          </div>
        </div>
      </div>

      {/* ===== 2. BIG IMAGE - TITLE + DESCRIPTION ===== */}
      <div className={styles.bigImageIntroSection}>
        <div className={styles.bigImageIntroContent}>
          <h2 className={styles.bigImageIntroTitle}>The Sacred Journey</h2>
          <div className={styles.bigImageIntroLine}></div>
          <p className={styles.bigImageIntroSubtitle}>
            A visual story of traditions, emotions, and togetherness
          </p>
        </div>
      </div>

      {/* ===== 3. BIG IMAGE WITH CONTENT ===== */}
      <HeroImageWithContent
        imageUrl="https://i.pinimg.com/736x/4d/88/df/4d88dfce1ad9d08c8348d1be2e1f05ac.jpg"
        sections={heroSections}
        onImageClick={() => setSelectedImage("https://i.pinimg.com/736x/4d/88/df/4d88dfce1ad9d08c8348d1be2e1f05ac.jpg")}
      />

      {/* ===== 4. GALLERY - TITLE + DESCRIPTION ===== */}
      <div className={styles.galleryIntroSection}>
        <div className={styles.galleryIntroContent}>
          <h2 className={styles.galleryIntroTitle}>Our Gallery</h2>
          <div className={styles.galleryIntroLine}></div>
          <p className={styles.galleryIntroSubtitle}>
            A glimpse into beautiful Roka ceremonies
          </p>
        </div>
      </div>

      {/* ===== 5. GALLERY GRID ===== */}
      <div className={styles.gallerySectionWhite}>
        <GalleryGrid 
          images={galleryImages} 
          onImageClick={(src) => setSelectedImage(src)}
        />
      </div>

      {/* ===== 6. INFOBOX (Without Contact Section) ===== */}
      <div className={styles.infoBoxSection}>
        <div className={styles.infoBox}>
          
          <div className={styles.infoHeader}>
            <h3 className={styles.infoTitle}>About Roka Ceremony</h3>
            <div className={styles.infoLine}></div>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoGridItem}>
              <span className={styles.infoLabel}>What is Roka?</span>
              <p className={styles.infoText}>
                Roka is a traditional pre-wedding ceremony where two families formally agree to the union 
                of their children. It marks the official beginning of wedding festivities.
              </p>
            </div>

            <div className={styles.infoGridItem}>
              <span className={styles.infoLabel}>Significance</span>
              <p className={styles.infoText}>
                The ceremony symbolizes acceptance, blessings, and the coming together of two families. 
                It's a promise of love, respect, and lifelong togetherness.
              </p>
            </div>

            <div className={styles.infoGridItem}>
              <span className={styles.infoLabel}>Best Time</span>
              <p className={styles.infoText}>
                Roka ceremonies are typically held on auspicious dates as per the Hindu calendar. 
                Most families prefer morning or afternoon hours for the rituals.
              </p>
            </div>

            <div className={styles.infoGridItem}>
              <span className={styles.infoLabel}>Photography Tips</span>
              <p className={styles.infoText}>
                Capture candid moments of family interactions
                Document the tilak ceremony in detail
                Take group photos with both families
                Don't miss the gift exchange moments
              </p>
            </div>
          </div>

          {/* ===== CONTACT SECTION REMOVED ===== */}

        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <div className={styles.lightboxContent}>
            <img src={selectedImage} alt="Full size" className={styles.lightboxImage} />
            <button className={styles.lightboxClose} onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RokaBlogDetail;