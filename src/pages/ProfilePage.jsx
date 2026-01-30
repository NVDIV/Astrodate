import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/NavBar";
import { useNavigate } from "react-router-dom";
import AuthDetails from "../components/auth/AuthDetails";
import "../styles/Profile.css";

const ProfilePage = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  // Функція для розрахунку віку
  const calculateAge = (dateString) => {
    if (!dateString) return "";
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  if (!userData) return <div className="auth-page">Завантаження...</div>;

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      
      <div className="profile-container">
        {/* Верхня частина з фото */}
        <div className="profile-header">
          <img 
            src={userData.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            alt="Profile" 
            className="profile-image" 
          />
          <div className="profile-overlay">
            <div className="profile-main-info">
              <h1>{userData.firstName}, {calculateAge(userData.birthDate)}</h1>
              <p className="profile-city">📍 {userData.city}</p>
              <div className="profile-badge-row">
                <span className="badge">✨ {userData.zodiacSign}</span>
                <span className="badge">
                  {userData.gender === "male" ? "♂ Чоловік" : userData.gender === "female" ? "♀ Жінка" : "👤 Інше"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Секція детальної інформації */}
        <div className="profile-section">
          <h3>Про мене</h3>
          <p className="bio-text">{userData.bio || "Тут поки порожньо... Натисніть редагувати, щоб додати опис."}</p>
        </div>

        <div className="profile-section">
          <h3>Уподобання</h3>
          <p>
            <strong>Шукаю:</strong> {
              userData.preference === "male" ? "Чоловіків" : 
              userData.preference === "female" ? "Жінок" : "Усіх"
            }
          </p>
        </div>

        <div className="profile-section">
          <h3>Контакти</h3>
          <p><strong>Telegram:</strong> <span className="highlight">{userData.telegram}</span></p>
          <small style={{color: "var(--gray)", fontSize: "11px"}}>Переконайтеся, що ваш нікнейм вірний для отримання повідомлень.</small>
        </div>

        {/* Керування */}
        <button className="primary-btn" onClick={() => navigate("/onboarding")} style={{marginBottom: "15px"}}>
          Редагувати профіль
        </button>
        
        <div className="auth-details-wrapper">
          <AuthDetails />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;