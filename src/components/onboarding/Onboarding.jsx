import React, { useState } from "react";
import { db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getZodiacSign } from "../../utils/getZodiacSign";
import { useAuth } from "../../context/AuthContext";
import "../../styles/AuthLayout.css";

const Onboarding = () => {
    const { user, userData, refreshUserData } = useAuth();
    const navigate = useNavigate();

    // Ініціалізуємо стейти даними з контексту (якщо вони там вже є)
    const [firstName, setFirstName] = useState(userData?.firstName || "");
    const [lastName, setLastName] = useState(userData?.lastName || "");
    const [birthDate, setBirthDate] = useState(userData?.birthDate || "");
    const [birthTime, setBirthTime] = useState(userData?.birthTime || "");
    const [city, setCity] = useState(userData?.city || "");
    const [bio, setBio] = useState(userData?.bio || "");
    const [telegram, setTelegram] = useState(userData?.telegram || "");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user) {
            const zodiac = getZodiacSign(birthDate);
            
            try {
                await setDoc(doc(db, "users", user.uid), {
                    firstName,
                    lastName,
                    birthDate,
                    birthTime,
                    city,
                    bio,
                    telegram,
                    zodiacSign: zodiac,
                    uid: user.uid,
                    email: user.email,
                    setupComplete: true
                });
                
                // КЛЮЧОВИЙ МОМЕНТ: оновлюємо дані в контексті
                await refreshUserData(user.uid);
                
                console.log("Дані оновлено в Context та Firestore");
                navigate("/home");
            } catch (error) {
                console.error("Помилка:", error);
                setError("Не вдалося зберегти дані.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>✨ Твій зодіакальний профіль</h2>
                <p style={{color: "var(--gray)", marginBottom: "20px"}}>Крок до знайомства за зірками</p>

                <form onSubmit={handleSubmit} className="onboarding-form">
                
                <input placeholder="Ім'я" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input placeholder="Прізвище" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input placeholder="Місто" value={city} onChange={(e) => setCity(e.target.value)} required />
                <input placeholder="Telegram @user" value={telegram} onChange={(e) => setTelegram(e.target.value)} required />
                <textarea placeholder="Про себе" value={bio} onChange={(e) => setBio(e.target.value)} rows="4" />
                

                <div className="input-group">
                    <label>Дата народження</label>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label>Час народження</label>
                    <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
                </div>

                {birthDate && (
                    <div className="zodiac-badge">
                        ♋ {getZodiacSign(birthDate)}
                    </div>
                )}

                <button type="submit" className="primary-btn">
                    Зберегти дані
                </button>
                
                {error && <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>{error}</p>}
            </form>
            </div>
        </div>
    );
};

export default Onboarding;