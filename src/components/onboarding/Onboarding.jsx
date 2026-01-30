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

    const [firstName, setFirstName] = useState(userData?.firstName || "");
    const [lastName, setLastName] = useState(userData?.lastName || "");
    const [gender, setGender] = useState(userData?.gender || ""); 
    const [preference, setPreference] = useState(userData?.preference || ""); 
    const [birthDate, setBirthDate] = useState(userData?.birthDate || "");
    const [city, setCity] = useState(userData?.city || "");
    const [bio, setBio] = useState(userData?.bio || "");
    const [telegram, setTelegram] = useState(userData?.telegram || "");
    const [image, setImage] = useState(null); 
    const [preview, setPreview] = useState(userData?.photoURL || ""); 
    const [isUploading, setIsUploading] = useState(false); 
    const [error, setError] = useState("");

    const validateAge = (date) => {
        const today = new Date();
        const birth = new Date(date);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age >= 18;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        if (!gender || !preference) {
            setError("Будь ласка, оберіть стать та преференції");
            return;
        }
        if (!validateAge(birthDate)) {
            setError("Сервіс доступний лише для осіб старше 18 років");
            return;
        }

        try {
            let photoURL = userData?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            
            if (image) {
                photoURL = await uploadToCloudinary();
            }

            const zodiac = getZodiacSign(birthDate);

            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                gender,
                preference,
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
            setPreview(URL.createObjectURL(file));
        }
    };

    const uploadToCloudinary = async () => {
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
            return data.secure_url;
        } catch (err) {
            setIsUploading(false);
            return "";
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card onboarding-card">
                <h2>✨ Твій профіль</h2>

                <form onSubmit={handleSubmit} className="onboarding-form">
                    
                    <div className="photo-upload-section">
                        <div className={`photo-preview portrait ${!preview ? 'placeholder' : ''}`} 
                             onClick={() => document.getElementById('fileInput').click()}>
                            {preview ? (
                                <img src={preview} alt="Profile" />
                            ) : (
                                <div className="placeholder-content">
                                    <span className="plus-icon">+</span>
                                    <span>Завантажити фото</span>
                                </div>
                            )}
                        </div>
                        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    </div>

                    <div className="input-row">
                        <input placeholder="Ім'я *" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input placeholder="Прізвище *" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>

                    <input placeholder="Місто *" value={city} onChange={(e) => setCity(e.target.value)} required />

                    <textarea placeholder="Про себе (кілька слів для анкети)" value={bio} onChange={(e) => setBio(e.target.value)} rows="3" />
                    
                    <div className="input-group">
                        <input placeholder="Telegram @username *" value={telegram} onChange={(e) => setTelegram(e.target.value)} required />
                        <small className="input-note">Профіль має бути відкритим. Якщо немає ніка — створіть його в налаштуваннях Telegram.</small>
                    </div>

                    <label className="section-label">Ваша стать *</label>
                    <div className="gender-selection">
                        {['male', 'female', 'other'].map(g => (
                            <div key={g} className={`gender-option ${gender === g ? "selected" : ""}`} onClick={() => setGender(g)}>
                                {g === 'male' ? 'Чоловік' : g === 'female' ? 'Жінка' : 'Інше'}
                            </div>
                        ))}
                    </div>

                    <label className="section-label">Кого ви шукаєте? *</label>
                    <div className="gender-selection">
                        {['male', 'female', 'all'].map(p => (
                            <div key={p} className={`gender-option ${preference === p ? "selected" : ""}`} onClick={() => setPreference(p)}>
                                {p === 'male' ? 'Чоловіків' : p === 'female' ? 'Жінок' : 'Всіх'}
                            </div>
                        ))}
                    </div>

                    <div className="input-group" style={{textAlign: 'left'}}>
                        <label className="section-label" style={{margin: '10px 0'}}>Дата народження *</label>
                        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                    </div>

                    {birthDate && (
                        <div className="zodiac-badge-display">
                            ✨ Ваш знак: <span>{getZodiacSign(birthDate)}</span>
                        </div>
                    )}

                    <button type="submit" className="primary-btn" disabled={isUploading} style={{marginTop: '20px'}}>
                        {isUploading ? "Завантаження..." : "Зберегти"}
                    </button>
                    
                    {error && <p className="error-msg">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Onboarding;