import React from "react";
import SignUp from "../components/auth/SignUp";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
        <div>
            <SignUp />
            <p>
                Вже маєте профіль? <Link to="/login">Увійти</Link>
            </p>
        </div>
    );
};

export default SignUpPage;