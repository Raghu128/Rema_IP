import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../styles/Sponsor/AddSponsorProjectForm.css";

const AddSponsorProjectForm = () => {
  const { user } = useSelector((state) => state.user);

  // Initialize formData with a fallback if `user` is null or undefined
  const [formData, setFormData] = useState({
    faculty_id: user ? user.id : "",
    agency: "",
    title: "",
    cfp_url: "",
    status: "active",
    start_date: "",
    duration: "",
    budget: "",
    remarks: "",
  });

  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && user.id) {
      const fetchSponsors = async () => {
        try {
          const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
          setSponsors(response.data);
        } catch (error) {
          console.error("Error fetching sponsors:", error);
        }
      };
      fetchSponsors();
    }
  }, [user?.id]); // Ensure that useEffect runs only if user and user.id are available

  const handleSelectSponsor = (sponsor) => {
    setSelectedSponsor(sponsor);
    setFormData({
      faculty_id: sponsor.faculty_id || user?.id,
      agency: sponsor.agency || "",
      title: sponsor.title || "",
      cfp_url: sponsor.cfp_url || "",
      status: sponsor.status || "active",
      start_date: sponsor.start_date ? new Date(sponsor.start_date).toISOString().split("T")[0] : "",
      duration: sponsor.duration || "",
      budget: sponsor.budget?.$numberDecimal ? parseFloat(sponsor.budget.$numberDecimal) : "",
      remarks: sponsor.remarks || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.faculty_id) {
      setMessage("Faculty ID is required.");
      return;
    }

    const requestData = {
      ...formData,
      budget: formData.budget ? formData.budget.toString() : "0",
    };

    try {
      if (selectedSponsor) {
        await axios.put(`/api/v1/sponsor-projects/${selectedSponsor._id}`, requestData);
        setMessage("Sponsorship Project updated successfully!");
      } else {
        await axios.post("/api/v1/sponsor-projects", requestData);
        setMessage("Sponsorship Project created successfully!");
      }

      const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
      setSponsors(response.data);
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save sponsorship project");
    }
  };

  const handleDelete = async () => {
    if (!selectedSponsor) return;

    try {
      await axios.delete(`/api/v1/sponsor-projects/${selectedSponsor._id}`);
      setMessage("Sponsorship Project deleted successfully!");

      const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
      setSponsors(response.data);
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete sponsorship project");
    }
  };

  const resetForm = () => {
    setSelectedSponsor(null);
    setFormData({
      faculty_id: user ? user.id : "",
      agency: "",
      title: "",
      cfp_url: "",
      status: "active",
      start_date: "",
      duration: "",
      budget: "",
      remarks: "",
    });
  };

  return (
    <div className="add-sponsor-container">
      <h2 className="add-sponsor-heading">{selectedSponsor ? "Edit Sponsorship Project" : "Add Sponsorship Project"}</h2>

      {message && <p className="add-sponsor-message">{message}</p>}

      <div className="add-sponsor-list">
        <h3>Existing Sponsorship Projects</h3>
        <ul>
          {sponsors.map((sponsor) => (
            <li key={sponsor._id} onClick={() => handleSelectSponsor(sponsor)} className="add-sponsor-item">
              {sponsor.title} - {sponsor.agency}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="add-sponsor-form">
        <div className="add-sponsor-group">
          <label htmlFor="agency">Agency:</label>
          <input type="text" id="agency" name="agency" value={formData.agency} onChange={handleChange} required />
        </div>

        <div className="add-sponsor-group">
          <label htmlFor="title">Project Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="add-sponsor-group">
          <label htmlFor="cfp_url">CFP URL:</label>
          <input type="url" id="cfp_url" name="cfp_url" value={formData.cfp_url} onChange={handleChange} />
        </div>

        <div className="add-sponsor-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="add-sponsor-group">
          <label htmlFor="start_date">Start Date:</label>
          <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} required />
        </div>

        <div className="add-sponsor-group">
          <label htmlFor="duration">Duration (months):</label>
          <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} required min="1" />
        </div>

        <div className="add-sponsor-group">
          <label htmlFor="budget">Budget:</label>
          <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} required min="0" />
        </div>

        <div className="add-sponsor-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
        </div>

        <div className="add-sponsor-actions">
          <button type="submit" className="add-sponsor-submit-btn">{selectedSponsor ? "Update Project" : "Add Sponsorship Project"}</button>
          {selectedSponsor && (
            <button type="button" className="add-sponsor-delete-btn" onClick={handleDelete}>Delete Project</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddSponsorProjectForm;
