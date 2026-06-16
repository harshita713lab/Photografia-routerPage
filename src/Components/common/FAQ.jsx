// src/components/common/FAQ.jsx
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from '../../Styles/common/FAQ.module.css';

const FAQ = ({ faqs, title = "Frequently Asked Questions", subtitle = "Everything you need to know" }) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={styles.faqContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionLine}></div>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
      </div>
      <Container>
        <div className={`${styles.faqWrapper} stagger-children`}>
          {faqs.map((faq) => (
            <div key={faq.id} className={`${styles.faqItem} stagger-child`}>
              <div className={styles.faqQuestion} onClick={() => toggle(faq.id)}>
                <span>{faq.question}</span>
                <span className={styles.faqIcon}>{openId === faq.id ? '−' : '+'}</span>
              </div>
              <div className={`${styles.faqAnswer} ${openId === faq.id ? styles.open : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default FAQ;