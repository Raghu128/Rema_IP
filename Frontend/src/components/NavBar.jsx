import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import '../styles/NavBar.css'

const Navbar = () => {
  const { user } = useSelector((state) => state.user);

  const logoutUser = async () => {
    try {
      const response = await fetch('/api/v1/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => window.location.href = "/"}>
        <img src="/images.jpeg" alt="Website Logo" className="navbar-logo" />
      </div>

      <div className="navbar-menu">
        {user && <span className="navbar-user">Hello, {user?.email.split("@")[0]}</span>}
        <ul className="navbar-links">
          {user && (
            <li>
              <button className="navbar-logout" onClick={logoutUser}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
