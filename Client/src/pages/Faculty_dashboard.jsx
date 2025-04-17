import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/FacultyDashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faProjectDiagram,
  faUserGraduate,
  faHandshake,
  faMoneyBillWave,
  faLaptop,
  faCalendarAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons';

import Projects from "../components/SimpleProjects/Projects";
import Students from "../components/Supervisor/Students";
import UserEquipmentList from "../components/Equipment/UserEquipmentList";
import NotificationsList from "../components/Notification/NotificationsList";
import VenueListComponent from "../components/Venues/VenueListComponent";
import AddUserForm from "../components/UserForm";
import DisplaySponsors from "../components/Sponsor/DisplaySponsors";
import ExpensesList from "../components/Expenses/Allexpenses";
import LandingPage from "../components/LandingPage";
import LeavesForFacultyPage from "../components/Leaves/AllLeaves";
import CurrentSubmissions from "../components/SimpleProjects/CurrentSubmissions.jsx"

const FacultyDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Get tab from URL params (default to "Projects" if not provided)
  const currElement = searchParams.get("tab");
  const iconMap = {
    Projects: faProjectDiagram,
    Submission: faProjectDiagram,
    Students: faUserGraduate,
    Sponsor: faHandshake,
    Expenses: faMoneyBillWave,
    Equipment: faLaptop,
    Leaves: faCalendarAlt,
    Home: faHome
  };

  // Function to render the current component based on selected tab
  const renderComponent = () => {
    if (!user?.id) return <p>Loading... Please wait.</p>;    

    const componentMap = {
      Projects: <Projects
        id={user.id}
        searchParas={searchParams.get("search")}
      />,
      Students: <Students id={user.id} />,
      Submission: <CurrentSubmissions/>,
      Venues: <VenueListComponent />,
      Sponsor: <DisplaySponsors />,
      Notifications: <NotificationsList />,
      "Add-User": <AddUserForm />,
      Equipment: <UserEquipmentList />,
      Expenses: <ExpensesList />,
      Leaves: <LeavesForFacultyPage />,
    };

    return componentMap[currElement] || <LandingPage />;
  };

  // Function to handle navigation and update URL params
  const handleNavigation = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="faculty-dashboard-container">
      {/* Improved Sidebar */}
      <div className="faculty-sidebar">
        <div className="sidebar-header">
          <h3>Faculty DashBoard</h3>
          <div className="faculty-user-profile" onClick={() => navigate('/')}>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              {/* <span className="user-name">{user?.name}</span> */}
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
        </div>

        <ul className="faculty-sidebar-list">
          {["Projects", "Submission", "Students", "Sponsor", "Expenses", "Equipment", "Leaves"].map((item) => (
            <li
              key={item}
              className={currElement === item ? "active" : ""}
            >
              <Link to={`?tab=${item}`} onClick={() => handleNavigation(item)}>
                <FontAwesomeIcon icon={iconMap[item]} className="nav-icon" />
                <span className="nav-text">{item}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="app-version">v1.0.0</div>
        </div>
      </div>

      {/* Main Content (unchanged) */}
      <div className="faculty-main-content">{renderComponent()}</div>
    </div>
  );
};

export default FacultyDashboard;
