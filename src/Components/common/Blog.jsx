// src/components/common/Blog.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../Styles/common/Blog.module.css';

const Blog = ({
  blogs,
  onBlogClick,
  columns = 3,
  showNumber = true,
  showSubtitle = true,
  showDescription = true,
  showFooter = true,
  footerText = "Read More →",
  imageHeight = "260px",
  cardBorderRadius = "16px",
  hoverEffect = true,
  containerClassName = '',
  sectionClassName = '',
  cardClassName = '',
  sectionTitle = "Latest Blogs",
  sectionSubtitle = "Tips and inspiration for your celebration",
  showSectionHeader = true,
}) => {
  
  const handleCardClick = (blog) => {
    console.log("Blog clicked:", blog);
    if (onBlogClick) {
      onBlogClick(blog);
    }
  };

  return (
    <div className={`${styles.blogsContainer} ${containerClassName}`}>
      {showSectionHeader && (
        <div className={`${styles.sectionHeader} ${sectionClassName}`}>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
          <div className={styles.sectionLine}></div>
          <p className={styles.sectionSubtitle}>{sectionSubtitle}</p>
        </div>
      )}

      <Container>
        <Row className="stagger-children">
          {blogs.map((blog, index) => (
            <Col 
              lg={12 / columns} 
              md={columns === 1 ? 12 : 6} 
              sm={12} 
              key={blog.id} 
              className={styles.blogCol}
            >
              <div 
                className={`${styles.blogCard} ${hoverEffect ? styles.blogCardHover : ''} ${cardClassName}`}
                onClick={() => handleCardClick(blog)}
                style={{ borderRadius: cardBorderRadius, cursor: 'pointer' }}
              >
                {showNumber && (
                  <div className={styles.cardNumber}>
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </div>
                )}

                <div 
                  className={styles.imageWrapper}
                  style={{ height: imageHeight }}
                >
                  <img 
                    src={blog.image || blog.heroImage} 
                    alt={blog.title} 
                    className={styles.blogImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  {showSubtitle && blog.subtitle && (
                    <span className={styles.cardSubtitle}>{blog.subtitle}</span>
                  )}
                  <h3 className={styles.cardTitle}>{blog.title}</h3>
                  {showDescription && blog.description && (
                    <p className={styles.cardDescription}>
                      {blog.description.length > 100 
                        ? `${blog.description.substring(0, 100)}...` 
                        : blog.description}
                    </p>
                  )}
                  {showFooter && (
                    <div className={styles.cardFooter}>
                      <span className={styles.readMore}>{footerText}</span>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Blog;