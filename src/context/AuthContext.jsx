import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false); // Новий стан

  const refreshUserData = async (uid) => {
    setIsProfileLoading(true); // Починаємо чекати на дані профілю
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      setUserData(null);
    }
    setIsProfileLoading(false); // Дані отримано (або підтверджено, що їх немає)
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await refreshUserData(currentUser.uid);
      } else {
        setUserData(null);
        setIsProfileLoading(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    loading: loading || isProfileLoading, // Тепер loading true, поки не завантажиться ВСЕ
    isProfileComplete: !!userData?.setupComplete,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Власний хук для легкого доступу до даних
export const useAuth = () => useContext(AuthContext);