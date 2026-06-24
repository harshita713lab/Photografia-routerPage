// src/components/maternity/MaternityServices.jsx
import React from 'react';
import styles from '../../Styles/maternity/Maternity.module.css';

const MaternityServices = () => {
  const services = [
    {
      id: 1,
      title: "Maternity Photography",
      description: "Professional photography capturing the beauty and glow of your pregnancy journey."
    },
    {
      id: 2,
      title: "Outdoor Sessions",
      description: "Beautiful outdoor maternity shoots in scenic locations with natural lighting."
    },
    {
      id: 3,
      title: "Studio Photography",
      description: "Elegant studio sessions with professional lighting and backdrops."
    },
    {
      id: 4,
      title: "Candid Moments",
      description: "Natural and candid shots capturing real emotions and genuine connections."
    },
    {
      id: 5,
      title: "Family Portraits",
      description: "Beautiful family portraits with your partner and children."
    },
    {
      id: 6,
      title: "Premium Albums",
      description: "Beautifully designed premium albums to preserve your memories forever."
    }
  ];

  return (
    <div className={`${styles.maternityServicesSection} scroll-reveal`}>
      <div className={styles.maternityServicesContainer}>
        
        {/* LEFT - Title */}
        <div className={`${styles.maternityServicesLeft} fade-in-delay-1`}>
          <h2 className={styles.maternityServicesMainTitle}>
            Our Maternity<br />Services
          </h2>
          <div className={styles.maternityServicesLine}></div>
          <p className={styles.maternityServicesSubtitle}>
            Professional photography services for your special journey
          </p>
        </div>

        {/* RIGHT - Services List */}
        <div className={`${styles.maternityServicesRight} stagger-children`}>
          {services.map((service) => (
            <div key={service.id} className={styles.maternityServiceItem}>
              <h3 className={styles.maternityServiceTitle}>{service.title}</h3>
              <p className={styles.maternityServiceDesc}>{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MaternityServices;