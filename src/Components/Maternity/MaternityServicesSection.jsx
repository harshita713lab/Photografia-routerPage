// src/Components/Maternity/MaternityServicesSection.jsx
import React from 'react';
import '../../Styles/maternity/Maternity.css';

const MaternityServicesSection = () => {
  const services = [
    { 
      id: 1, 
      title: "Maternity Photography", 
      description: "Professional photography celebrating the beauty of pregnancy." 
    },
    { 
      id: 2, 
      title: "Studio Sessions", 
      description: "Intimate studio photography with professional lighting and backdrops." 
    },
    { 
      id: 3, 
      title: "Outdoor Shoots", 
      description: "Beautiful outdoor locations for natural and artistic maternity portraits." 
    },
    { 
      id: 4, 
      title: "Partner & Family", 
      description: "Include your partner and children in the maternity session." 
    },
    { 
      id: 5, 
      title: "Newborn Prep", 
      description: "Preparation and styling for your newborn photography session." 
    },
    { 
      id: 6, 
      title: "Photo Albums", 
      description: "Premium printed albums and digital frames for your memories." 
    }
  ];

  return (
    <div className="maternity-services-section scroll-fade-up">
      <div className="section-header">
        <h2 className="section-title scroll-fade-up delay-1">Our Maternity Services</h2>
        <div className="section-line scroll-fade-up delay-2"></div>
        <p className="section-subtitle scroll-fade-up delay-3">Professional photography for expecting mothers</p>
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
              👶
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaternityServicesSection;