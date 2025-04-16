import React from "react";
import { useSelector } from "react-redux";
import NotificationsList from "./Notification/NotificationsList";
import VenueListComponent from "./Venues/VenueListComponent";
import CurrentUserLeaveList from "./Leaves/CurrentUserLeaveList";
import CurrentSubmissions from "./SimpleProjects/CurrentSubmissions";
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
          <div className="section-content">
            <NotificationsList />
          </div>
        </section>

        <section className="dashboard-section-right venues-compact">
          <div className="section-content">
            <VenueListComponent compact={true} />

          </div>
            <div className="currentMonthLeave">
             <CurrentSubmissions />
            </div>
            <div className="currentMonthLeave">
            {user?.role === "faculty" && <CurrentUserLeaveList />}
            </div>
            
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
