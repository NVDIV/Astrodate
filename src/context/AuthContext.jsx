import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Дані з Firestore
  const [loading, setLoading] = useState(true);

  // Функція для примусового оновлення даних профілю (знадобиться в Onboarding)
  const refreshUserData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
      return docSnap.data();
    }
    setUserData(null);
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
      } else {
        console.log("Документа в Firestore не існує!");
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);

  const value = {
    user,
    userData,
    loading,
    isProfileComplete: !!userData?.setupComplete,
    refreshUserData // Дозволить оновити контекст після збереження форми
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Власний хук для легкого доступу до даних
export const useAuth = () => useContext(AuthContext);