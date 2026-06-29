// src/Components/Birthday/BirthdayFAQ.jsx
import React, { useState } from 'react';
import '../../Styles/birthday/Birthday.css';
// ✅ Local image import
import faqImage from '../../assets/birthday/image/birthday5.jpg';

const BirthdayFAQ = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    { 
      id: 1, 
      question: "How long does a birthday photoshoot take?", 
      answer: "Typically 2-3 hours depending on the type of session and location." 
    },
    { 
      id: 2, 
      question: "When will I receive my photos?", 
      answer: "You'll receive a sneak peek within 24 hours. Full gallery is delivered within 5-7 business days." 
    },
    { 
      id: 3, 
      question: "Do you cover outdoor birthday parties?", 
      answer: "Yes! We cover both indoor and outdoor birthday celebrations at any location." 
    },
    { 
      id: 4, 
      question: "Can we book for a last-minute birthday?", 
      answer: "Yes, subject to availability. Contact us at least 24 hours in advance." 
    },
    { 
      id: 5, 
      question: "Do you provide printed albums?", 
      answer: "Yes, we offer premium photo albums, canvas prints, and digital frames as add-ons." 
    }
  ];

  return (
    <div className="birthday-faq scroll-fade-up">
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
            alt="Birthday Celebration"
            className="faq-image"
          />
        </div>
      </div>
    </div>
  );
};

export default BirthdayFAQ;