// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Roka from './pages/Roka';
import Birthday from './pages/Birthday';
import Maternity from './pages/Maternity';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Roka />} />
        <Route path="/roka" element={<Roka />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/maternity" element={<Maternity />} />
      </Routes>
    </Router>
  );
}

export default App;