// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 2); // change 50 to any threshold you like
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isLoggedIn = !!user.role;
  const isCoordinator = user.role === "coordinator";
  const isAdmin = user.role === "superadmin";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled || menuOpen ? "scrolled" : ""}`}>
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <img className="logoImg" src="https://campulse-sit.vercel.app/campulseLogo.png" alt="CamPulse Logo" />
          <p>CamPulse</p>
        </Link>
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
        </div>
      </div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/home" className="navbar-item" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/calendar" className="navbar-item" onClick={() => setMenuOpen(false)}>
          Calendar
        </Link>

        {isLoggedIn && user.role !== "superadmin" && (
          <Link to="/profile" className="navbar-item" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="navbar-item" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="navbar-item" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        ) : (
          <>
            {isCoordinator && (
              <>
                <Link to="/post-event" className="navbar-item" onClick={() => setMenuOpen(false)}>
                  Post Event
                </Link>
                <Link to="/dashboard" className="navbar-item" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin-dashboard" className="navbar-item" onClick={() => setMenuOpen(false)}>
                  Admin Dashboard
                </Link>
                <Link to="/admin-post" className="navbar-item" onClick={() => setMenuOpen(false)}>
                  All Events
                </Link>
              </>
            )}
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="navbar-item logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
