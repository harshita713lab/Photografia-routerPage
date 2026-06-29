// src/Components/Maternity/MaternityFAQ.jsx
import React, { useState } from 'react';
import '../../Styles/maternity/Maternity.css';
// ✅ Local image import
import faqImage from '../../assets/maternity/images/maternity5.jpg';

const MaternityFAQ = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    { 
      id: 1, 
      question: "When is the best time for a maternity shoot?", 
      answer: "The ideal time is between 28-34 weeks of pregnancy when the baby bump is beautifully visible." 
    },
    { 
      id: 2, 
      question: "How long does a maternity shoot take?", 
      answer: "Typically 1-2 hours depending on the location and number of outfit changes." 
    },
    { 
      id: 3, 
      question: "Where do you shoot maternity sessions?", 
      answer: "We shoot at our studio, outdoor locations, or at your home - whatever you prefer." 
    },
    { 
      id: 4, 
      question: "Can my partner and children join?", 
      answer: "Absolutely! We welcome family members to be part of the session." 
    },
    { 
      id: 5, 
      question: "Do you provide printed albums?", 
      answer: "Yes, we offer premium photo albums, canvas prints, and digital frames as add-ons." 
    }
  ];

  return (
    <div className="maternity-faq scroll-fade-up">
      <div className="faq-container">
        <div className="faq-left scroll-slide-left">
          <div className="faq-header">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-line"></div>
            <p className="faq-subtitle">Everything you need to know</p>
          </div>
          <div className="faq-wrapper stagger-children">
            {faqs.map((faq) => (
              <div key={faq.id} className={`faq-item ${openId === faq.id ? 'open' : ''}`}>
                <div className="faq-question" onClick={() => setOpenId(openId === faq.id ? null : faq.id)}>
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openId === faq.id ? '−' : '+'}</span>
                </div>
                <div className={`faq-answer ${openId === faq.id ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="faq-right scroll-slide-right">
          <img 
            src={faqImage}
            alt="Maternity"
            className="faq-image"
          />
        </div>
      </div>
    </div>
  );
};

export default MaternityFAQ;