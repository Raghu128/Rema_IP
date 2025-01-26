import React, { useState,useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/AddSponsorProjectForm.css";

const AddSponsorProjectForm = () => {
  const { user } = useSelector((state) => state.user);
  

  const [formData, setFormData] = useState({
    faculty_id: user ? user.id : "",  // Ensure faculty_id is set correctly
    agency: "",
    title: "",
    cfp_url: "",
    status: "active", // Default status
    start_date: "",
    duration: "",
    budget: "",
    remarks: "",
  });
  useEffect(() => {
    if (user?.id) {
      setFormData((prevState) => ({
        ...prevState,
        faculty_id: user.id,
      }));
    }
  }, [user?.id]);

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" || type === "date" ? value : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if faculty_id is missing
    if (!formData.faculty_id) {
      setMessage("Faculty ID is required.");
      return;
    }

    console.log(formData);

    try {
      const response = await axios.post("/api/v1/sponsor-projects", formData); // Ensure the correct API endpoint
      setMessage(`Sponsorship Project created successfully: ${response.data.title}`);
      // Reset form
      setFormData({
        faculty_id: user ? user.id : "",  // Resetting faculty_id correctly
        agency: "",
        title: "",
        cfp_url: "",
        status: "active",
        start_date: "",
        duration: "",
        budget: "",
        remarks: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to create sponsorship project");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Add Sponsorship Project</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit} className="sponsor-form">
        <div className="form-group">
          <label htmlFor="agency">Agency:</label>
          <input
            type="text"
            id="agency"
            name="agency"
            value={formData.agency}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Project Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cfp_url">CFP URL:</label>
          <input
            type="url"
            id="cfp_url"
            name="cfp_url"
            value={formData.cfp_url}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (months):</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget:</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            min="0"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="form-submit-btn">Add Sponsorship Project</button>
        </div>
      </form>
    </div>
  );
};

export default AddSponsorProjectForm;
