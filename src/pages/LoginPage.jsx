import React from "react";
import SignIn from "../components/auth/SignIn";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="auth-page">
      <SignIn />
      <p className="auth-footer-text">
        Ще не з нами? <Link to="/signup">Зареєструватися</Link>
      </p>
    </div>
  );
};

export default LoginPage;