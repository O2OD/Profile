import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Asosiy sayt */}
        <Route path="/" element={<Home />} />
        
        {/* Yashirin Admin Panel (nomini /dashboard yoki /secret-admin qilamiz) */}
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;