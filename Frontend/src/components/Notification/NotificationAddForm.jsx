import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/Notification/AddForm.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const NotificationAddForm = () => {
    const { user } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Formats date to YYYY-MM-DD
    };
    
    const [formData, setFormData] = useState({
        type: "",
        text: "",
        creation_date: getTodayDate(), // Pre-fill with today's date
        due_date: "",
        priority: "low",
        added_by: user?.id || "",
        view: [],
    });
    

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/v1/user");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setMessage("Failed to fetch users.");
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        setFormData((prevState) => ({
            ...prevState,
            added_by: user?.id || "",
        }));
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            view: checked
                ? [...prevState.view, value]
                : prevState.view.filter((id) => id !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/v1/notifications", formData);
            setMessage(`Notification added successfully: ${response.data.text}`);

            setFormData({
                type: "",
                text: "",
                creation_date: "",
                due_date: "",
                priority: "low",
                added_by: user?.id || "",
                view: [],
            });
        } catch (error) {
            console.error("Error adding notification:", error);
            setMessage(error.response?.data?.message || "Failed to add notification.");
        }
    };

    // Filter users based on search query
    const filteredUsers = users.filter((userItem) =>
        userItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="notification-form-container">
            <button onClick={() => navigate(-1)} className="notification-back-btn">
                <FontAwesomeIcon icon={faArrowLeft} /> Go Back
            </button>
            <h2 className="notification-title">Add Notification</h2>
            {message && <p className={message.startsWith("Notification added") ? "notification-message" : "notification-message error"}>{message}</p>}

            <form className="notification-form" onSubmit={handleSubmit}>
              <div className="notification-form-row">
                <div className="notification-form-group">
                    <label htmlFor="type">Type:</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        <option value="reminder">Reminder</option>
                        <option value="todo">To-Do</option>
                        <option value="deadline">Deadline</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                 <div className="notification-form-group">
                    <label htmlFor="priority">Priority:</label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
               </div>
                <div className="notification-form-group">
                    <label htmlFor="text">Text:</label>
                    <textarea id="text" name="text" value={formData.text} onChange={handleChange} required></textarea>
                </div>

                {/* <div className="notification-form-row">
                  <div className="notification-form-group">
                        <label htmlFor="creation_date">Creation Date:</label>
                        <input type="date" id="creation_date" name="creation_date" value={formData.creation_date} onChange={handleChange} required />
                    </div>
                  <div className="notification-form-group">
                        <label htmlFor="due_date">Due Date:</label>
                        <input type="date" id="due_date" name="due_date" value={formData.due_date} onChange={handleChange} />
                    </div>
                </div> */}
                <div className="notification-form-group">
                    <label>View Access:</label>
                    {/* Search Input */}
                    <div className="notification-search-container">
                        <FontAwesomeIcon icon={faSearch} className="notification-search-icon" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="notification-search-input"
                        />
                    </div>
                    <div className="notification-checkbox-container">
                        {filteredUsers.map((userItem) => ( // Use filteredUsers here
                            <label key={userItem._id} className="notification-checkbox-label">
                                <input
                                    type="checkbox"
                                    value={userItem._id}
                                    checked={formData.view.includes(userItem._id)}
                                    onChange={handleCheckboxChange}
                                />
                                {userItem.name} ({userItem.email})
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="notification-submit-btn">
                    <FontAwesomeIcon icon={faPlus} /> Add Notification
                </button>
            </form>
        </div>
    );
};

export default NotificationAddForm;