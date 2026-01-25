import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../services/firebase";
import "../../styles/AuthLayout.css";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [copyPassword, setCopyPassword] = useState("");
    const [error, setError] = useState("");

    function register(e) {
        e.preventDefault();
        if (copyPassword !== password) {
            setError("Паролі не збігаються");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                setError("");
                setEmail("");
                setPassword("");
                setCopyPassword("");
            })
            .catch((err) => setError(err.message));
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Створити акаунт</h2>
                <p style={{ color: "var(--gray)", marginBottom: "20px" }}>Знайдіть свою половинку за всесвітом</p>
                <form onSubmit={register}>
                    <input 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        required 
                    />
                    <input 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        required 
                    />
                    <input 
                        placeholder="Repeat Password" 
                        value={copyPassword} 
                        onChange={(e) => setCopyPassword(e.target.value)} 
                        type="password" 
                        required 
                    />
                    <button className="primary-btn" type="submit">Зареєструватися</button>
                    {error && <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignUp;