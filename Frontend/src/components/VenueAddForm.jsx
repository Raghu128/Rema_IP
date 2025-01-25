import React, { useState, useEffect } from "react";
import axios from "axios";

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
    view:[]
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all users for the 'added_by' field
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/users"); // Fetch users from API
        setUsers(response.data);

        
        
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Handle input changes
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
        ? [...prevState.view, value] // Add user ID if checked
        : prevState.view.filter((id) => id !== value); // Remove user ID if unchecked
      return { ...prevState, view: updatedView };
    });
  };



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/venues", formData);
      setMessage(`Venue added successfully: ${response.data.venue}`);
      // Reset form
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
      });
    } catch (error) {
      console.error("Error adding venue:", error);
      setMessage(error.response?.data?.message || "Failed to add venue.");
    }
  };

  





  return (
    <div>
      <h2>Add Venue</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Venue Name */}
        <div>
          <label htmlFor="venue">Venue Name:</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1900"
          />
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
          />
        </div>

        {/* Added By */}
        <div>
          <label htmlFor="added_by">Added By:</label>
          <select
            id="added_by"
            name="added_by"
            value={formData.added_by}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* Abstract Submission */}
        <div>
          <label htmlFor="abstract_submission">Abstract Submission:</label>
          <input
            type="date"
            id="abstract_submission"
            name="abstract_submission"
            value={formData.abstract_submission}
            onChange={handleChange}
          />
        </div>

        {/* Paper Submission */}
        <div>
          <label htmlFor="paper_submission">Paper Submission:</label>
          <input
            type="date"
            id="paper_submission"
            name="paper_submission"
            value={formData.paper_submission}
            onChange={handleChange}
          />
        </div>

        {/* Author Response */}
        <div>
          <label htmlFor="author_response">Author Response:</label>
          <input
            type="date"
            id="author_response"
            name="author_response"
            value={formData.author_response}
            onChange={handleChange}
          />
        </div>

        {/* Meta Review */}
        <div>
          <label htmlFor="meta_review">Meta Review:</label>
          <input
            type="date"
            id="meta_review"
            name="meta_review"
            value={formData.meta_review}
            onChange={handleChange}
          />
        </div>

        {/* Notification */}
        <div>
          <label htmlFor="notification">Notification:</label>
          <input
            type="date"
            id="notification"
            name="notification"
            value={formData.notification}
            onChange={handleChange}
          />
        </div>

        {/* Commitment */}
        <div>
          <label htmlFor="commitment">Commitment:</label>
          <input
            type="date"
            id="commitment"
            name="commitment"
            value={formData.commitment}
            onChange={handleChange}
          />
        </div>

        {/* Main Conference Start */}
        <div>
          <label htmlFor="main_conference_start">Main Conference Start:</label>
          <input
            type="date"
            id="main_conference_start"
            name="main_conference_start"
            value={formData.main_conference_start}
            onChange={handleChange}
          />
        </div>

        {/* Main Conference End */}
        <div>
          <label htmlFor="main_conference_end">Main Conference End:</label>
          <input
            type="date"
            id="main_conference_end"
            name="main_conference_end"
            value={formData.main_conference_end}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>View Access:</label>
          <div>
            {users.map((user) => (
              <div key={user._id}>
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

        {/* Location */}
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Time Zone */}
        <div>
          <label htmlFor="time_zone">Time Zone:</label>
          <input
            type="text"
            id="time_zone"
            name="time_zone"
            value={formData.time_zone}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Add Venue</button>
      </form>
    </div>
  );
};

export default VenueAddForm;



