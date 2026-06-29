// src/Components/Maternity/MaternityOtherWork.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/maternity/Maternity.css';
// ✅ Local image imports
import rokaImg from '../../assets/roka/iamges/rokaimage1.jpg';
import birthdayImg from '../../assets/birthday/image/img1.jpg';

const MaternityOtherWork = () => {
  const navigate = useNavigate();

  const workItems = [
    { id: 1, title: "Roka", link: "/roka", image: rokaImg },
    { id: 2, title: "Birthday", link: "/birthday", image: birthdayImg },
    { id: 3, title: "Anniversary", link: "/anniversary", image: rokaImg },
    { id: 4, title: "Corporate", link: "/corporate", image: birthdayImg },
    { id: 5, title: "Pre-wedding", link: "/pre-wedding", image: rokaImg },
    { id: 6, title: "Destination Wedding", link: "/destination-wedding", image: birthdayImg }
  ];

  return (
    <div className="maternity-other-work">
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

export default MaternityOtherWork;