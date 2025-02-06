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
    location: "",
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

  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
    setFormData({
      ...venue,
      date: venue.date ? new Date(venue.date).toISOString().split("T")[0] : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      setMessage(error.response?.data?.message || "Failed to save venue.");
    }
  };

  const handleDelete = async () => {
    if (!selectedVenue) return;
    try {
      await axios.delete(`/api/v1/venues/${selectedVenue._id}`);
      setMessage("Venue deleted successfully!");
      setFormData(initialFormState);
      setSelectedVenue(null);
      fetchVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
      setMessage("Failed to delete venue.");
    }
  };

  return (
    <div className="venue-add-form">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="venue-add-form-title">{selectedVenue ? "Edit Venue" : "Add Venue"}</h2>
      {message && <p className="venue-add-form-message">{message}</p>}

      <div className="venue-add-form-list">
        <h3 className="venue-add-form-list-title">Your Venues</h3>
        {venues.length > 0 ? (
          <ul className="venue-add-form-list-items">
            {venues.map((venue) => (
              <li key={venue._id} onClick={() => handleVenueSelect(venue)} className="venue-add-form-list-item">
                {venue.venue} ({venue.year})
              </li>
            ))}
          </ul>
        ) : (
          <p className="venue-add-form-no-venues">No venues added yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="venue-add-form-container">
        <div className="venue-add-form-group">
          <label htmlFor="venue">Venue Name:</label>
          <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} required />
        </div>

        <div className="venue-add-form-group">
          <label htmlFor="year">Year:</label>
          <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required min="1900" />
        </div>

        <div className="venue-add-form-group">
          <label htmlFor="url">URL:</label>
          <input type="url" id="url" name="url" value={formData.url} onChange={handleChange} />
        </div>

        <div className="venue-add-form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="venue-add-form-group">
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>

        <div className="venue-add-form-group">
          <label>View Access:</label>
          <div className="venue-add-form-checkbox-group">
            {users.map((user) => (
              <div key={user._id} className="venue-add-form-checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={formData.view.includes(user._id)}
                    onChange={handleCheckboxChange}
                  />
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="venue-add-form-submit-button">{selectedVenue ? "Update Venue" : "Add Venue"}</button>
        {selectedVenue && (
          <button type="button" className="venue-add-form-delete-button" onClick={handleDelete}>Delete Venue</button>
        )}
      </form>
    </div>
  );
};

export default VenueAddForm;
