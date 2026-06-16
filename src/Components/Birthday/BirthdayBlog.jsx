// src/components/birthday/BirthdayBlog.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/birthday/Birthday.module.css';

// ===== ASSETS SE IMPORT =====
import blogImg1 from '../../assets/birthday/image/img1.jpg';
import blogImg2 from '../../assets/birthday/image/birthday2.jpg';
import blogImg3 from '../../assets/birthday/image/birthday3.jpg';

const BirthdayBlog = () => {
  const navigate = useNavigate();

  const blogs = [
    {
      id: 1,
      title: "The Perfect Birthday Party Guide",
      subtitle: "Party Planning",
      description: "Everything you need to plan the perfect birthday party from start to finish.",
      image: blogImg1,
      heroImage: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
      content: `<h2>The Perfect Birthday Party Guide</h2><p>Planning a birthday party can be overwhelming...</p>`,
      gallery: [
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600"
      ]
    },
    {
      id: 2,
      title: "Birthday Photography Tips",
      subtitle: "Photography Tips",
      description: "How to capture the most beautiful moments during a birthday celebration.",
      image: blogImg2,
      heroImage: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200",
      content: `<h2>Birthday Photography Tips</h2><p>Capturing the perfect birthday celebration...</p>`,
      gallery: [
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600"
      ]
    },
    {
      id: 3,
      title: "Creative Birthday Decoration Ideas",
      subtitle: "Decoration Ideas",
      description: "Unique and creative decoration ideas for an unforgettable birthday celebration.",
      image: blogImg3,
      heroImage: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200",
      content: `<h2>Creative Birthday Decoration Ideas</h2><p>Transform any space into a magical celebration...</p>`,
      gallery: [
        "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600"
      ]
    }
  ];

  const handleBlogClick = (blog) => {
    navigate(`/birthday-blog/${blog.id}`, { state: { blog } });
  };

  return (
    <div className={styles.blogSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Birthday Blogs</h2>
        <div className={styles.sectionLine}></div>
        <p className={styles.sectionSubtitle}>
          Tips, ideas, and inspiration for your birthday celebration
        </p>
      </div>
      <div className={styles.blogContainer}>
        {blogs.map((blog, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div 
              key={blog.id} 
              className={`${styles.blogCard} ${isLeft ? styles.blogLeft : styles.blogRight}`}
              onClick={() => handleBlogClick(blog)}
            >
              <div className={styles.blogCardImage}>
                <img src={blog.image} alt={blog.title} />
                <div className={styles.blogCardOverlay}>
                  <span className={styles.blogCardBadge}>{blog.subtitle}</span>
                </div>
              </div>
              <div className={styles.blogCardContent}>
                <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                <p className={styles.blogCardDesc}>{blog.description}</p>
                <span className={styles.blogCardLink}>See All Our Work →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BirthdayBlog;