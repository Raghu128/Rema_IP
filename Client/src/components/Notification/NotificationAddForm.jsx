import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPlus, 
  faSearch,
  faCalendarAlt,
  faExclamationCircle,
  faCheckCircle,
  faBell,
  faTasks,
  faFlag,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Notification/AddForm.css';

const NotificationAddForm = () => {
    const { user } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getTodayDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
            today: today.toISOString().split("T")[0],
            tomorrow: tomorrow.toISOString().split("T")[0]
        };
    };

    const { today, tomorrow } = getTodayDate();
    
    const [formData, setFormData] = useState({
        type: "reminder",
        text: "",
        creation_date: today,
        due_date: tomorrow,
        priority: "medium",
        added_by: user?.id || "",
        view: [],
    });

    const notificationTypes = [
        { value: "reminder", label: "Reminder", icon: faBell },
        { value: "todo", label: "To-Do", icon: faTasks },
        { value: "deadline", label: "Deadline", icon: faFlag },
        { value: "announcement", label: "Announcement", icon: faBullhorn }
    ];

    useEffect(() => {
        if (!user) navigate("/");
    }, [user, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let response = {};
                
                if(user.role === "faculty") response = await axios.get(`/api/v1/user/${user?.id}`);
                else response = await axios.get(`/api/v1/user/studentConnection/${user?.id}`);
                
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setMessage({ text: "Failed to fetch users.", type: "error" });
            }
        };
        fetchUsers();
    }, [user?.id]);    

    const validateForm = () => {
        const newErrors = {};
        if (!formData.text.trim()) newErrors.text = "Notification text is required";
        if (!formData.due_date) newErrors.due_date = "Due date is required";
        if (formData.due_date && new Date(formData.due_date) < new Date(today)) {
            newErrors.due_date = "Due date cannot be in the past";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            view: checked ? [...prev.view, value] : prev.view.filter(id => id !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await axios.post("/api/v1/notifications", formData);
            setMessage({ text: "Notification created successfully!", type: "success" });
            setFormData(prev => ({
                ...prev,
                text: "",
                due_date: tomorrow,
                priority: "medium",
                view: []
            }));
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } catch (error) {
            console.error("Error adding notification:", error);
            setMessage({ 
                text: error.response?.data?.message || "Failed to create notification", 
                type: "error" 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(userItem =>
        userItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="notification-add-form">
            <div className="notification-add-form-header">
                <button onClick={() => navigate(-1)} className="notification-add-form-back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="notification-add-form-header-content">
                    <h1>Create New Notification</h1>
                    <p>Fill out the form below to create a new notification</p>
                </div>
            </div>

            {message.text && (
                <div className={`notification-add-form-alert notification-add-form-alert-${message.type}`}>
                    <FontAwesomeIcon icon={message.type === "success" ? faCheckCircle : faExclamationCircle} />
                    <span>{message.text}</span>
                </div>
            )}

            <form className="notification-add-form-container" onSubmit={handleSubmit}>
                <div className="notification-add-form-card">
                    <h3 className="notification-add-form-card-title">
                        <span className="notification-add-form-accent-bar"></span>
                        Notification Details
                    </h3>
                    
                    <div className="notification-add-form-grid">
                        <div className="notification-add-form-group">
                            <label>Notification Type</label>
                            <div className="notification-add-form-type-selector">
                                {notificationTypes.map(type => (
                                    <button
                                        type="button"
                                        key={type.value}
                                        className={`notification-add-form-type-option ${formData.type === type.value ? "active" : ""}`}
                                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                    >
                                        <FontAwesomeIcon icon={type.icon} />
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="notification-add-form-group">
                            <label>Priority Level</label>
                            <div className="notification-add-form-priority-selector">
                                {[
                                    { level: "low", color: "#4CAF50" },
                                    { level: "medium", color: "#FF9800" },
                                    { level: "high", color: "#F44336" }
                                ].map(item => (
                                    <label key={item.level} className={`notification-add-form-priority-option ${formData.priority === item.level ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={item.level}
                                            checked={formData.priority === item.level}
                                            onChange={handleChange}
                                        />
                                        <span 
                                            className="notification-add-form-priority-badge" 
                                            style={{ backgroundColor: item.color }}
                                        ></span>
                                        {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>
                        <div className="notification-add-form-info-container">
                        <div className="notification-add-form-group notification-add-form-full-width">
                            <label>Message Content</label>
                            <textarea 
                                name="text" 
                                value={formData.text} 
                                onChange={handleChange} 
                                placeholder="Enter your notification message..."
                                className={`notification-add-form-textarea ${errors.text ? "error" : ""}`}
                                rows="4"
                            />
                            {errors.text && <span className="notification-add-form-error-message">{errors.text}</span>}
                        </div>

                        <div className="notification-add-form-group">
                            <label>Due Date</label>
                            <div className="notification-add-form-date-input-container">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <input 
                                    type="date" 
                                    name="due_date" 
                                    value={formData.due_date} 
                                    onChange={handleChange} 
                                    min={today}
                                    className={`notification-add-form-date-input ${errors.due_date ? "error" : ""}`}
                                />
                            </div>
                            {errors.due_date && <span className="notification-add-form-error-message">{errors.due_date}</span>}
                        </div>
                        </div>
                </div>

                <div className="notification-add-form-card">
                    <h3 className="notification-add-form-card-title">
                        <span className="notification-add-form-accent-bar"></span>
                        Recipients
                    </h3>
                    
                    <div className="notification-add-form-group">
                        <div className="notification-add-form-search-container">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="notification-add-form-recipients-list">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(userItem => (
                                    <label key={userItem._id} className="notification-add-form-recipient-item">
                                        <input
                                            type="checkbox"
                                            value={userItem._id}
                                            checked={formData.view.includes(userItem._id)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="notification-add-form-checkmark"></div>
                                        <div className="notification-add-form-user-avatar">
                                            {userItem.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="notification-add-form-user-details">
                                            <span className="notification-add-form-user-name">{userItem.name}</span>
                                            <span className="notification-add-form-user-email">{userItem.email}</span>
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <div className="notification-add-form-no-results">No matching users found</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="notification-add-form-actions">
                    <button 
                        type="submit" 
                        className="notification-add-form-submit-btn"
                        disabled={isSubmitting || !formData.text || !formData.due_date}
                    >
                        {isSubmitting ? (
                            <span className="notification-add-form-spinner"></span>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPlus} />
                                Create Notification
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NotificationAddForm;