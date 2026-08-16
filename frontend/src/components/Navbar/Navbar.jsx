import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-title">
        <span>Welcome Back 👋</span>
      </div>

      <div className="nav-right">
        <FaBell className="icon" />

        {user && (
          <div className="navbar-profile" ref={menuRef}>

            <FaUserCircle
              className="profile-icon"
              onClick={() => setMenuOpen(prev => !prev)}
            />

            {menuOpen && (
              <div className="navbar-dropdown">

                <div className="navbar-dropdown__email">
                  {user.email}
                </div>

                <button
                  className="navbar-dropdown__logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Log out
                </button>

              </div>
            )}

          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;