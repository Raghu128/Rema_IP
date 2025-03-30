import React from "react";
import { useSelector } from "react-redux";
import NotificationsList from "./Notification/NotificationsList";
import VenueListComponent from "./Venues/VenueListComponent";
import { FiBell, FiMapPin } from "react-icons/fi";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="landingpage-dashboard">
      <div className="landingpage-header">
        <h1>Notifications Dashboard{user?.name ? ` for ${user.name}` : ''}</h1>
        <p className="subtitle">Stay updated with your important alerts and venues</p>
      </div>

      <div className="landingpage-content">
        {/* Main Notifications Section - Takes 70% width on larger screens */}
        <section className="dashboard-section notifications-main">
          {/* <div className="section-header">
            <FiBell className="section-icon notification-icon" />
            <h2>Your Notifications</h2>
          </div> */}
          <div className="section-content">
            <NotificationsList />
          </div>
        </section>

        {/* Compact Venues Section - Takes 30% width on larger screens */}
        <section className="dashboard-section venues-compact">
          {/* <div className="section-header">
            <FiMapPin className="section-icon venue-icon" />
            <h2>Related Venues</h2>
          </div> */}
          <div className="section-content">
            <VenueListComponent compact={true} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;