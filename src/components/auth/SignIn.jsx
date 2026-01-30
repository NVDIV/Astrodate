import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../services/firebase";
import "../../styles/AuthLayout.css";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function logIn(e) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                setError("");
                setEmail("");
                setPassword("");
            })
            .catch((error) => {
                setError("No such account.");
            });
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>З поверненням!</h2>
                <p style={{ color: "var(--gray)", marginBottom: "20px" }}>Увійдіть, щоб побачити свої зорі</p>
                <form onSubmit={logIn}>
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
                    <button className="primary-btn" type="submit">Увійти</button>
                    {error && <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignIn;