import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faPlus, faEdit, faTrash, faSearch, 
  faUser, faCalendarAlt, faMapMarkerAlt, faClock, faLink
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Venues/VenueAddForm.css';

const VenueAddForm = () => {
    const { user } = useSelector((state) => state.user);
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(""); // For searching users

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
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/v1/user/${user?.id}`);
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

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            added_by: user?.id,
        }));
    }, [user]);

     const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            view: checked
                ? [...prevState.view, value]
                : prevState.view.filter((id) => id !== value),
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            handleCheckboxChange(e); // Delegate to handleCheckboxChange
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
     // Filter users based on search query
    const filteredUsers = users.filter((userItem) =>
        userItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="venue-form-container">
          <div className="venue-form-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
            <h2 className="form-title">
              {selectedVenue ? "Edit Conference Venue" : "Add New Conference Venue"}
            </h2>
          </div>
    
          {message && (
            <div className={`alert-message ${message.startsWith("Venue added") ? "success" : "error"}`}>
              {message}
            </div>
          )}
    
          <form className="venue-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Basic Information</span>
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Venue Name*</span>
                  </label>
                  <input 
                    type="text" 
                    name="venue" 
                    value={formData.venue} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., ACM Conference" 
                  />
                </div>
    
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Year</span>
                  </label>
                  <input 
                    type="number" 
                    name="year" 
                    value={formData.year} 
                    onChange={handleChange} 
                    min="1900" 
                    placeholder="2023" 
                  />
                </div>
    
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faLink} />
                    <span>Website URL</span>
                  </label>
                  <input 
                    type="url" 
                    name="url" 
                    value={formData.url} 
                    onChange={handleChange} 
                    placeholder="https://conference.example.com" 
                  />
                </div>
    
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Location</span>
                  </label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="City, Country" 
                  />
                </div>
    
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faClock} />
                    <span>Time Zone</span>
                  </label>
                  <input 
                    type="text" 
                    name="time_zone" 
                    value={formData.time_zone} 
                    onChange={handleChange} 
                    placeholder="UTC+5:30" 
                  />
                </div>
              </div>
            </div>
    
            <div className="form-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Important Dates</span>
              </h3>
              <div className="date-grid">
                <div className="date-group">
                  <label>Event Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Abstract Submission</label>
                  <input 
                    type="date" 
                    name="abstract_submission" 
                    value={formData.abstract_submission} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Paper Submission</label>
                  <input 
                    type="date" 
                    name="paper_submission" 
                    value={formData.paper_submission} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Author Response</label>
                  <input 
                    type="date" 
                    name="author_response" 
                    value={formData.author_response} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Meta Review</label>
                  <input 
                    type="date" 
                    name="meta_review" 
                    value={formData.meta_review} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Notification</label>
                  <input 
                    type="date" 
                    name="notification" 
                    value={formData.notification} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Commitment</label>
                  <input 
                    type="date" 
                    name="commitment" 
                    value={formData.commitment} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Conference Start</label>
                  <input 
                    type="date" 
                    name="main_conference_start" 
                    value={formData.main_conference_start} 
                    onChange={handleChange} 
                  />
                </div>
    
                <div className="date-group">
                  <label>Conference End</label>
                  <input 
                    type="date" 
                    name="main_conference_end" 
                    value={formData.main_conference_end} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
    
            <div className="form-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faUser} />
                <span>Access Control</span>
              </h3>
              <div className="form-group">
                <div className="search-container">
                  <FontAwesomeIcon icon={faSearch} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="checkbox-container">
                  {filteredUsers.map((userItem) => (
                    <label key={userItem._id} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={userItem._id}
                        checked={formData.view.includes(userItem._id)}
                        onChange={handleCheckboxChange}
                      />
                      <div className="checkmark"></div>
                      <span className="user-info">
                        <span className="user-name">{userItem.name}</span>
                        <span className="user-email">{userItem.email}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
    
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {selectedVenue ? (
                  <>
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Update Venue</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add Venue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      );

};

export default VenueAddForm;