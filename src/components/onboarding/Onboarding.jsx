import React, { useState } from "react";
import { db, auth } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getZodiacSign } from "../../utils/getZodiacSign";

const Onboarding = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        birthDate: "",
        birthTime: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser; // Отримуємо поточного юзера

        if (user) {
            const zodiac = getZodiacSign(formData.birthDate);
            
            try {
                // Створюємо документ у колекції "users" з ID, що дорівнює UID користувача
                await setDoc(doc(db, "users", user.uid), {
                    ...formData,
                    zodiacSign: zodiac,
                    uid: user.uid,
                    email: user.email,
                    setupComplete: true // Прапорець, що профіль заповнено
                });
                
                alert("Профіль збережено!");
                navigate("/dashboard"); // Або на головну
            } catch (error) {
                console.error("Помилка запису:", error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Розкажіть про себе</h2>
            
            <input name="firstName" placeholder="Ім'я" onChange={handleChange} required />
            <input name="lastName" placeholder="Прізвище" onChange={handleChange} required />
            
            <textarea name="bio" placeholder="Опис профілю" onChange={handleChange} />
            
            <label>Дата народження:</label>
            <input type="date" name="birthDate" onChange={handleChange} required />
            
            <label>Час народження:</label>
            <input type="time" name="birthTime" onChange={handleChange} />

            <button type="submit">Зберегти та продовжити</button>
        </form>
    );
};

export default Onboarding;