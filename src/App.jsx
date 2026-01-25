import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import MatchesPage from "./pages/MatchesPage";
import ProfilePage from "./pages/ProfilePage";


const AppRoutes = () => {
  const { user, isProfileComplete, loading } = useAuth();

  // Поки ми не отримали відповідь від ОБОХ сервісів, показуємо завантаження
  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>Синхронізація з зірками...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ПУБЛІЧНІ МАРШРУТИ */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : (isProfileComplete ? <Navigate to="/home" /> : <Navigate to="/onboarding" />)} 
      />
      <Route 
        path="/signup" 
        element={!user ? <SignUpPage /> : <Navigate to="/onboarding" />} 
      />

      {/* ПРИВАТНІ МАРШРУТИ */}
      <Route 
        path="/onboarding" 
        element={user ? <OnboardingPage /> : <Navigate to="/login" />} 
      />
      
      {/* Тепер тут не буде помилкових редиректів, бо ми точно знаємо статус isProfileComplete */}
      <Route 
        path="/home" 
        element={user && isProfileComplete ? <HomePage /> : <Navigate to="/onboarding" />} 
      />
      
      <Route path="/matches" element={user && isProfileComplete ? <MatchesPage /> : <Navigate to="/onboarding" />} />
      <Route path="/profile" element={user && isProfileComplete ? <ProfilePage /> : <Navigate to="/onboarding" />} />

      <Route path="/" element={
        !user ? <Navigate to="/login" /> : (isProfileComplete ? <Navigate to="/home" /> : <Navigate to="/onboarding" />)
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;