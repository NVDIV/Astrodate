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
    // const [gender, setGender] = useState(userData?.gender || "");
    const [birthDate, setBirthDate] = useState(userData?.birthDate || "");
    const [birthTime, setBirthTime] = useState(userData?.birthTime || "");
    const [city, setCity] = useState(userData?.city || "");
    const [bio, setBio] = useState(userData?.bio || "");
    const [telegram, setTelegram] = useState(userData?.telegram || "");
    const [image, setImage] = useState(null); 
    const [preview, setPreview] = useState(userData?.photoURL || ""); 
    const [isUploading, setIsUploading] = useState(false); 
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const photoURL = await uploadToCloudinary();
            const zodiac = getZodiacSign(birthDate);

            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                // gender,
                birthDate,
                city,
                bio,
                telegram,
                photoURL,
                zodiacSign: zodiac,
                uid: user.uid,
                setupComplete: true
            });

            await refreshUserData(user.uid);
            navigate("/home");
        } catch (error) {
            setError("Помилка збереження профілю");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Створює тимчасове посилання для показу на екрані
        }
    };

    const uploadToCloudinary = async () => {
        if (!image) return userData?.photoURL || ""; // Якщо фото не міняли, лишаємо старе

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "ml_default");

        try {
            setIsUploading(true);
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dtyxgd3ts/image/upload`,
                { method: "POST", body: formData }
            );
            const data = await response.json();
            setIsUploading(false);
            return data.secure_url; // Це і є пряме посилання на фото
        } catch (err) {
            console.error("Cloudinary error:", err);
            setIsUploading(false);
            return "";
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>✨ Твій зодіакальний профіль</h2>
                <p style={{color: "var(--gray)", marginBottom: "20px"}}>Крок до знайомства за зірками</p>

                <form onSubmit={handleSubmit} className="onboarding-form">

                {/* Блок Фото */}
                <div className="photo-upload-container">
                    <label>Фото профілю</label>
                    <div className="photo-preview" onClick={() => document.getElementById('fileInput').click()}>
                        {preview ? (
                            <img src={preview} alt="Profile" />
                        ) : (
                            <span>Натисніть, щоб додати фото</span>
                        )}
                    </div>
                    <input 
                        id="fileInput"
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        style={{ display: "none" }} 
                    />
                </div>

                {/* <label style={{ display: "block", textAlign: "left", marginTop: "10px" }}>Ваша стать:</label>
                <div className="gender-selection">
                    <div className={`gender-option ${gender === "male" ? "selected" : ""}`} onClick={() => setGender("male")}>
                        Чоловік
                    </div>
                    <div className={`gender-option ${gender === "female" ? "selected" : ""}`} onClick={() => setGender("female")}>
                        Жінка
                    </div>
                </div> */}

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