// src/components/roka/RokaServicesSection.jsx
import React from 'react';
import Services from '../common/Services';
import styles from '../../Styles/roka/RokaServicesSection.module.css';

const RokaServicesSection = () => {
  const servicesData = [
    {
      id: 1,
      title: "Roka Photography",
      description: "Professional photography covering every ritual of your Roka ceremony from tilak to feast."
    },
    {
      id: 2,
      title: "Cinematic Videography",
      description: "High-quality cinematic videos capturing all the emotions and special moments of your Roka."
    },
    {
      id: 3,
      title: "Premium Albums",
      description: "Beautifully designed premium leather albums and canvas prints for your memories."
    },
    {
      id: 4,
      title: "Traditional Coverage",
      description: "Complete coverage of all traditional rituals including tilak, ring exchange, and blessings."
    },
    {
      id: 5,
      title: "Candid Photography",
      description: "Natural and candid shots capturing real emotions and genuine moments."
    },
    {
      id: 6,
      title: "Same Day Edit",
      description: "Quick turnaround with same-day highlight reels for your social media sharing."
    }
  ];

  return (
    <div className={`${styles.servicesSection} scroll-fade-up`}>
      <Services 
        services={servicesData}
        title="Our Roka Services"
        subtitle="Professional photography services for your special day"
        columns={3}
        showSectionHeader={true}
        showIcon={false}
        showDescription={true}
        cardBorderRadius="12px"
        cardPadding="18px 16px"
        titleColor="#FFFFFF"
        descriptionColor="#AAAAAA"
        cardBgColor="#000000"
        cardBgHoverColor="#1a1a1a"
        borderColor="#333333"
        hoverBorderColor="#FFFFFF"
        hoverEffect={true}
        alignment="center"
        gap="16px"
        containerClassName="stagger-children"
        sectionClassName="scroll-fade-up"
        titleClassName="scroll-fade-up delay-1"
        subtitleClassName="scroll-fade-up delay-2"
      />
    </div>
  );
};

export default RokaServicesSection;