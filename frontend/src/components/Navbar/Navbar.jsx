import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaComments,
  FaUser,
  FaBell,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaIdBadge,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("civix_theme") || "light";
    } catch {
      return "light";
    }
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("civix_theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleProfileClick = () => {
    if (user.role === "user") {
      navigate("/profile");
    } else if (user.role === "admin" || user.role === "superadmin") {
      navigate("/admin/profile");
    } else {
      navigate("/worker/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar" data-testid="civix-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-dot" />
          <span>CiviX</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            data-testid="nav-issues"
          >
            <FaHome /> <span>Issues</span>
          </Link>
          {user.role === "user" && (
            <Link
              to="/report"
              className={`nav-link ${location.pathname === "/report" ? "active" : ""}`}
              data-testid="nav-report"
            >
              <FaPlus /> <span>Report</span>
            </Link>
          )}
          <Link
            to="/chat-history"
            className={`nav-link ${location.pathname === "/chat-history" ? "active" : ""}`}
            data-testid="nav-chat"
          >
            <FaComments /> <span>Chat</span>
          </Link>

          {/* Mobile only logout button */}
          {mobileMenuOpen && (
            <button
              type="button"
              className="nav-link mobile-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          )}
        </div>

        {/* User profile & interactive actions */}
        <div className="user-profile">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
            data-testid="theme-toggle-btn"
          >
            {theme === "dark" ? <FaSun className="theme-sun" /> : <FaMoon className="theme-moon" />}
          </button>

          {/* Notification Button */}
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="notification-button"
            title="Notifications"
            aria-label="Notifications"
            data-testid="nav-notifications-btn"
          >
            <FaBell />
            <span className="notification-dot" title="Unread alerts" />
          </button>

          {/* Profile Dropdown Container */}
          <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className={`profile-button ${profileDropdownOpen ? "active" : ""}`}
              title="Account Menu"
              aria-label="Account Menu"
              aria-expanded={profileDropdownOpen}
              data-testid="nav-profile-menu-btn"
            >
              <FaUser />
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown-menu" data-testid="profile-dropdown">
                <div className="dropdown-user-header">
                  <div className="user-avatar-circle">
                    {user.username ? user.username[0].toUpperCase() : "U"}
                  </div>
                  <div className="user-text-info">
                    <span className="user-name">{user.username || "Civic Citizen"}</span>
                    <span className="user-role-chip">{user.role || "Citizen"}</span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleProfileClick}
                >
                  <FaIdBadge /> View Profile
                </button>

                {user.role === "user" && (
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => navigate("/report")}
                  >
                    <FaPlus /> Report New Issue
                  </button>
                )}

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
