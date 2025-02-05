import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/Notification/NotificationsList.css"; // Ensure the correct CSS path
import { useNavigate } from "react-router-dom";

const NotificationsList = () => {
    const { user } = useSelector((state) => state.user);
    const [notifications, setNotifications] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`/api/v1/notifications/${user.id}`);
                const data = (await response.json()).notification;

                // Group notifications by type
                const groupedNotifications = data.reduce((acc, notification) => {
                    const type = notification.type || "Others"; // Default type
                    if (!acc[type]) acc[type] = [];
                    acc[type].push(notification);
                    return acc;
                }, {});

                setNotifications(groupedNotifications);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    return (
        <div className="notification-container">
            <h2 className="notification-title">Notifications</h2>
            <button onClick={()=> navigate("/manage-notification")}>Add</button>
            {loading ? (
                <p className="notification-message">Loading notifications...</p>
            ) : Object.keys(notifications).length === 0 ? (
                <p className="notification-message">No notifications available.</p>
            ) : (
                Object.keys(notifications).map((type) => (
                    <div key={type} className="notification-section">
                        <h3 className="notification-type">{type}</h3>
                        <ul className="notification-list">
                            {notifications[type].map((notif) => (
                                <li key={notif._id} className="notification-item">
                                    <strong>Message:</strong> {notif.text}
                                    <p><strong>Created On:</strong> {new Date(notif.creation_date).toLocaleString()}</p>
                                    <p><strong>Due Date:</strong> {new Date(notif.due_date).toLocaleString()}</p>
                                    <p><strong>Priority:</strong> {notif.priority}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationsList;
