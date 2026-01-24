import React from "react";
import Navbar from "../components/layout/NavBar";
import Onboarding from "../components/onboarding/Onboarding";
import AuthDetails from "../components/auth/AuthDetails";

const ProfilePage = () => {
  return (
    <div>
      <Navbar />
      <div>
        <h1>Профіль</h1>
        <Onboarding />
        <AuthDetails />
      </div>
    </div>
  );
};

export default ProfilePage;