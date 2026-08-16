import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaRobot,
  FaBook,
} from "react-icons/fa";

import logo from "../../assets/logos/logo.svg";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <img src={logo} alt="CodeTrack Logo" />

        <div className="logo-text">

          <h2>
            <span className="code">Code</span>
            <span className="track">Track</span>
          </h2>

          <p>practice • visualize • progress</p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="sidebar-nav">

        <NavLink to="/" end className="nav-item">
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink to="/calendar" className="nav-item">
          <FaCalendarAlt />
          <span>Contest Calendar</span>
        </NavLink>

        <NavLink to="/ai-visualizer" className="nav-item">
          <FaRobot />
          <span>AI Assistant</span>
        </NavLink>

        <NavLink to="/sheets" className="nav-item">
          <FaBook />
          <span>Coding Sheets</span>
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;