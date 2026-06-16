// src/components/common/OtherWork.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/common/OtherWork.module.css';

const OtherWork = () => {
  const navigate = useNavigate();

  const workItems = [
    { 
      id: 1, 
      title: "Anniversary", 
      link: "/anniversary",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&dpr=1"
    },
    { 
      id: 2, 
      title: "Roka", 
      link: "/roka",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&dpr=1"
    },
    { 
      id: 3, 
      title: "Birthday", 
      link: "/birthday",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&dpr=1"
    },
    { 
      id: 4, 
      title: "Corporate", 
      link: "/corporate",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&dpr=1"
    },
    { 
      id: 5, 
      title: "Maternity", 
      link: "/maternity",
      image: "https://images.pexels.com/photos/34819639/pexels-photo-34819639/free-photo-of-romantic-beachside-maternity-couple-portrait.jpeg?w=200&h=100&dpr=1"
    },
    { 
      id: 6, 
      title: "Pre-wedding", 
      link: "/pre-wedding",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&dpr=1"
    },
    { 
      id: 7, 
      title: "Destination Wedding", 
      link: "/destination-wedding",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&dpr=1"
    }
  ];

  return (
    <div className={`${styles.otherWorkSection} scroll-reveal`}>
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.sectionTitle} fade-in-up delay-1`}>Our Other Work</h2>
        <div className={`${styles.sectionLine} fade-in delay-2`}></div>
      </div>
      <div className={`${styles.linksContainer} stagger-children`}>
        {workItems.map((item) => (
          <button 
            key={item.id} 
            className={`${styles.workLink} hover-scale`} 
            onClick={() => { navigate(item.link); window.scrollTo(0, 0); }}
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <span className={styles.workLinkTitle}>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OtherWork;