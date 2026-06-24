// src/components/maternity/MaternityBlogDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/maternity/Maternity.module.css';

// ===== ASSETS SE IMPORT =====
import galleryImg1 from '../../assets/maternity/images/maternity1.jpg';
import galleryImg2 from '../../assets/maternity/images/maternity2.jpg';
import galleryImg3 from '../../assets/maternity/images/maternity3.jpg';
import galleryImg4 from '../../assets/maternity/images/maternity4.jpg';
import galleryImg5 from '../../assets/maternity/images/maternity5.jpg';
import galleryImg6 from '../../assets/maternity/images/maternity6.jpg';
import galleryImg7 from '../../assets/maternity/images/maternity7.jpg';
import galleryImg8 from '../../assets/maternity/images/maternity8.jpg';
import sideImg from '../../assets/maternity/images/maternity1.jpg';

const MaternityBlogDetail = ({ blog }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h2>Blog Not Found</h2>
        <button onClick={() => navigate('/maternity')}>Go Back</button>
      </div>
    );
  }

  const galleryImages = [
    { id: 1, src: galleryImg1, alt: "Maternity 1", orientation: "landscape" },
    { id: 2, src: galleryImg2, alt: "Maternity 2", orientation: "portrait" },
    { id: 3, src: galleryImg3, alt: "Maternity 3", orientation: "square" },
    { id: 4, src: galleryImg4, alt: "Maternity 4", orientation: "landscape" },
    { id: 5, src: galleryImg5, alt: "Maternity 5", orientation: "portrait" },
    { id: 6, src: galleryImg6, alt: "Maternity 6", orientation: "square" },
    { id: 7, src: galleryImg7, alt: "Maternity 7", orientation: "landscape" },
    { id: 8, src: galleryImg8, alt: "Maternity 8", orientation: "portrait" },
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
      
      {/* ===== 1. HERO SECTION ===== */}
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

      {/* ===== 2. CONTENT ===== */}
      <div className={styles.blogDetailContentSection}>
        <div className={styles.blogDetailContentWrapper}>
          
          {/* LEFT - Content */}
          <div className={styles.blogDetailContentLeft}>
            <div className={styles.blogDetailContent}>
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              
              <h3>The Beauty of Maternity Photography</h3>
              <p>
                Maternity photography is more than just taking pictures; it's about capturing the essence of 
                motherhood. It's about documenting the love, the anticipation, and the incredible journey that 
                brings new life into the world.
              </p>
              
              <h3>Why Choose Professional Maternity Photography</h3>
              <p>
                Professional maternity photography ensures that your precious moments are captured with 
                artistic vision and technical expertise. From the perfect lighting to the most flattering angles, 
                a professional photographer knows how to highlight the beauty of your pregnancy journey.
              </p>
              
              <h3>Creating Lasting Memories</h3>
              <p>
                These photographs become treasured heirlooms that you and your family will cherish for 
                generations. They capture not just how you looked, but how you felt during this magical time.
              </p>
              
              <h3>Tips for a Perfect Maternity Photoshoot</h3>
              <ul>
                <li><strong>Choose the Right Time:</strong> Schedule your shoot between 28-34 weeks.</li>
                <li><strong>Wear Comfortable Outfits:</strong> Choose clothing that makes you feel beautiful.</li>
                <li><strong>Include Your Partner:</strong> Capture the love and support of your partner.</li>
                <li><strong>Natural Light:</strong> Golden hour provides the most beautiful lighting.</li>
                <li><strong>Be Yourself:</strong> The best photos capture genuine emotions.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT - Side Image Box (Same Height as Content) */}
          <div className={styles.blogDetailContentRight}>
            <div className={styles.sideImageBox}>
              <img src={sideImg} alt="Maternity" />
            </div>
          </div>

        </div>
      </div>

      {/* ===== 3. GALLERY ===== */}
      <div className={styles.blogDetailGallerySection}>
        <div className={styles.sectionHeader}>
          <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Maternity Moments</h2>
          <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
          <p className={`${styles.sectionSubtitle} fade-in-delay-3`}>A glimpse into the beautiful journey of motherhood</p>
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

      {/* ===== 4. INFO BOX ===== */}
      <div className={styles.infoBoxSection}>
        <div className={styles.infoBoxContainer}>
          <div className={styles.infoBoxHeader}>
            <h2 className={`${styles.infoBoxTitle} fade-in-delay-1`}>About Maternity Photography</h2>
            <div className={`${styles.infoBoxLine} fade-in-delay-2`}></div>
            <p className={`${styles.infoBoxSubtitle} fade-in-delay-3`}>Everything you need to know about capturing the beauty of motherhood</p>
          </div>
          <div className={`${styles.infoBoxGrid} stagger-children`}>
            {[
              { title: "Professional Expertise", desc: "Our photographers specialize in maternity photography with years of experience." },
              { title: "Emotional Connection", desc: "We capture genuine emotions, love, and the unique bond between mother and baby." },
              { title: "Artistic Vision", desc: "Every photoshoot is designed to highlight the beauty and glow of motherhood." },
              { title: "Personalized Experience", desc: "We create a personalized experience that reflects your unique style." },
              { title: "Quick Delivery", desc: "Sneak peek within 24 hours and full gallery within 7-10 business days." },
              { title: "Premium Quality", desc: "High-resolution images with professional editing and premium prints." }
            ].map((item, index) => (
              <div key={index} className={styles.infoBoxItem}>
                <h3 className={styles.infoBoxItemTitle}>{item.title}</h3>
                <p className={styles.infoBoxItemDesc}>{item.desc}</p>
              </div>
            ))}
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

export default MaternityBlogDetail;