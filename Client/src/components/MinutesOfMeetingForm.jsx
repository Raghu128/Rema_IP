import React, { useState, useEffect } from "react";
import axios from "axios";

const MinutesOfMeetingForm = ({ currentUserId, onSubmitSuccess }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    pid: "",
    text: "",
    added_by: currentUserId || "", // Default to current user
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await axios.get("/api/v1/projects"); // Adjust the endpoint as needed
        setProjects(response.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get("/api/v1/users"); // Adjust the endpoint as needed
        setUsers(response.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.pid) {
      setError("Please select a project.");
      return;
    }

    if (!formData.added_by) {
      setError("Please select the user who added the minutes.");
      return;
    }

    // if (!formData.text.trim()) {
    //   setError("Minutes of Meeting text is required.");
    //   return;
    // }

    try {
      const response = await axios.post("/api/v1/minutes-of-meeting", formData);
      
      setSuccessMessage("Minutes of Meeting added successfully!");
      setFormData({
        pid: "",
        text: "",
        added_by: currentUserId || "",
        date: new Date().toISOString().split("T")[0],
      });

      if (onSubmitSuccess) onSubmitSuccess(response.data.minutesOfMeeting);
    } catch (err) {
      console.error(err);
      setError("Failed to add Minutes of Meeting. Please try again.");
    }
  };

  return (
    <div className="minutes-form-container">
      <h2>Add Minutes of Meeting</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        {/* Project Selection */}
        <div className="form-group">
          <label htmlFor="pid">Select Project</label>
          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : (
            <select
              id="pid"
              name="pid"
              value={formData.pid}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select a Project --</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Text Field */}
        <div className="form-group">
          <label htmlFor="text">Minutes of Meeting Text</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Enter the details of the meeting..."
          ></textarea>
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Added By (User Selection) */}
        <div className="form-group">
          <label htmlFor="added_by">Added By</label>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <select
              id="added_by"
              name="added_by"
              value={formData.added_by}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select a User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.displayName} ({user.email})
                </option>
              ))}
            </select>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Add Minutes
        </button>
      </form>
    </div>
  );
};

export default MinutesOfMeetingForm;
