// src/components/birthday/BirthdayServices.jsx
import React from 'react';
import styles from '../../Styles/birthday/Birthday.module.css';

const BirthdayServices = () => {
  const services = [
    {
      id: 1,
      title: "Birthday Photography",
      description: "Professional photography covering every moment of your birthday celebration from start to finish."
    },
    {
      id: 2,
      title: "Cinematic Videography",
      description: "High-quality cinematic videos capturing all the emotions and special moments of your birthday."
    },
    {
      id: 3,
      title: "Premium Albums",
      description: "Beautifully designed premium leather albums and canvas prints for your memories."
    },
    {
      id: 4,
      title: "Candid Photography",
      description: "Natural and candid shots capturing real emotions, laughter, and genuine moments."
    },
    {
      id: 5,
      title: "Same Day Edit",
      description: "Quick turnaround with same-day highlight reels for your social media sharing."
    },
    {
      id: 6,
      title: "Group & Family Portraits",
      description: "Beautiful group photos with family and friends to cherish forever."
    }
  ];

  return (
    <div className={`${styles.servicesSection} scroll-reveal`}>
      <div className={styles.servicesContainer}>
        
        {/* LEFT SIDE - TITLE */}
        <div className={`${styles.servicesLeft} fade-in-delay-1`}>
          <h2 className={styles.servicesMainTitle}>Our Services<br />For Birthday</h2>
          <div className={styles.servicesMainLine}></div>
          <p className={styles.servicesMainSubtitle}>
            Professional photography services for your special day
          </p>
        </div>

        {/* RIGHT SIDE - SERVICES LIST */}
        <div className={`${styles.servicesRight} stagger-children`}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceItem}>
              <h3 className={styles.serviceItemTitle}>{service.title}</h3>
              <p className={styles.serviceItemDesc}>{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BirthdayServices;