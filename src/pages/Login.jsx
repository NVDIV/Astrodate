import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Реєстрація
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Після реєстрації відправляємо на Onboarding (заповнення профілю)
        navigate('/onboarding');
      } else {
        // Вхід
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">AstroMatch ✨</h1>
      <form onSubmit={handleAuth} className="flex flex-col gap-4 w-80">
        <input 
          type="email" placeholder="Email" 
          className="p-2 rounded bg-slate-800 border border-slate-700"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Пароль" 
          className="p-2 rounded bg-slate-800 border border-slate-700"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="bg-purple-600 p-2 rounded font-bold hover:bg-purple-700 transition">
          {isRegister ? "Створити акаунт" : "Увійти"}
        </button>
      </form>
      <button 
        onClick={() => setIsRegister(!isRegister)} 
        className="mt-4 text-sm text-slate-400 underline"
      >
        {isRegister ? "Вже є акаунт? Увійдіть" : "Немає акаунту? Реєстрація"}
      </button>
    </div>
  );
};

export default Login;