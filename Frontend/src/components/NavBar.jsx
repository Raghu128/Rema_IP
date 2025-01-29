import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/NavBar.css";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);


  async function logoutUser() {

    try {
      const response = await fetch('/api/v1/logout', {
        method: 'POST', // or 'GET', depending on your implementation
        headers: {
          'Content-Type': 'application/json',
          // Optionally, add the Authorization token if required
          // 'Authorization': `Bearer ${yourToken}`
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        console.error(data.message); // Handle error (e.g., show an alert)
      }
    } catch (error) {
      console.error('Error logging out:', error); // Handle network errors
    }
  }


  return (
    <nav className="navbar">
      <div className="navbar-website-name">
        <h1>Rema</h1>
      </div>



      {/* Navigation Links */}
      {user && <ul className={`nav-links`}>
        <li><Link onClick={logoutUser}>Logout</Link></li>
      </ul>}
    </nav>
  );
};

export default Navbar;
