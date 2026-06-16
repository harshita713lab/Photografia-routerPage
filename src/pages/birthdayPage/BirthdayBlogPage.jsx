// src/pages/birthdayPage/BirthdayBlogPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import BirthdayBlogDetail from '../../components/birthday/BirthdayBlogDetail';

const BirthdayBlogPage = () => {
  const location = useLocation();
  const { blog } = location.state || {};

  // Agar blog data nahi hai toh redirect karein
  if (!blog) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2 style={{ fontSize: '36px', fontFamily: 'Playfair Display, serif', marginBottom: '20px' }}>
          Blog Not Found
        </h2>
        <p style={{ fontSize: '16px', color: '#AAAAAA', marginBottom: '25px' }}>
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => window.location.href = '/birthday'}
          style={{
            background: 'transparent',
            border: '2px solid #FFFFFF',
            color: '#FFFFFF',
            padding: '12px 30px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '40px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#FFFFFF';
            e.target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#FFFFFF';
          }}
        >
          Go Back to Birthday
        </button>
      </div>
    );
  }

  return <BirthdayBlogDetail blog={blog} />;
};

export default BirthdayBlogPage;