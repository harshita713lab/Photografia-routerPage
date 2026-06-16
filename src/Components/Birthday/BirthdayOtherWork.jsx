// src/components/birthday/BirthdayOtherWork.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/birthday/Birthday.module.css';

const BirthdayOtherWork = () => {
  const navigate = useNavigate();

  const workItems = [
    {
      id: 1,
      title: "Roka",
      link: "/roka",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&dpr=1"
    },
    {
      id: 2,
      title: "Wedding",
      link: "/wedding",
      image: "https://i.pinimg.com/736x/f5/72/9d/f5729de965dbd52bc8694bc74f12386b.jpg"
    },
    {
      id: 3,
      title: "Pre Wedding",
      link: "/pre-wedding",
      image: "https://i.pinimg.com/736x/0a/df/f0/0adff0cd6958e446d7fe0ec2e676f054.jpg"
    },
    {
      id: 4,
      title: "Corporate",
      link: "/corporate",
      image: "https://i.pinimg.com/736x/c9/78/93/c978939e5b5ae26441f5569c59e15095.jpg"
    },
    {
      id: 5,
      title: "Maternity",
      link: "/maternity",
      image: "https://i.pinimg.com/736x/ba/b2/13/bab213bf2aebca700ad7b5aa79588ae5.jpg"
    },
    {
      id: 6,
      title: "Anniversary",
      link: "/anniversary",
      image: "https://i.pinimg.com/736x/73/4d/df/734ddf666be99b26f46915c1295b201a.jpg"
    },
    {
      id: 7,
      title: "Destination Wedding",
      link: "/destination-wedding",
      image: "https://i.pinimg.com/736x/56/ab/e5/56abe5f7bca4afe72b20909fa4fbfc5d.jpg"
    }
  ];

  const handleNavigate = (link) => {
    navigate(link);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`${styles.otherWorkSection} scroll-reveal`}>
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Our Other Work</h2>
        <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
      </div>
      
      <div className={`${styles.otherWorkContainer} stagger-children`}>
        {workItems.map((item) => (
          <button
            key={item.id}
            className={styles.otherWorkBtn}
            onClick={() => handleNavigate(item.link)}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <span className={styles.otherWorkBtnTitle}>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BirthdayOtherWork;