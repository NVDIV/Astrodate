import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/layout/NavBar";
import { useNavigate } from "react-router-dom";
import AuthDetails from "../components/auth/AuthDetails";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) return <div>Завантаження профілю...</div>;

  return (
    <div>
      <Navbar />
      <div>
        <h1>Мій профіль</h1>
        {userData ? (
          <div>
            <p><strong>Ім'я:</strong> {userData.firstName} {userData.lastName}</p>
            <p><strong>Місто:</strong> {userData.city}</p>
            <p><strong>Знак зодіаку:</strong> {userData.zodiacSign}</p>
            <p><strong>Telegram:</strong> {userData.telegram}</p>
            <p><strong>Про себе:</strong> {userData.bio}</p>
            
            <button onClick={() => navigate("/onboarding")}>
              Редагувати дані
            </button>
          </div>
        ) : (
          <p>Дані не знайдено</p>
        )}
        
        <hr />
        <AuthDetails />
      </div>
    </div>
  );
};

export default ProfilePage;