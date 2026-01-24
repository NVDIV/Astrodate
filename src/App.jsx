import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./services/firebase";
import { doc, getDoc } from "firebase/firestore";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import MatchesPage from "./pages/MatchesPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [user, setUser] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); 
      setUser(currentUser);

      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().setupComplete) {
            setIsProfileComplete(true);
          } else {
            setIsProfileComplete(false);
          }
        } catch (error) {
          console.error("Помилка при отриманні профілю:", error);
          setIsProfileComplete(false);
        }
      } else {
        setIsProfileComplete(false);
      }
    
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Завантаження...</div>;

  return (
    <Router>
      <Routes>
        {/* Публічні маршрути */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : (isProfileComplete ? <Navigate to="/home" /> : <Navigate to="/onboarding" />)} 
        />
        <Route 
          path="/signup" 
          element={!user ? <SignUpPage /> : <Navigate to="/onboarding" />} 
        />

        {/* Приватні маршрути */}
        <Route 
          path="/onboarding" 
          element={user ? <OnboardingPage /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/home" 
          element={user && isProfileComplete ? <HomePage /> : <Navigate to="/onboarding" />} 
        />

        <Route 
          path="/matches" 
          element={user && isProfileComplete ? <MatchesPage /> : <Navigate to="/onboarding" />} />

        <Route 
          path="/profile" 
          element={user && isProfileComplete ? <ProfilePage /> : <Navigate to="/onboarding" />} />

        {/* Головна точка входу */}
        <Route path="/" element={
          !user ? <Navigate to="/login" /> : (isProfileComplete ? <Navigate to="/home" /> : <Navigate to="/onboarding" />)
        } />
      </Routes>
    </Router>
  );
}

export default App;