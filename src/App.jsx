// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Roka from './pages/rokaPage/Roka';
import BlogDetail from './pages/rokaPage/BlogDetail';
import Birthday from './pages/birthdayPage/Birthday';
import BirthdayBlogPage from './pages/birthdayPage/BirthdayBlogPage';
import Maternity from './pages/maternityPage/Maternity';
import MaternityBlogPage from './pages/maternityPage/MaternityBlogPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Roka />} />
        <Route path="/roka" element={<Roka />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/birthday-blog/:id" element={<BirthdayBlogPage />} />
        <Route path="/maternity" element={<Maternity />} />
        <Route path="/maternity-blog/:id" element={<MaternityBlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;