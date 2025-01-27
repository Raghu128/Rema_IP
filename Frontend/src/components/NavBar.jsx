import React, { useState } from "react";
import '../styles/NavBar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar">
        <div className="navbar-website-name">
            <h1>Rema</h1>
        </div>
    </div>
  );
};

export default Navbar;
