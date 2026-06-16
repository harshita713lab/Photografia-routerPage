// src/components/common/Services.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import styles from '../../Styles/common/Services.module.css';

const Services = ({
  services,
  title = "Our Services",
  subtitle = "What we offer for your special day",
  columns = 3,
  showSectionHeader = true,
  showIcon = true,
  showDescription = true,
  cardBorderRadius = "16px",
  cardPadding = "28px 20px",
  iconSize = "45px",
  iconBgColor = "#FFFFFF",
  iconColor = "#000000",
  titleColor = "#FFFFFF",
  descriptionColor = "#AAAAAA",
  cardBgColor = "#111111",
  cardBgHoverColor = "#1a1a1a",
  borderColor = "#333333",
  hoverBorderColor = "#FFFFFF",
  hoverEffect = true,
  containerClassName = '',
  sectionClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  cardClassName = '',
  iconClassName = '',
  cardTitleClassName = '',
  cardDescClassName = '',
  alignment = "center",
  gap = "25px",
  iconType = "check",
  customIconComponent = null
}) => {

  const getIconContent = (service, index) => {
    if (customIconComponent) return customIconComponent(service, index);
    if (iconType === 'number') return <span>{index + 1}</span>;
    if (iconType === 'custom' && service.icon) return <span>{service.icon}</span>;
    return <span>✓</span>;
  };

  return (
    <div className={`${styles.servicesContainer} ${containerClassName}`}>
      {showSectionHeader && (
        <div className={`${styles.sectionHeader} ${alignment === 'center' ? styles.sectionHeaderCenter : styles.sectionHeaderLeft} ${sectionClassName}`}>
          <h2 className={`${styles.sectionTitle} ${titleClassName}`}>{title}</h2>
          <div className={styles.sectionLine}></div>
          <p className={`${styles.sectionSubtitle} ${subtitleClassName}`}>{subtitle}</p>
        </div>
      )}

      <Container>
        <div 
          className={`${styles.servicesGrid} ${alignment === 'center' ? styles.servicesGridCenter : ''} ${containerClassName}`}
          style={{ gap: gap, gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {services.map((service, index) => (
            <div 
              key={service.id || index} 
              className={`${styles.serviceCard} ${hoverEffect ? styles.serviceCardHover : ''} ${cardClassName}`}
              style={{ 
                borderRadius: cardBorderRadius,
                padding: cardPadding,
                backgroundColor: cardBgColor,
                border: `1px solid ${borderColor}`
              }}
              onMouseEnter={(e) => {
                if (hoverEffect) {
                  e.currentTarget.style.backgroundColor = cardBgHoverColor;
                  e.currentTarget.style.borderColor = hoverBorderColor;
                }
              }}
              onMouseLeave={(e) => {
                if (hoverEffect) {
                  e.currentTarget.style.backgroundColor = cardBgColor;
                  e.currentTarget.style.borderColor = borderColor;
                }
              }}
            >
              {showIcon && (
                <div 
                  className={`${styles.serviceIcon} ${iconClassName}`}
                  style={{ 
                    width: iconSize, 
                    height: iconSize,
                    backgroundColor: iconBgColor,
                    color: iconColor,
                    fontSize: `calc(${iconSize} * 0.5)`
                  }}
                >
                  {getIconContent(service, index)}
                </div>
              )}
              
              <h3 
                className={`${styles.serviceTitle} ${cardTitleClassName}`}
                style={{ color: titleColor }}
              >
                {service.title}
              </h3>
              
              {showDescription && service.description && (
                <p 
                  className={`${styles.serviceDescription} ${cardDescClassName}`}
                  style={{ color: descriptionColor }}
                >
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Services;