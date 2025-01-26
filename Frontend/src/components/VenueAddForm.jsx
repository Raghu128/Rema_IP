import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/VenueAddForm.css";
import { useSelector } from "react-redux";

const VenueAddForm = () => {
  const [formData, setFormData] = useState({
    venue: "",
    year: "",
    url: "",
    added_by: "",
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
  });

  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

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
    if (user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        added_by: user.id, // Automatically set the faculty_id
      }));
    }
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
    setFormData((prevState) => {
      const updatedView = checked
        ? [...prevState.view, value]
        : prevState.view.filter((id) => id !== value);
      return { ...prevState, view: updatedView };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("/api/v1/venues", formData);
      setMessage(`Venue added successfully: ${response.data.venue}`);
      setFormData({
        venue: "",
        year: "",
        url: "",
        added_by: "",
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
      });
    } catch (error) {
      console.error("Error adding venue:", error);
      setMessage(error.response?.data?.message || "Failed to add venue.");
    }
  };

  return (
    <div className="venue-add-form">
      <h2 className="form-title">Add Venue</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit} className="venue-form">
        <div className="form-group">
          <label htmlFor="venue">Venue Name:</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1900"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">URL:</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="abstract_submission">Abstract Submission:</label>
          <input
            type="date"
            id="abstract_submission"
            name="abstract_submission"
            value={formData.abstract_submission}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="paper_submission">Paper Submission:</label>
          <input
            type="date"
            id="paper_submission"
            name="paper_submission"
            value={formData.paper_submission}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author_response">Author Response:</label>
          <input
            type="date"
            id="author_response"
            name="author_response"
            value={formData.author_response}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="meta_review">Meta Review:</label>
          <input
            type="date"
            id="meta_review"
            name="meta_review"
            value={formData.meta_review}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notification">Notification:</label>
          <input
            type="date"
            id="notification"
            name="notification"
            value={formData.notification}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="commitment">Commitment:</label>
          <input
            type="date"
            id="commitment"
            name="commitment"
            value={formData.commitment}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="main_conference_start">Main Conference Start:</label>
          <input
            type="date"
            id="main_conference_start"
            name="main_conference_start"
            value={formData.main_conference_start}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="main_conference_end">Main Conference End:</label>
          <input
            type="date"
            id="main_conference_end"
            name="main_conference_end"
            value={formData.main_conference_end}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="time_zone">Time Zone:</label>
          <input
            type="text"
            id="time_zone"
            name="time_zone"
            value={formData.time_zone}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>View Access:</label>
          <div className="checkbox-group">
            {users.map((user) => (
              <div key={user._id} className="checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={formData.view.includes(user._id)}
                    onChange={handleCheckboxChange}
                    className="checkbox-input"
                  />
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">Add Venue</button>
      </form>
    </div>
  );
};

export default VenueAddForm;
