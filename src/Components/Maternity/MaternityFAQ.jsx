// src/components/maternity/MaternityFAQ.jsx
import React, { useState } from 'react';
import styles from '../../Styles/maternity/Maternity.module.css';

// ===== ASSETS SE IMPORT =====
import faqImg from '../../assets/maternity/images/maternity1.jpg';

const MaternityFAQ = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "When is the best time for a maternity photoshoot?",
      answer: "The ideal time is between 28-34 weeks of pregnancy when the belly is beautifully round and you're still comfortable enough to pose for photos."
    },
    {
      id: 2,
      question: "How long does a maternity photoshoot take?",
      answer: "A typical maternity photoshoot takes 1-2 hours, including outfit changes, breaks, and different poses. We ensure you feel comfortable throughout the session."
    },
    {
      id: 3,
      question: "What should I wear for my maternity shoot?",
      answer: "We recommend form-fitting dresses, flowing gowns, or simple neutral outfits that highlight your baby bump. We also have a client wardrobe available."
    },
    {
      id: 4,
      question: "Can I include my partner and children?",
      answer: "Absolutely! Family portraits are a beautiful addition to your maternity gallery. We love capturing the bond between siblings and partners."
    },
    {
      id: 5,
      question: "Do you provide outdoor maternity sessions?",
      answer: "Yes, we offer both indoor studio and outdoor location sessions. Natural light and scenic backdrops create stunning maternity photographs."
    },
    {
      id: 6,
      question: "When will I receive my maternity photos?",
      answer: "You'll receive a sneak peek within 24 hours and the full gallery within 7-10 business days, beautifully edited and ready to share."
    }
  ];

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={`${styles.maternityFaqSection} scroll-reveal`}>
      <div className={styles.maternityFaqContainer}>
        
        {/* LEFT SIDE - FAQ */}
        <div className={styles.maternityFaqLeft}>
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} fade-in-delay-1`}>Frequently Asked Questions</h2>
            <div className={`${styles.sectionLine} fade-in-delay-2`}></div>
            <p className={`${styles.sectionSubtitle} fade-in-delay-3`}>
              Everything you need to know about our maternity photography services
            </p>
          </div>

          <div className={`${styles.maternityFaqWrapper} stagger-children`}>
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`${styles.maternityFaqItem} ${openId === faq.id ? styles.open : ''}`}
                onClick={() => toggle(faq.id)}
              >
                <div className={styles.maternityFaqQuestion}>
                  <span>{faq.question}</span>
                  <span className={styles.maternityFaqIcon}>{openId === faq.id ? '−' : '+'}</span>
                </div>
                <div className={`${styles.maternityFaqAnswer} ${openId === faq.id ? styles.open : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className={`${styles.maternityFaqRight} fade-in-delay-2`}>
          <img 
            src={faqImg} 
            alt="Maternity Photography" 
            className={styles.maternityFaqImage}
          />
        </div>

      </div>
    </div>
  );
};

export default MaternityFAQ;