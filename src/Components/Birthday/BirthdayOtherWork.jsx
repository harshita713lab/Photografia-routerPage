// src/Components/Birthday/BirthdayOtherWork.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/birthday/Birthday.css';
// ✅ Local image imports
import rokaImg from '../../assets/roka/iamges/rokaimage1.jpg';
import maternityImg from '../../assets/maternity/images/maternity1.jpg';

const BirthdayOtherWork = () => {
  const navigate = useNavigate();

  const workItems = [
    { id: 1, title: "Roka", link: "/roka", image: rokaImg },
    { id: 2, title: "Maternity", link: "/maternity", image: maternityImg },
    { id: 3, title: "Anniversary", link: "/anniversary", image: rokaImg },
    { id: 4, title: "Corporate", link: "/corporate", image: maternityImg },
    { id: 5, title: "Pre-wedding", link: "/pre-wedding", image: rokaImg },
    { id: 6, title: "Destination Wedding", link: "/destination-wedding", image: maternityImg }
  ];

  return (
    <div className="birthday-other-work">
      <div className="other-work-header">
        <h2 className="other-work-title">Our Other Work</h2>
        <div className="other-work-line"></div>
      </div>
      <div className="other-work-container">
        {workItems.map((item) => (
          <button 
            key={item.id} 
            className="other-work-btn"
            onClick={() => { navigate(item.link); window.scrollTo(0, 0); }}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <span className="other-work-btn-title">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BirthdayOtherWork;