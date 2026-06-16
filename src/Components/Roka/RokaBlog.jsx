// src/components/roka/RokaBlog.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Blog from '../common/Blog';
import styles from '../../Styles/roka/RokaBlog.module.css';

const RokaBlog = ({ 
  blogs, 
  onBlogClick, 
  sectionTitle = "Roka Blogs",
  sectionSubtitle = "Tips and inspiration for your Roka ceremony"
}) => {
  const navigate = useNavigate();

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog.id}`);
    if (onBlogClick) {
      onBlogClick(blog);
    }
  };

  return (
    <div className={`${styles.blogSection} scroll-fade-up`}>
      <Blog 
        blogs={blogs}
        onBlogClick={handleBlogClick}
        columns={3}
        sectionTitle={sectionTitle}
        sectionSubtitle={sectionSubtitle}
        showSectionHeader={true}
        showNumber={true}
        showSubtitle={true}
        showDescription={true}
        showFooter={true}
        footerText="Read More →"
        imageHeight="260px"
        cardBorderRadius="16px"
        hoverEffect={true}
        containerClassName="stagger-children"
      />
    </div>
  );
};

export default RokaBlog;