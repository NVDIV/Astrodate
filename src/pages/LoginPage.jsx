import React from "react";
import SignIn from "../components/auth/SignIn";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
        <div>
            <h1>З поверненням!</h1>
            <p>Будь ласка, увійдіть у свій акаунт</p>
            <SignIn />
            <p>
                Ще не з нами? <Link to="/signup">Зареєструватися</Link>
            </p>
        </div>
    );
};

export default LoginPage;