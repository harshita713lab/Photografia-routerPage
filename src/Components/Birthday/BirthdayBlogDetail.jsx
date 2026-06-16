// src/components/birthday/BirthdayBlogDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/birthday/Birthday.module.css';

// ===== ASSETS SE IMPORT =====
import galleryImg1 from '../../assets/birthday/image/img1.jpg';
import galleryImg2 from '../../assets/birthday/image/birthday2.jpg';
import galleryImg3 from '../../assets/birthday/image/birthday3.jpg';
import galleryImg4 from '../../assets/birthday/image/birthday4.jpg';
import galleryImg5 from '../../assets/birthday/image/birthday5.jpg';
import galleryImg6 from '../../assets/birthday/image/birthday6.webp';
import galleryImg7 from '../../assets/birthday/image/birthday7.jpg';
import galleryImg8 from '../../assets/birthday/image/birthday8.jpg';

const BirthdayBlogDetail = ({ blog }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h2>Blog Not Found</h2>
        <button onClick={() => navigate('/birthday')}>Go Back</button>
      </div>
    );
  }

  const galleryImages = [
    { id: 1, src: galleryImg1, alt: "Birthday 1", orientation: "landscape" },
    { id: 2, src: galleryImg2, alt: "Birthday 2", orientation: "portrait" },
    { id: 3, src: galleryImg3, alt: "Birthday 3", orientation: "square" },
    { id: 4, src: galleryImg4, alt: "Birthday 4", orientation: "landscape" },
    { id: 5, src: galleryImg5, alt: "Birthday 5", orientation: "portrait" },
    { id: 6, src: galleryImg6, alt: "Birthday 6", orientation: "square" },
    { id: 7, src: galleryImg7, alt: "Birthday 7", orientation: "landscape" },
    { id: 8, src: galleryImg8, alt: "Birthday 8", orientation: "portrait" },
  ];

  const getOrientationClass = (orientation) => {
    switch(orientation) {
      case 'landscape': return styles.detailGalleryLandscape;
      case 'portrait': return styles.detailGalleryPortrait;
      default: return styles.detailGallerySquare;
    }
  };

  return (
    <div className={styles.blogDetailContainer}>
      
      {/* ===== HERO SECTION ===== */}
      <div className={`${styles.blogDetailHero} fade-in`}>
        <img src={blog.heroImage || blog.image} alt={blog.title} className={styles.blogDetailHeroImage} />
        <div className={styles.blogDetailHeroOverlay}></div>
        <div className={styles.blogDetailHeroContent}>
          <div className={styles.blogDetailHeroInner}>
            <span className={`${styles.blogDetailBadge} fade-in-delay-1`}>{blog.subtitle}</span>
            <h1 className={`${styles.blogDetailTitle} title-reveal`}>
              {blog.title.split(' ').map((word, i) => (
                <span key={i} className={styles.titleWord} style={{ animationDelay: `${i * 0.12}s` }}>
                  {word}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>

      {/* ===== BIG IMAGE + BOHOT SAARA CONTENT ===== */}
      <div className={`${styles.blogDetailBigSection} scroll-reveal`}>
        <div className={styles.blogDetailBigContainer}>
          
          {/* LEFT - BIG IMAGE */}
          <div className={`${styles.blogDetailBigImage} scroll-zoom`}>
            <img src={blog.image} alt={blog.title} />
          </div>
          
          {/* RIGHT - BOHOT SAARA CONTENT */}
          <div className={`${styles.blogDetailBigContent} scroll-slide-right`}>
            <h2 className={styles.blogDetailBigTitle}>{blog.title}</h2>
            <div className={styles.blogDetailBigLine}></div>
            
            <p className={styles.blogDetailBigDesc}>
              {blog.description}
            </p>

            {/* ===== EXTRA CONTENT - IMAGE KE BARE MEIN ===== */}
            <div className={styles.blogDetailBigText}>
              
              <h3>About This Image</h3>
              <p>
                This stunning photograph captures the essence of a birthday celebration - the joy, the laughter, 
                and the pure happiness that fills the air. The vibrant colors and natural lighting bring out the 
                emotions of the moment, making it a timeless memory.
              </p>

              <h3>The Story Behind the Frame</h3>
              <p>
                Every picture tells a story, and this one is no exception. Taken during a beautiful birthday celebration, 
                this image reflects the genuine smiles and heartfelt connections shared between family and friends. 
                The candid nature of the shot makes it even more special.
              </p>

              <h3>Why This Photograph Matters</h3>
              <p>
                Photographs like these are more than just images - they are portals to the past. They allow us to 
                relive the joy, the excitement, and the love that was present on that special day. This photograph 
                captures a moment that will be cherished for generations to come.
              </p>

              <h3>The Art of Birthday Photography</h3>
              <p>
                Birthday photography is about capturing the essence of celebration. It's about freezing moments 
                of happiness, the sparkle in the eyes of the birthday person, the laughter of friends, and the 
                warmth of family gatherings. Every shot is carefully composed to tell a story.
              </p>

              <h3>Lighting & Composition</h3>
              <p>
                The lighting in this photograph plays a crucial role in its impact. Natural light streaming in 
                creates a soft, warm glow that enhances the mood of the celebration. The composition draws the 
                viewer's eye to the main subject while still capturing the surrounding joy.
              </p>

              <h3>Emotional Connection</h3>
              <p>
                What makes this photograph truly special is the emotional connection it creates. The genuine 
                smiles, the candid laughter, and the unguarded moments - these are the elements that make 
                birthday photography so powerful and meaningful.
              </p>

              <h3>Preserving Memories</h3>
              <p>
                In today's digital age, photographs serve as our most precious keepsakes. They preserve the 
                moments that matter most, allowing us to revisit them whenever we need a reminder of life's 
                beautiful moments. This image is a perfect example of that.
              </p>

              <h3>The Photographer's Perspective</h3>
              <p>
                From the photographer's perspective, capturing the perfect birthday moment requires patience, 
                skill, and an understanding of human emotions. It's about being in the right place at the right 
                time and having the technical expertise to freeze that perfect moment forever.
              </p>

              <h3>Celebrating Life Through Photography</h3>
              <p>
                Ultimately, birthday photography is about celebrating life. It's about honoring the milestones, 
                the growth, and the joy that each birthday represents. This photograph is a testament to that 
                celebration, capturing the essence of a life being celebrated.
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      <div className={`${styles.blogDetailGallerySection} scroll-reveal`}>
        <div className={styles.sectionHeader}>
          <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Birthday Moments Gallery</h2>
          <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
          <p className={`${styles.sectionSubtitle} fade-in-delay-3`}>
            Capturing the joy, laughter, and unforgettable memories through our lens
          </p>
        </div>
        <div className={`${styles.blogDetailGalleryGrid} stagger-children`}>
          {galleryImages.map((img) => (
            <div 
              key={img.id} 
              className={`${styles.blogDetailGalleryItem} ${getOrientationClass(img.orientation)}`}
              onClick={() => setSelectedImage(img.src)}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== INFO BOX ===== */}
      <div className={`${styles.infoBoxSection} scroll-reveal`}>
        <div className={styles.infoBoxContainer}>
          <div className={styles.infoBoxHeader}>
            <h2 className={`${styles.infoBoxTitle} fade-in-delay-1`}>Why Choose Our Photography?</h2>
            <div className={`${styles.infoBoxLine} fade-in-delay-2`}></div>
            <p className={`${styles.infoBoxSubtitle} fade-in-delay-3`}>
              Professional photography that captures every emotion, every smile, and every unforgettable moment
            </p>
          </div>

          <div className={`${styles.infoBoxGrid} stagger-children`}>
            <div className={styles.infoBoxItem}>
              <span className={styles.infoBoxIcon}>📸</span>
              <h3>Expert Photographers</h3>
              <p>Our team specializes in capturing the essence of your special day with creativity and precision.</p>
            </div>

            <div className={styles.infoBoxItem}>
              <span className={styles.infoBoxIcon}>❤️</span>
              <h3>Emotional Storytelling</h3>
              <p>We tell the story of your celebration through candid moments, genuine emotions, and beautiful compositions.</p>
            </div>

            <div className={styles.infoBoxItem}>
              <span className={styles.infoBoxIcon}>✨</span>
              <h3>High-Quality Images</h3>
              <p>Every photo is captured in high resolution and professionally edited for stunning, gallery-worthy results.</p>
            </div>

            <div className={styles.infoBoxItem}>
              <span className={styles.infoBoxIcon}>🎯</span>
              <h3>Personalized Experience</h3>
              <p>We work closely with you to understand your vision and deliver a photography experience that exceeds expectations.</p>
            </div>

            <div className={styles.infoBoxItem}>
              <span className={styles.infoBoxIcon}>⏰</span>
              <h3>Quick Delivery</h3>
              <p>Receive a sneak peek within 24 hours and your full gallery within 7-10 business days.</p>
            </div>

            <div className={styles.infoBoxItem}>
              <span className={styles.infoBoxIcon}>💎</span>
              <h3>Premium Albums</h3>
              <p>Beautifully designed premium leather albums and canvas prints to preserve your cherished memories.</p>
            </div>
          </div>
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

export default BirthdayBlogDetail;