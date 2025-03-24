import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../styles/SimpleProject/AddOrEditProjectForm.css';
import { useNavigate } from "react-router-dom";

const AddOrEditProjectForm = ({ selectedProject, onProjectSaved, onCancel }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    faculty_id: user?.id || "",  // Use _id instead of id
    name: "",
    domain: "",
    sub_domain: "",
    creation_date: "",
    end_date: "",
    team: [],  // Only store user IDs
    lead_author: "",
    status: "ongoing",
    venue: "",
    date_of_submission: "",
    next_deadline: "",
    remarks: "",
    paper_url: "",
    submission_url: "",
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if user is null
    }
  }, [user, navigate]);

  // Prefill form for editing
  useEffect(() => {
    if (selectedProject) {
      setFormData({
        ...selectedProject,
        creation_date: selectedProject.creation_date?.split("T")[0] || "",
        end_date: selectedProject.end_date?.split("T")[0] || "",
        date_of_submission: selectedProject.date_of_submission?.split("T")[0] || "",
        next_deadline: selectedProject.next_deadline?.split("T")[0] || "",
      });
    } else {
      resetForm();
    }
  }, [selectedProject]);

  // Fetch users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  // Update faculty_id when user.id changes
  useEffect(() => {
    if (user?.id) {
      setFormData((prevState) => ({
        ...prevState,
        faculty_id: user.id,
      }));
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeamChange = (e) => {
    const { value, checked } = e.target;
    let updatedTeam;

    if (checked) {
      updatedTeam = [...formData.team, value];  // Store only the id of the member
    } else {
      updatedTeam = formData.team.filter((memberId) => memberId !== value);
    }

    setFormData({
      ...formData,
      team: updatedTeam,
    });

    // Automatically set lead author to the first selected team member (if any)
    if (updatedTeam.length > 0 && !formData.lead_author) {
      setFormData({
        ...formData,
        lead_author: updatedTeam[0],  // Set lead author to the first selected team member id
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the formData to verify the faculty_id
    
    try {
      let response;
      if (selectedProject) {
        response = await axios.put(`/api/v1/projects/${selectedProject._id}`, formData);
        setMessage(`Project updated successfully: ${response.data.name}`);
      } else {
        response = await axios.post("/api/v1/projects", formData);
        setMessage(`Project added successfully: ${response.data.name}`);
      }

      onProjectSaved(response.data);
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save project");
    }
  };

  const resetForm = () => {
    setFormData({
      faculty_id: user?.id || "",  // Use _id here as well
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
      submission_url: "",
    });
    setMessage("");
  };

  return (
    <div className="addprojectform">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="addprojectform__heading">{selectedProject ? "Edit Project" : "Add Project"}</h2>
      {message && <p className="addprojectform__message">{message}</p>}
      <form className="addprojectform__form" onSubmit={handleSubmit}>
        {/* Project Name */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="name">Project Name:</label>
          <input
            className="addprojectform__input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Domain */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="domain">Domain:</label>
          <input
            className="addprojectform__input"
            type="text"
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sub-domain */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="sub_domain">Sub-domain:</label>
          <input
            className="addprojectform__input"
            type="text"
            id="sub_domain"
            name="sub_domain"
            value={formData.sub_domain}
            onChange={handleChange}
          />
        </div>

        {/* Creation Date */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="creation_date">Creation Date:</label>
          <input
            className="addprojectform__input"
            type="date"
            id="creation_date"
            name="creation_date"
            value={formData.creation_date}
            onChange={handleChange}
          />
        </div>

        {/* End Date */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="end_date">End Date:</label>
          <input
            className="addprojectform__input"
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>

        {/* Venue */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="venue">Venue:</label>
          <input
            className="addprojectform__input"
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        {/* Date of Submission */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="date_of_submission">Date of Submission:</label>
          <input
            className="addprojectform__input"
            type="date"
            id="date_of_submission"
            name="date_of_submission"
            value={formData.date_of_submission}
            onChange={handleChange}
          />
        </div>

        {/* Next Deadline */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="next_deadline">Next Deadline:</label>
          <input
            className="addprojectform__input"
            type="date"
            id="next_deadline"
            name="next_deadline"
            value={formData.next_deadline}
            onChange={handleChange}
          />
        </div>

        {/* Paper URL */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="paper_url">Paper URL:</label>
          <input
            className="addprojectform__input"
            type="url"
            id="paper_url"
            name="paper_url"
            value={formData.paper_url}
            onChange={handleChange}
          />
        </div>

        {/* Submission URL */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="submission_url">Submission URL:</label>
          <input
            className="addprojectform__input"
            type="url"
            id="submission_url"
            name="submission_url"
            value={formData.submission_url}
            onChange={handleChange}
          />
        </div>

        {/* Team Selection */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="team">Team Members:</label>
          <div className="addprojectform__checkbox-group">
            {users
              .filter((u) => u._id !== user?.id && u.role !== "admin")
              .map((userItem) => (
                <div className="addprojectform__checkbox-item" key={userItem._id}>
                  <input
                    className="addprojectform__checkbox"
                    type="checkbox"
                    id={`team-${userItem._id}`}
                    name="team"
                    value={userItem._id}  // Store only the user ID
                    checked={formData.team.includes(userItem._id)}
                    onChange={handleTeamChange}
                  />
                  <label className="addprojectform__checkbox-label" htmlFor={`team-${userItem._id}`}>
                    {userItem.name} ({userItem.role}, {userItem.email})
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* Lead Author Selection */}
        <div className="addprojectform__form-group">
          <label className="addprojectform__label" htmlFor="lead_author">Lead Author:</label>
          <select
            className="addprojectform__select"
            id="lead_author"
            name="lead_author"
            value={formData.lead_author}
            onChange={handleChange}
          >
            <option value="">Select Lead Author</option>
            {formData.team.map((memberId) => {
              const member = users.find((u) => u._id === memberId);
              return (
                <option key={memberId} value={memberId}>
                  {member?.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="addprojectform__form-actions">
          <button className="addprojectform__submit" type="submit">
             {"Add Project"}
          </button>
          <button className="addprojectform__cancel" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditProjectForm;