import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Завантаження...</div>;

  return (
    <Router>
      <Routes>
        {/* Публічні маршрути: якщо юзер залогінений — редирект на онбординг */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <SignUpPage /> : <Navigate to="/onboarding" />} 
        />

        {/* Приватний маршрут: тільки для авторизованих */}
        <Route 
          path="/onboarding" 
          element={user ? <OnboardingPage /> : <Navigate to="/login" />} 
        />

        {/* Головна сторінка: редирект залежно від статусу */}
        <Route path="/" element={<Navigate to={user ? "/onboarding" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;