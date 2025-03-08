import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/Venues/VenueAddForm.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faPlus, faEdit, faTrash, faSearch, faUser, faEnvelope, faCalendarAlt, faBell, faExclamationTriangle,
    faGlobe, faMapMarkerAlt,faClock, faLink
} from '@fortawesome/free-solid-svg-icons'; // Added icons

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
            <button className="venue-form-back-btn" onClick={() => navigate(-1)}>
               <FontAwesomeIcon icon={faArrowLeft} /> Go Back
            </button>
            <h2 className="venue-form-title">{selectedVenue ? "Edit Venue" : "Add Venue"}</h2>
            {message && <p className={message.startsWith("Venue added") ? "venue-form-message" : "venue-form-message error"}>{message}</p>}

            <form className="venue-form" onSubmit={handleSubmit}>
                <div className="venue-form-row">
                    <div className="venue-form-group">
                        <label htmlFor="venue"><FontAwesomeIcon icon={faCalendarAlt} /> Venue Name:</label>
                        <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} required />
                    </div>
                    <div className="venue-form-group">
                        <label htmlFor="year"><FontAwesomeIcon icon={faCalendarAlt} /> Year:</label>
                        <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} min="1900" />
                    </div>
                </div>

                <div className="venue-form-group">
                    <label htmlFor="url"><FontAwesomeIcon icon={faLink} /> URL:</label> {/* Added URL icon */}
                    <input type="url" id="url" name="url" value={formData.url} onChange={handleChange} />
                </div>

                <div className="venue-form-row">
                    <div className="venue-form-group">
                        <label htmlFor="date"><FontAwesomeIcon icon={faCalendarAlt} /> Date:</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="venue-form-group">
                        <label htmlFor="abstract_submission"><FontAwesomeIcon icon={faCalendarAlt} /> Abstract Submission:</label>
                        <input type="date" id="abstract_submission" name="abstract_submission" value={formData.abstract_submission} onChange={handleChange} />
                    </div>
                </div>

                <div className="venue-form-row">
                    <div className="venue-form-group">
                        <label htmlFor="paper_submission"><FontAwesomeIcon icon={faCalendarAlt} /> Paper Submission:</label>
                        <input type="date" id="paper_submission" name="paper_submission" value={formData.paper_submission} onChange={handleChange} />
                    </div>
                    <div className="venue-form-group">
                        <label htmlFor="author_response"><FontAwesomeIcon icon={faCalendarAlt} /> Author Response:</label>
                        <input type="date" id="author_response" name="author_response" value={formData.author_response} onChange={handleChange} />
                    </div>
                </div>

                <div className="venue-form-row">
                    <div className="venue-form-group">
                        <label htmlFor="meta_review"><FontAwesomeIcon icon={faCalendarAlt} /> Meta Review:</label>
                        <input type="date" id="meta_review" name="meta_review" value={formData.meta_review} onChange={handleChange} />
                    </div>
                    <div className="venue-form-group">
                        <label htmlFor="notification"><FontAwesomeIcon icon={faCalendarAlt} /> Notification:</label>
                        <input type="date" id="notification" name="notification" value={formData.notification} onChange={handleChange} />
                    </div>
                </div>

                <div className="venue-form-row">
                    <div className="venue-form-group">
                        <label htmlFor="commitment"><FontAwesomeIcon icon={faCalendarAlt} /> Commitment:</label>
                        <input type="date" id="commitment" name="commitment" value={formData.commitment} onChange={handleChange} />
                    </div>
                    <div className="venue-form-group">
                        <label htmlFor="main_conference_start"><FontAwesomeIcon icon={faCalendarAlt} /> Conference Start:</label>
                        <input type="date" id="main_conference_start" name="main_conference_start" value={formData.main_conference_start} onChange={handleChange} />
                    </div>
                </div>

                <div className="venue-form-row">
                    <div className="venue-form-group">
                        <label htmlFor="main_conference_end"><FontAwesomeIcon icon={faCalendarAlt} /> Conference End:</label>
                        <input type="date" id="main_conference_end" name="main_conference_end" value={formData.main_conference_end} onChange={handleChange} />
                    </div>
                    <div className="venue-form-group">
                        <label htmlFor="location"><FontAwesomeIcon icon={faMapMarkerAlt} /> Location:</label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                </div>

                <div className="venue-form-row">
                    <div className="venue-form-group">
                        <label htmlFor="time_zone"><FontAwesomeIcon icon={faClock} /> Time Zone:</label>  {/* Added timezone icon */}
                        <input type="text" id="time_zone" name="time_zone" value={formData.time_zone} onChange={handleChange} />
                    </div>
                    <div className="venue-form-group">
                         <label><FontAwesomeIcon icon={faUser} /> View Access:</label>
                        {/* Search Bar */}
                        <div className="venue-search-container">
                            <FontAwesomeIcon icon={faSearch} className="venue-search-icon" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="venue-search-input"
                            />
                        </div>

                         {/* Checkbox List */}
                        <div className="venue-form-checkbox-container">
                            {filteredUsers.map((userItem) => (
                                <label key={userItem._id} className="venue-form-checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={userItem._id}
                                        checked={formData.view.includes(userItem._id)}
                                        onChange={handleCheckboxChange}
                                        className="venue-access-checkbox"
                                    />
                                    {userItem.name} ({userItem.email})
                                </label>
                            ))}
                        </div>
                    </div>
               </div>
                <button type="submit" className="venue-form-submit-btn">
                    {selectedVenue ? <span><FontAwesomeIcon icon={faEdit} /> Update Venue</span> : <span><FontAwesomeIcon icon={faPlus} /> Add Venue</span>}
                </button>
            </form>
        </div>
    );
};

export default VenueAddForm;