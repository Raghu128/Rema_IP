import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Notification/NotificationsList.css";
import { useNavigate } from "react-router-dom";

const NotificationsList = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/v1/notifications/${user.id}`);
        const data = (await response.json()).notification;

        // If added_by is populated as an object, check if its _id matches user.id.
        const updatedNotifications = data.map((notif) => {
          const addedByName =
            notif.added_by && typeof notif.added_by === "object"
              ? (notif.added_by._id === user.id ? "Self" : notif.added_by.name)
              : "Unknown User";
          return { ...notif, added_by_name: addedByName };
        });

        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Check if notification is expired based on due_date
  const isExpired = (dueDate) => new Date(dueDate) < new Date();

  // Delete notification if current user is the one who added it
  const deleteNotification = async (id, added_by) => {
    if (
      added_by &&
      typeof added_by === "object" &&
      added_by._id !== user?.id
    ) {
      alert("You cannot delete this");
      return;
    } else if (typeof added_by === "string" && added_by !== user?.id) {
      alert("You cannot delete this");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== id)
        );
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Function to get an icon for the notification type
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "todo":
        return "📝";
      case "reminder":
        return "⏰";
      case "deadline":
        return "📅";
      default:
        return "📌";
    }
  };

  // Function to get an icon for the priority level
  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "🔴";
      case "medium":
        return "🟠";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  return (
    <div className="notification-container">
      <button
        className="add-btn"
        onClick={() => navigate("/manage-notification")}
      >
        ➕ Add Notification
      </button>

      {loading ? (
        <p className="notification-message">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="notification-message">No notifications available.</p>
      ) : (
        <div className="notification-grid">
          {notifications.map((notif) => {
            const expired = isExpired(notif.due_date);
            return (
              <div
                key={notif._id}
                className={`notification-card ${expired ? "expired" : ""}`}
              >
                <div className="notification-tags">
                  <span
                    className="notification-bin-btn"
                    onClick={() =>
                      deleteNotification(notif._id, notif.added_by)
                    }
                  >
                    🗑️
                  </span>
                  <span className="type-icon">{getTypeIcon(notif.type)}</span>
                  <span className="priority-icon">
                    {getPriorityIcon(notif.priority)}
                  </span>
                </div>

                <p className="notification-text">📩 {notif.text}</p>

                <p className="notification-date">
                  📅 Due: {new Date(notif.due_date).toLocaleDateString()}
                </p>

                <p className="notification-added-by">
                  🏷️ Added by: {notif.added_by_name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
