// src/Components/Birthday/BirthdayServicesSection.jsx
import React from 'react';
import '../../Styles/birthday/Birthday.css';

const BirthdayServicesSection = () => {
  const services = [
    { 
      id: 1, 
      title: "Birthday Photography", 
      description: "Professional photography covering every moment of your birthday celebration." 
    },
    { 
      id: 2, 
      title: "Cake Smash Session", 
      description: "Fun and playful cake smash photography for kids and adults." 
    },
    { 
      id: 3, 
      title: "Portrait Session", 
      description: "Beautiful portraits capturing the personality of the birthday person." 
    },
    { 
      id: 4, 
      title: "Party Coverage", 
      description: "Complete coverage of your birthday party from start to finish." 
    },
    { 
      id: 5, 
      title: "Family & Friends", 
      description: "Group photos with family and friends celebrating together." 
    },
    { 
      id: 6, 
      title: "Photo Albums", 
      description: "Premium printed albums and digital frames for your memories." 
    }
  ];

  return (
    <div className="birthday-services-section scroll-fade-up">
      <div className="section-header">
        <h2 className="section-title scroll-fade-up delay-1">Our Birthday Services</h2>
        <div className="section-line scroll-fade-up delay-2"></div>
        <p className="section-subtitle scroll-fade-up delay-3">Professional photography for your special day</p>
      </div>
      <div className="services-grid stagger-children" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {services.map((service) => (
          <div key={service.id} className="service-card hover-scale">
            <div 
              className="service-icon" 
              style={{ 
                width: '45px', 
                height: '45px', 
                backgroundColor: '#FFFFFF', 
                color: '#000000', 
                fontSize: '22px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 14px auto',
                fontWeight: 'bold'
              }}
            >
              🎂
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayServicesSection;