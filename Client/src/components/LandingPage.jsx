import React from "react";
import { useSelector } from "react-redux";
import NotificationsList from "./Notification/NotificationsList";
import VenueListComponent from "./Venues/VenueListComponent";
import CurrentUserLeaveList from "./Leaves/CurrentUserLeaveList";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="landingpage-dashboard">
      <div className="landingpage-header">
      </div>

      <div className="landingpage-content">
        {/* Main Notifications Section - Takes 70% width on larger screens */}
        <section className="dashboard-section notifications-main">
          <div className="section-content">
            <NotificationsList />
          </div>
        </section>

        <section className="dashboard-section-right venues-compact">
          <div className="landingpage-section-content">
            <VenueListComponent compact={true} />

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
