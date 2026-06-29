// src/Components/Roka/RokaFAQ.jsx
import React, { useState } from 'react';
import "../../Styles/roka/Roka.css";

const RokaFAQ = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    { 
      id: 1, 
      question: "How long does a Roka ceremony photoshoot take?", 
      answer: "Typically 3-4 hours covering the entire ceremony from tilak to feast and group photos." 
    },
    { 
      id: 2, 
      question: "When will I receive my photos?", 
      answer: "You'll receive a sneak peek within 24 hours. Full gallery is delivered within 7-10 business days." 
    },
    { 
      id: 3, 
      question: "Do you cover outdoor Roka ceremonies?", 
      answer: "Yes! We cover both indoor and outdoor Roka ceremonies at any location." 
    },
    { 
      id: 4, 
      question: "Can we book for a last-minute Roka?", 
      answer: "Yes, subject to availability. Contact us at least 48 hours in advance." 
    },
    { 
      id: 5, 
      question: "Do you provide printed albums?", 
      answer: "Yes, we offer premium leather albums, canvas prints, and digital frames as add-ons." 
    }
  ];

  return (
    <div className="roka-faq scroll-fade-up">
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
            src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Roka Ceremony"
            className="faq-image"
          />
        </div>
      </div>
    </div>
  );
};

export default RokaFAQ;