import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/Notification/NotificationsList.css";
import Loader from "../Loader";

const NotificationsList = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/v1/notifications/${user.id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json()).notification;

        // Map notifications to include added_by_name from populated object (if available)
        const updatedNotifications = data.map((notif) => {
          const addedByName =
            notif.added_by && typeof notif.added_by === "object"
              ? notif.added_by._id === user.id
                ? "Self"
                : notif.added_by.name
              : "Unknown User";
          return { ...notif, added_by_name: addedByName };
        });

        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Helper function: check if notification is expired based on due_date
  const isExpired = (dueDate) => new Date(dueDate) < new Date();

  // Delete notification if allowed
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
      setLoading(true);
      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete notification.");
      }
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Failed to delete notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="notification-container">
      <div className="notification-top-container">
                <h2 id="notification-title">📢 Notifications</h2>
      <button className="notification-add-btn" onClick={() => navigate("/manage-notification")}>
        ➕  
      </button>
      </div>
      

      {error && <p className="notification-error">{error}</p>}
      {!loading && !error && notifications.length === 0 && (
        <p className="notification-message">No notifications available.</p>
      )}

      {!loading && !error && notifications.length > 0 && (
        <table className="notification-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Priority</th>
              <th>Text</th>
              <th>Due Date</th>
              <th>Added By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif) => {
              const expired = isExpired(notif.due_date);
              return (
                <tr key={notif._id} className={expired ? "expired" : ""}>
                  <td>{getTypeIcon(notif.type)}</td>
                  <td>{getPriorityIcon(notif.priority)}</td>
                  <td>{notif.text}</td>
                  <td>{new Date(notif.due_date).toLocaleDateString()}</td>
                  <td>{notif.added_by_name}</td>
                  <td>
                    <button
                      className="notification-delete-btn"
                      onClick={() => deleteNotification(notif._id, notif.added_by)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NotificationsList;
