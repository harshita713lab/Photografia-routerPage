// src/components/common/AlternatingContent.jsx
import React from 'react';
import styles from '../../Styles/common/AlternatingContent.module.css';

const AlternatingContent = ({
  sections,
  onImageClick = null,
  showDivider = true,
  dividerColor = '#FFFFFF'
}) => {
  return (
    <div className={styles.alternatingContainer}>
      {sections.map((section, index) => {
        const isImageLeft = index % 2 === 0;
        
        return (
          <div 
            key={section.id || index} 
            className={styles.section}
          >
            <div className={`${styles.container} ${isImageLeft ? styles.containerLeft : styles.containerRight}`}>
              
              {/* Image Column - Left side se slide */}
              <div className={`${styles.imageColumn} ${isImageLeft ? 'scroll-slide-left' : 'scroll-slide-right'}`}>
                <div className={styles.imageWrapper}>
                  <img
                    src={section.image}
                    alt={section.title}
                    className={styles.image}
                    onClick={() => onImageClick && onImageClick(section.image)}
                  />
                </div>
              </div>

              {/* Content Column - Opposite side se slide */}
              <div className={`${styles.contentColumn} ${isImageLeft ? 'scroll-slide-right' : 'scroll-slide-left'}`}>
                <div className={styles.contentWrapper}>
                  {section.badge && (
                    <div className={styles.badge}>{section.badge}</div>
                  )}
                  <h2 className={styles.title}>
                    {section.title}
                    {section.highlightText && (
                      <>
                        <br />
                        <span className={styles.titleHighlight}>
                          {section.highlightText}
                        </span>
                      </>
                    )}
                  </h2>
                  {showDivider && (
                    <div 
                      className={styles.divider}
                      style={{ backgroundColor: dividerColor }}
                    ></div>
                  )}
                  {section.paragraphs && section.paragraphs.map((para, idx) => (
                    <p key={idx} className={styles.description}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlternatingContent;