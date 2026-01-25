import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../../styles/NavBar.css"

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <NavLink className="nav-link" to="/home">Стрічка</NavLink>
      <NavLink className="nav-link" to="/matches">Метчі</NavLink>
      <NavLink className="nav-link" to="/profile">Профіль</NavLink>
    </nav>
  );
};

export default Navbar;