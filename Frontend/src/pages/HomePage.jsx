import React, { useState } from "react";
import Projects from "../components/Projects";
import Students from "../components/Students";
import Venues from "../components/Venues";
import Reports from "../components/Reports";

function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState("projects");

  const handleNavClick = (component) => {
    setSelectedComponent(component);
  };

  let componentToRender;

  switch (selectedComponent) {
    case "projects":
      componentToRender = <Projects />;
      break;
    case "students":
      componentToRender = <Students />;
      break;
    case "venues":
      componentToRender = <Venues />;
      break;
    case "reports":
      componentToRender = <Reports />;
      break;
    default:
      componentToRender = <h2>Select a section from the menu</h2>;
  }

  return (
    <div style={mainContainerStyle}>
      {/* Navbar */}
      <nav style={navStyle}>
        <ul style={navListStyle}>
          <li style={navItemStyle}>
            <button style={navButtonStyle} onClick={() => handleNavClick("projects")}>
              Projects
            </button>
          </li>
          <li style={navItemStyle}>
            <button style={navButtonStyle} onClick={() => handleNavClick("students")}>
              Students
            </button>
          </li>
          <li style={navItemStyle}>
            <button style={navButtonStyle} onClick={() => handleNavClick("venues")}>
              Venues
            </button>
          </li>
          <li style={navItemStyle}>
            <button style={navButtonStyle} onClick={() => handleNavClick("reports")}>
              Reports
            </button>
          </li>
        </ul>
      </nav>

      {/* Content Display */}
      <div style={mainContentStyle}>
        {componentToRender}
      </div>
    </div>
  );
}

const mainContainerStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

const navStyle = {
  backgroundColor: "#333",
  padding: "10px 20px",
  marginBottom: "20px",
};

const navListStyle = {
  listStyleType: "none",
  padding: 0,
  display: "flex",
  justifyContent: "center",
};

const navItemStyle = {
  margin: "0 15px",
};

const navButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  padding: "10px",
  cursor: "pointer",
  transition: "background-color 0.3s ease, transform 0.3s ease",
};

const mainContentStyle = {
  padding: "20px",
  textAlign: "center",
  flex: "1", // Ensure it takes up the remaining space
};

export default HomePage;
