import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/AddOrEditProjectForm.css'; 
import { useNavigate } from "react-router-dom";

const UpdateProjectFormPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    faculty_id: user?.id || "",
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

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch projects for the logged-in user
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/v1/projects/${user.id}`);
        setProjects(response.data);
      } catch (error) {
        setMessage("Failed to fetch projects");
      }
    };

    if (user?.id) fetchProjects();
  }, [user]);

  // Fetch all users to populate the team members
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/user");
        setUsers(response.data);
      } catch (error) {
        setMessage("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  // Populate the form with selected project details
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamChange = (e) => {
    const { value, checked } = e.target;
    const updatedTeam = checked
      ? [...formData.team, value]
      : formData.team.filter((memberId) => memberId !== value);

    setFormData({ ...formData, team: updatedTeam });

    // Automatically set lead author to the first selected team member (if any)
    if (updatedTeam.length > 0 && !formData.lead_author) {
      setFormData({ ...formData, lead_author: updatedTeam[0] });
    }
  };

  useEffect(() => {
    if (user?.id) {
      setFormData((prevState) => ({
        ...prevState,
        faculty_id: user.id,
      }));
    }
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = selectedProject
        ? await axios.put(`/api/v1/projects/${selectedProject._id}`, formData)
        : await axios.post("/api/v1/projects", formData);

      setMessage(selectedProject ? "Project updated successfully" : "Project added successfully");

      const updatedProjects = selectedProject
        ? projects.map((proj) => (proj._id === response.data._id ? response.data : proj))
        : [...projects, response.data];

      setProjects(updatedProjects);
      resetForm();
      setSelectedProject(null); // Reset the selected project after submission
    } catch (error) {
      setMessage("Failed to save project");
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`/api/v1/projects/${projectId}`);
        setMessage("Project deleted successfully");
        setProjects((prevProjects) => prevProjects.filter((proj) => proj._id !== projectId));
        if (selectedProject && selectedProject._id === projectId) {
          setSelectedProject(null);
          resetForm();
        }
      } catch (error) {
        setMessage("Failed to delete project");
      }
    }
  };



  const resetForm = () => {
    setFormData({
      faculty_id: user?.id || "",
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

  const handleProjectSelect = (project) => {
    setSelectedProject(project); // Set the selected project to edit
  };

  return (
    <div className="editproject-container">
      <button onClick={() => navigate(-1)}>Go Back</button>
    <h2 className="editproject-title">{selectedProject ? "Edit Project" : "Add Project"}</h2>

    <div className="editproject-form-page">

      {message && <p className="editproject-message">{message}</p>}

      {/* Project Selection */}
      {!selectedProject && (
        <div >
          <h3>Select a project to edit</h3>
          <ul className="editproject-all-project">
            {projects.map((project) => (
              <li key={project._id}>
                <button type="button" onClick={() => handleProjectSelect(project)}>
                  {project.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="editproject-form">
        <label>Project Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Domain:</label>
        <input
          type="text"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          required
        />

        <label>Sub-domain:</label>
        <input
          type="text"
          name="sub_domain"
          value={formData.sub_domain}
          onChange={handleChange}
        />

        <label>Creation Date:</label>
        <input
          type="date"
          name="creation_date"
          value={formData.creation_date}
          onChange={handleChange}
        />

        <label>End Date:</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
        />

        <label>Venue:</label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
        />

        <label>Date of Submission:</label>
        <input
          type="date"
          name="date_of_submission"
          value={formData.date_of_submission}
          onChange={handleChange}
        />

        <label>Next Deadline:</label>
        <input
          type="date"
          name="next_deadline"
          value={formData.next_deadline}
          onChange={handleChange}
        />

        <label>Remarks:</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
        ></textarea>

        <label>Paper URL:</label>
        <input
          type="url"
          name="paper_url"
          value={formData.paper_url}
          onChange={handleChange}
        />

        <label>Submission URL:</label>
        <input
          type="url"
          name="submission_url"
          value={formData.submission_url}
          onChange={handleChange}
        />

        <label>Team Members:</label>
        <div className="editproject-team-checkbox" > 

        {users.map((userItem) => (
          <div  key={userItem._id}>
            <input
              type="checkbox"
              value={userItem._id}
              checked={formData.team.includes(userItem._id)}
              onChange={handleTeamChange}
            />
            {userItem.name} ({userItem.role})
          </div>
        ))}
        </div>

        <label>Lead Author:</label>
        <select
          name="lead_author"
          value={formData.lead_author}
          onChange={handleChange}
        >
          <option value="">Select Lead Author</option>
          {formData.team.map((teamMemberId) => {
            const teamMember = users.find(
              (userItem) => userItem._id === teamMemberId
            );
            return (
              <option key={teamMemberId} value={teamMemberId}>
                {teamMember?.name}
              </option>
            );
          })}
        </select>

        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button type="submit" className="editproject-submit">
          {selectedProject ? "Update Project" : "Add Project"}
        </button>
        {selectedProject && <button type="button" onClick={() => handleDelete(selectedProject._id)} className="editproject-reset">
          Delete
        </button>}
        <button type="button" onClick={resetForm} className="editproject-reset">
          Reset all value
        </button>
        
      </form>
    </div>
    </div>
  );
};

export default UpdateProjectFormPage;
