import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Venues/VenueAddForm.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VenueAddForm = () => {
  const { user } = useSelector((state) => state.user);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const initialFormState = {
    venue: "",
    year: "",
    url: "",
    added_by: user?.id || "",
    date: "",
    abstract_submission: "",
    paper_submission: "",
    author_response: "",
    meta_review: "",
    notification: "",
    commitment: "",
    main_conference_start: "",
    main_conference_end: "",
    location: "",
    time_zone: "",
    view: [],
  };

  const [formData, setFormData] = useState(initialFormState);

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

  const fetchVenues = async () => {
    if (!user?.id) return;
    try {

      const response = await axios.get(`/api/v1/venues?added_by=${user.id}`);
      setVenues(response.data);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setMessage("Failed to fetch venues.");
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user]);

  useEffect(()=> {

    setFormData((prevData) => ({
      ...prevData,
      added_by: user?.id,
    }));
  },[user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        view: checked
          ? [...prevData.view, value]
          : prevData.view.filter((id) => id !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedVenue) {
        await axios.put(`/api/v1/venues/${selectedVenue._id}`, formData);
        setMessage("Venue updated successfully!");
      } else {
        await axios.post("/api/v1/venues", formData);
        setMessage("Venue added successfully!");
      }
      setFormData(initialFormState);
      setSelectedVenue(null);
      fetchVenues();
    } catch (error) {
      console.error("Error saving venue:", error);
      setMessage("Failed to save venue.");
    }
  };

  return (
    <div className="venue-form-container">
      <button className="venue-form-back-btn" onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="venue-form-title">{selectedVenue ? "Edit Venue" : "Add Venue"}</h2>
      {message && <p className="venue-form-message">{message}</p>}
      <form className="venue-form" onSubmit={handleSubmit}>
        <label className="venue-form-label">Venue Name:</label>
        <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="venue-form-input" required />

        <label className="venue-form-label">Year:</label>
        <input type="number" name="year" value={formData.year} onChange={handleChange} className="venue-form-input" required min="1900" />

        <label className="venue-form-label">URL:</label>
        <input type="url" name="url" value={formData.url} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Abstract Submission:</label>
        <input type="date" name="abstract_submission" value={formData.abstract_submission} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Paper Submission:</label>
        <input type="date" name="paper_submission" value={formData.paper_submission} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Author Response:</label>
        <input type="date" name="author_response" value={formData.author_response} onChange={handleChange} className="venue-form-input" />

        {/* adding here */}
        <label className="venue-form-label">Meta Review:</label>
        <input type="date" name="meta_review" value={formData.meta_review} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Notification:</label>
        <input type="date" name="notification" value={formData.notification} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Commitment:</label>
        <input type="date" name="commitment" value={formData.commitment} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Main Conference Start:</label>
        <input type="date" name="main_conference_start" value={formData.main_conference_start} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Main Conference End:</label>
        <input type="date" name="main_conference_end" value={formData.main_conference_end} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} className="venue-form-input" />

        <label className="venue-form-label">Time Zone:</label>
        <input type="text" name="time_zone" value={formData.time_zone} onChange={handleChange} className="venue-form-input" />


        <label className="venue-form-label">View Access:</label>
        <div className="venue-form-checkbox-group">
          {users.map((user) => (
            <div key={user._id} className="venue-form-checkbox">
              <input type="checkbox" value={user._id} onChange={handleChange} checked={formData.view.includes(user._id)} className="venue-access-checkbox" />
              {user.email}
            </div>
          ))}
        </div>

        <button type="submit" className="venue-form-submit-btn">{selectedVenue ? "Update Venue" : "Add Venue"}</button>
      </form>
    </div>
  );
};

export default VenueAddForm;
