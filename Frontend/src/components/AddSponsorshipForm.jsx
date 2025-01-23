import React, { useState } from "react";
import axios from "axios";

const AddSponsorProjectForm = () => {
  const [formData, setFormData] = useState({
    agency: "",
    title: "",
    cfp_url: "",
    status: "active", // Default status
    start_date: "",
    duration: "",
    budget: "",
    remarks: "",
  });

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
    try {
      const response = await axios.post("/api/v1/sponsor-projects", formData); // Ensure the correct API endpoint
      setMessage(`Sponsorship Project created successfully: ${response.data.title}`);
      // Reset form
      setFormData({
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
    <div>
      <h2>Add Sponsorship Project</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Agency */}
        <div>
          <label htmlFor="agency">Agency:</label>
          <input
            type="text"
            id="agency"
            name="agency"
            value={formData.agency}
            onChange={handleChange}
            required
          />
        </div>

        {/* Project Title */}
        <div>
          <label htmlFor="title">Project Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Call for Proposals URL */}
        <div>
          <label htmlFor="cfp_url">CFP URL:</label>
          <input
            type="url"
            id="cfp_url"
            name="cfp_url"
            value={formData.cfp_url}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Duration (in months) */}
        <div>
          <label htmlFor="duration">Duration (months):</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget">Budget:</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Add Sponsorship Project</button>
      </form>
    </div>
  );
};

export default AddSponsorProjectForm;
