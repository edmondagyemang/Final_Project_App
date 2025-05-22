import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import ObjectivesPage from './pages/ObjectivesPage';
import FeedbackPage from './pages/FeedbackPage';
import Navbar from './components/Navbar';

import { AuthProvider } from './services/index';
import { supabase } from './supabase';
import { logoutUser } from './services/supabaseClient';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
    };
    checkSession();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        setIsLoggedIn(!!session?.user);
      } catch (error) {
        console.error('Session refresh error:', error.message);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await logoutUser();
        setIsLoggedIn(false);
      } catch (err) {
        alert('Failed to log out.');
      }
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/objectives" element={<ObjectivesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
