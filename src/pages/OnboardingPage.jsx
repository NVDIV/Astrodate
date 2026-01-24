import React from "react";
import AuthDetails from "../components/auth/AuthDetails";

const OnboardingPage = () => {
  return (
        <div>
            <h1>Заповнення профілю</h1>
            <p>Тут буде ваша форма з іменем, віком та фото.</p>
            <AuthDetails />
        </div>
    );
};

export default OnboardingPage;