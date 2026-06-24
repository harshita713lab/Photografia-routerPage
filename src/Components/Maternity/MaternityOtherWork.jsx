// src/components/maternity/MaternityOtherWork.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Styles/maternity/Maternity.module.css';

const MaternityOtherWork = () => {
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
      image: "https://i.pinimg.com/1200x/3a/63/b9/3a63b9b126b66aba3a0a6a91e2377267.jpg"
    },
    {
      id: 3,
      title: "Pre Wedding",
      link: "/pre-wedding",
      image: "https://i.pinimg.com/736x/9b/8b/ec/9b8bec024bdacbf1f43cbbf6830b6d7a.jpg"
    },
    {
      id: 4,
      title: "Corporate",
      link: "/corporate",
      image: "https://i.pinimg.com/736x/22/44/d9/2244d9fe79201ed5bc1e0d10bb2d8dd0.jpg"
    },
    {
      id: 5,
      title: "Maternity",
      link: "/maternity",
      image: "https://i.pinimg.com/1200x/40/4d/e3/404de373a8d1c1fd4d865fa0c40ce7f6.jpg"
    },
    {
      id: 6,
      title: "Anniversary",
      link: "/anniversary",
      image: "https://i.pinimg.com/736x/98/1f/54/981f54493a1eff954ada3fb0e3f534c4.jpg"
    },
    {
      id: 7,
      title: "Destination Wedding",
      link: "/destination-wedding",
      image: "https://i.pinimg.com/736x/69/ec/4e/69ec4e2b681fc0179fff3965c1fa793b.jpg"
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

export default MaternityOtherWork;