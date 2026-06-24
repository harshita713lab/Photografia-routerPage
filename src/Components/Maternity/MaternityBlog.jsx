// src/components/maternity/MaternityBlog.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/maternity/Maternity.module.css';

// ===== ASSETS SE IMPORT =====
import blogImg1 from '../../assets/maternity/images/maternity1.jpg';
import blogImg2 from '../../assets/maternity/images/maternity2.jpg';
import blogImg3 from '../../assets/maternity/images/maternity3.jpg';

const MaternityBlog = () => {
  const navigate = useNavigate();

  const blogs = [
    {
      id: 1,
      title: "Growing Mother",
      subtitle: "The Journey Within",
      description: "A beautiful journey of love, growth, and transformation. Every moment of motherhood is a story waiting to be told.",
      image: blogImg1,
      heroImage: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
      content: `
        <h2>Growing Mother</h2>
        <p>Motherhood is not just about growing a baby; it's about growing a mother. Every day brings new changes, new emotions, and a deeper connection with the life inside you.</p>
        <p>The journey of pregnancy is a beautiful transformation—physically, emotionally, and spiritually. It's a time when you discover a strength you never knew you had.</p>
        <p>From the first flutter to the first kick, every moment is a reminder of the miracle unfolding within. This is a time to celebrate the beauty of growth and the power of love.</p>
      `
    },
    {
      id: 2,
      title: "Parents to Be",
      subtitle: "Embracing the Journey Together",
      description: "The beautiful bond of two hearts preparing to welcome a new life. A story of love, anticipation, and togetherness.",
      image: blogImg2,
      heroImage: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200",
      content: `
        <h2>Parents to Be</h2>
        <p>The journey to parenthood is one of the most beautiful chapters in a couple's life. It's a time of dreaming, planning, and growing together.</p>
        <p>From the first positive test to the first ultrasound, every moment is filled with excitement and wonder. This journey brings two hearts even closer.</p>
        <p>As you prepare to welcome your little one, you also prepare to become the best versions of yourselves. Parenthood is not just about having a baby; it's about becoming a family.</p>
      `
    },
    {
      id: 3,
      title: "Sibling Love",
      subtitle: "A Bond Like No Other",
      description: "The beautiful bond between siblings begins before birth. Capturing the love and excitement of becoming a big brother or sister.",
      image: blogImg3,
      heroImage: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200",
      content: `
        <h2>Sibling Love</h2>
        <p>The bond between siblings is one of the most precious relationships in life. It begins long before they meet, with excitement, anticipation, and love.</p>
        <p>Including siblings in maternity photoshoots creates beautiful memories that will be cherished forever. The connection between siblings is unique, pure, and unconditional.</p>
        <p>As the family grows, so does the love. Sibling love is a special bond that lasts a lifetime, and capturing it during this beautiful journey is truly priceless.</p>
      `
    }
  ];

  const handleBlogClick = (blog) => {
    navigate(`/maternity-blog/${blog.id}`, { state: { blog } });
  };

  return (
    <div className={`${styles.blogSection} scroll-reveal`}>
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Maternity Stories</h2>
        <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
        <p className={`${styles.sectionSubtitle} fade-in-delay-3`}>
          Celebrating the beauty, love, and journey of motherhood
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
                <span className={styles.blogCardNumber}>0{index + 1}</span>
                <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                <p className={styles.blogCardDesc}>{blog.description}</p>
                <span className={styles.blogCardLink}>Discover More →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaternityBlog;