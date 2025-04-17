import React from "react";
import "../styles/FacultyDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentProjects from "../components/SimpleProjects/StudentProject";
import StudentEquipmentList from "../components/Equipment/StudentEquipment";
import NotificationsList from "../components/Notification/NotificationsList";
import VenueListComponent from "../components/Venues/VenueListComponent";
import LandingPage from "../components/LandingPage";
import StudentLeaves from "../components/Leaves/StudentLeaves";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/FacultyDashboard.css";
import CurrentSubmissions from "../components/SimpleProjects/CurrentSubmissions";

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faProjectDiagram,
  faLaptop,
  faCalendarAlt,
  faHome,
  faUserGraduate
} from '@fortawesome/free-solid-svg-icons';

const StudentDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.user);
  const currElement = searchParams.get("tab");
  const navigate = useNavigate();


  // Icon mapping for each tab
  const iconMap = {
    Projects: faProjectDiagram,
    Submission: faProjectDiagram,
    Equipment: faLaptop,
    Leaves: faCalendarAlt,
    Home: faHome
  };

  const renderComponent = () => {
    if (!user?.id) return <p className="loading-text">Loading... Please wait.</p>;

    const componentMap = {
      Projects: <StudentProjects id={user.id} />,
      Submission: <CurrentSubmissions/>,
      Venues: <VenueListComponent />,
      Notifications: <NotificationsList />,
      Equipment: <StudentEquipmentList />,
      Leaves: <StudentLeaves />,
    };

    return componentMap[currElement] || <LandingPage />;
  };

  const handleNavigation = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="faculty-dashboard-container">
      {/* Enhanced Sidebar */}
      <div className="faculty-sidebar" >
        <div className="sidebar-header" onClick={() => navigate('/')}>
          <div className="faculty-user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
          <div className="app-logo">
            {/* <FontAwesomeIcon icon={faUserGraduate} className="logo-icon" /> */}
            <span>Student Portal</span>
          </div>
          </div>
        </div>
        
        <ul className="faculty-sidebar-list">
          {["Projects", "Submission", "Equipment", "Leaves"].map((item) => (
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
          <div className="quick-links">
            <a href="/help" className="help-link">Help Center</a>
            <a href="/feedback" className="feedback-link">Give Feedback</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="faculty-main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default StudentDashboard;