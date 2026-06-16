// src/components/birthday/BirthdayFAQ.jsx
import React, { useState } from 'react';
import styles from '../../Styles/birthday/Birthday.module.css';

const BirthdayFAQ = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How long does a birthday photoshoot take?",
      answer: "A typical birthday photoshoot takes 1-2 hours, depending on the package you choose. We ensure we capture every special moment without rushing."
    },
    {
      id: 2,
      question: "When will I receive my birthday photos?",
      answer: "You'll receive a sneak peek within 24 hours after the shoot. The full gallery is delivered within 7-10 business days, beautifully edited and ready to share."
    },
    {
      id: 3,
      question: "Do you cover outdoor birthday celebrations?",
      answer: "Yes! We cover both indoor and outdoor birthday celebrations at any location of your choice. Whether it's a garden party, beach celebration, or a venue, we are there to capture every moment."
    },
    {
      id: 4,
      question: "Can we book a last-minute birthday photoshoot?",
      answer: "Yes, subject to availability. We recommend contacting us at least 48 hours in advance to ensure we can accommodate your request and provide the best experience."
    },
    {
      id: 5,
      question: "Do you provide printed albums and canvas prints?",
      answer: "Yes, we offer premium leather albums, canvas prints, digital frames, and customized photo books as add-ons to preserve your memories in the most beautiful way."
    },
    {
      id: 6,
      question: "What makes your photography different?",
      answer: "We specialize in capturing authentic emotions, candid moments, and the unique joy of your celebration. Our storytelling approach, attention to detail, and professional editing ensure you get gallery-worthy images that you'll treasure forever."
    }
  ];

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={`${styles.faqSection} scroll-reveal`}>
      <div className={styles.faqContainer}>
        
        {/* LEFT SIDE - FAQ */}
        <div className={styles.faqLeft}>
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Frequently Asked Questions</h2>
            <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
            <p className={`${styles.sectionSubtitle} fade-in-delay-3`}>
              Everything you need to know about our photography services
            </p>
          </div>

          <div className={`${styles.faqWrapper} stagger-children`}>
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`${styles.faqItem} ${openId === faq.id ? styles.open : ''}`}
                onClick={() => toggle(faq.id)}
              >
                <div className={styles.faqQuestion}>
                  <span>{faq.question}</span>
                  <span className={styles.faqIcon}>{openId === faq.id ? '−' : '+'}</span>
                </div>
                <div className={`${styles.faqAnswer} ${openId === faq.id ? styles.open : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className={`${styles.faqRight} fade-in-delay-2`}>
          <img 
            src="https://i.pinimg.com/1200x/c3/0b/19/c30b1963446e9408951bd08d66078a49.jpg"
            alt="Birthday Photography"
            className={styles.faqImage}
          />
        </div>

      </div>
    </div>
  );
};

export default BirthdayFAQ;