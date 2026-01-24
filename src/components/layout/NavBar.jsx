import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Функція для підсвічування активного пункту
  const activeStyle = (path) => ({
    fontWeight: location.pathname === path ? "bold" : "normal",
    color: location.pathname === path ? "#ff4b2b" : "#000",
    textDecoration: "none"
  });

  return (
    <nav style={styles.nav}>
      <Link style={activeStyle("/home")} to="/home">Стрічка</Link>
      <Link style={activeStyle("/matches")} to="/matches">Метчі</Link>
      <Link style={activeStyle("/profile")} to="/profile">Профіль</Link>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-around",
    padding: "15px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    zIndex: 100
  }
};

export default Navbar;