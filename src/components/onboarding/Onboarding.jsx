import React, { useState } from "react";
import { db, auth } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getZodiacSign } from "../../utils/getZodiacSign";

const Onboarding = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [city, setCity] = useState("");
    const [bio, setBio] = useState("");
    const [telegram, setTelegram] = useState("");
    
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user) {
            // Вираховуємо знак зодіаку перед відправкою
            const zodiac = getZodiacSign(birthDate);
            
            try {
                // Зберігаємо всі дані окремими полями
                await setDoc(doc(db, "users", user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    birthTime: birthTime,
                    city: city,
                    bio: bio,
                    telegram: telegram,
                    zodiacSign: zodiac,
                    uid: user.uid,
                    email: user.email,
                    setupComplete: true
                });
                
                console.log("Профіль успішно створено");
                window.location.href = "/home";
            } catch (error) {
                console.error("Помилка запису в Firestore:", error);
                setError("Не вдалося зберегти дані. Спробуйте ще раз.");
            }
        } else {
            setError("Користувач не авторизований");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Налаштування профілю</h2>
                
                <input 
                    placeholder="Ім'я" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                />
                
                <input 
                    placeholder="Прізвище" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                />

                <input 
                    placeholder="Місто" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                />

                <input 
                    placeholder="Telegram username (напр. @user)" 
                    value={telegram} 
                    onChange={(e) => setTelegram(e.target.value)} 
                    required 
                />

                <textarea 
                    placeholder="Про себе (хобі, інтереси)" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    rows="4"
                />
                
                <div>
                    <label>Дата народження:</label>
                    <input 
                        type="date" 
                        value={birthDate} 
                        onChange={(e) => setBirthDate(e.target.value)} 
                        required 
                    />
                </div>

                {birthDate && (
                    <p>
                        Ваш знак зодіаку: <strong>{getZodiacSign(birthDate)}</strong>
                    </p>
                )}
                
                <div>
                    <label>Час народження (необов'язково):</label>
                    <input 
                        type="time" 
                        value={birthTime} 
                        onChange={(e) => setBirthTime(e.target.value)} 
                    />
                </div>

                <button type="submit">Завершити реєстрацію</button>
                
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default Onboarding;