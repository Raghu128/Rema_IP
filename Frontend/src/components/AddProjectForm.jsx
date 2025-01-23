import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    faculty_id: "",
    name: "",
    domain: "",
    sub_domain: "",
    creation_date: "",
    end_date: "",
    team: [],
    lead_author: "",
    status: "ongoing",
    venue: "",
    date_of_submission: "",
    next_deadline: "",
    remarks: "",
    paper_url: "",
    submission_url: ""
  });

  const [users, setUsers] = useState([]); // For faculty and student selection
  const [message, setMessage] = useState("");

  // Fetch users (faculty and students)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/users"); // Assume endpoint that returns all users
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users");
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

  // Handle team selection
  const handleTeamChange = (e) => {
    const selectedTeam = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({
      ...formData,
      team: selectedTeam,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/projects", formData); // Assume the endpoint for creating a project
      setMessage(`Project added successfully: ${response.data.name}`);
      // Reset form
      setFormData({
        faculty_id: "",
        name: "",
        domain: "",
        sub_domain: "",
        creation_date: "",
        end_date: "",
        team: [],
        lead_author: "",
        status: "ongoing",
        venue: "",
        date_of_submission: "",
        next_deadline: "",
        remarks: "",
        paper_url: "",
        submission_url: ""
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to add project");
    }
  };

  return (
    <div>
      <h2>Add Project</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Faculty ID */}
        <div>
          <label htmlFor="faculty_id">Faculty:</label>
          <select
            id="faculty_id"
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a Faculty</option>
            {users
              .filter((user) => user.role === "faculty") // Assuming role is available for filtering
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
        </div>

        {/* Project Name */}
        <div>
          <label htmlFor="name">Project Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Domain */}
        <div>
          <label htmlFor="domain">Domain:</label>
          <input
            type="text"
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
          />
        </div>

        {/* Sub-domain */}
        <div>
          <label htmlFor="sub_domain">Sub-domain:</label>
          <input
            type="text"
            id="sub_domain"
            name="sub_domain"
            value={formData.sub_domain}
            onChange={handleChange}
          />
        </div>

        {/* Creation Date */}
        <div>
          <label htmlFor="creation_date">Creation Date:</label>
          <input
            type="date"
            id="creation_date"
            name="creation_date"
            value={formData.creation_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Team */}
        <div>
          <label htmlFor="team">Team:</label>
          <select
            id="team"
            name="team"
            multiple
            value={formData.team}
            onChange={handleTeamChange}
            required
          >
            {users
              .filter((user) => user.role !== "faculty") // Filter out faculty members
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
        </div>

        {/* Lead Author */}
        <div>
          <label htmlFor="lead_author">Lead Author:</label>
          <select
            id="lead_author"
            name="lead_author"
            value={formData.lead_author}
            onChange={handleChange}
            required
          >
            <option value="">Select Lead Author</option>
            {users
              .filter((user) => user.role !== "faculty") // Filter out faculty members
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
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
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Venue */}
        <div>
          <label htmlFor="venue">Venue:</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        {/* Date of Submission */}
        <div>
          <label htmlFor="date_of_submission">Date of Submission:</label>
          <input
            type="date"
            id="date_of_submission"
            name="date_of_submission"
            value={formData.date_of_submission}
            onChange={handleChange}
          />
        </div>

        {/* Next Deadline */}
        <div>
          <label htmlFor="next_deadline">Next Deadline:</label>
          <input
            type="date"
            id="next_deadline"
            name="next_deadline"
            value={formData.next_deadline}
            onChange={handleChange}
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

        {/* Paper URL */}
        <div>
          <label htmlFor="paper_url">Paper URL:</label>
          <input
            type="url"
            id="paper_url"
            name="paper_url"
            value={formData.paper_url}
            onChange={handleChange}
          />
        </div>

        {/* Submission URL */}
        <div>
          <label htmlFor="submission_url">Submission URL:</label>
          <input
            type="url"
            id="submission_url"
            name="submission_url"
            value={formData.submission_url}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProjectForm;
