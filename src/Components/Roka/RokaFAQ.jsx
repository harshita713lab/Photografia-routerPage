// src/components/roka/RokaFAQ.jsx
import React from 'react';
import FAQ from '../common/FAQ';
import styles from '../../Styles/roka/RokaFAQ.module.css';

const RokaFAQ = () => {
  const faqsData = [
    { id: 1, question: "How long does a Roka ceremony photoshoot take?", answer: "Typically 3-4 hours covering the entire ceremony from tilak to feast and group photos." },
    { id: 2, question: "When will I receive my photos?", answer: "You'll receive a sneak peek within 24 hours. Full gallery is delivered within 7-10 business days." },
    { id: 3, question: "Do you cover outdoor Roka ceremonies?", answer: "Yes! We cover both indoor and outdoor Roka ceremonies at any location." },
    { id: 4, question: "Can we book for a last-minute Roka?", answer: "Yes, subject to availability. Contact us at least 48 hours in advance." },
    { id: 5, question: "Do you provide printed albums?", answer: "Yes, we offer premium leather albums, canvas prints, and digital frames as add-ons." }
  ];

  return (
    <div className={`${styles.faqSection} scroll-fade-up`}>
      <div className={styles.faqContainer}>
        <div className={`${styles.faqLeft} scroll-slide-left`}>
          <FAQ 
            faqs={faqsData} 
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />
        </div>
        <div className={`${styles.faqRight} scroll-slide-right`}>
          <img 
            src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Roka Ceremony"
            className={styles.faqImage}
          />
        </div>
      </div>
    </div>
  );
};

export default RokaFAQ;