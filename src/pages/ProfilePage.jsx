import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/NavBar";
import { useNavigate } from "react-router-dom";
import AuthDetails from "../components/auth/AuthDetails";
import "../styles/Profile.css"; // Імпортуємо нові стилі

const ProfilePage = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  if (!userData) return <div className="auth-page">Завантаження...</div>;

  return (
    <div>
      <Navbar />
      
      <div className="profile-container">
        {/* Верхня частина з великим фото */}
        <div className="profile-header">
          <img 
            src={userData.photoURL || "https://via.placeholder.com/500x700?text=No+Photo"} 
            alt="Profile" 
            className="profile-image" 
          />
          <div className="profile-overlay">
            <div className="profile-main-info">
              <h1>{userData.firstName}, {userData.city}</h1>
              <div className="profile-badge-row">
                <span className="badge">✨ {userData.zodiacSign}</span>
                {/* <span className="badge">👤 {userData.gender === "male" ? "Чоловік" : "Жінка"}</span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Секція "Про себе" */}
        <div className="profile-section">
          <h3>Про мене</h3>
          <p style={{ lineHeight: "1.6" }}>{userData.bio || "Тут поки порожньо..."}</p>
        </div>

        {/* Секція контактів */}
        <div className="profile-section">
          <h3>Контакти</h3>
          <p><strong>Telegram:</strong> {userData.telegram}</p>
        </div>

        {/* Кнопки керування */}
        <button className="edit-profile-btn" onClick={() => navigate("/onboarding")}>
          Редагувати профіль
        </button>
        
        <AuthDetails />
      </div>
    </div>
  );
};

export default ProfilePage;