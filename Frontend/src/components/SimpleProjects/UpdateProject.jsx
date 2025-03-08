import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../styles/SimpleProject/AddOrEditProjectForm.css";
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

  // New state for searching project selection and team members
  const [projectSearch, setProjectSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if user is null
    }
  }, [user, navigate]);

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
        faculty_id: selectedProject.faculty_id._id || "",
        name: selectedProject.name || "",
        domain: selectedProject.domain || "",
        sub_domain: selectedProject.sub_domain || "",
        creation_date: selectedProject.creation_date?.split("T")[0] || "",
        end_date: selectedProject.end_date?.split("T")[0] || "",
        team: selectedProject.team.map((member) => member._id) || [],
        lead_author: selectedProject.lead_author?._id || "",
        status: selectedProject.status || "ongoing",
        venue: selectedProject.venue || "",
        date_of_submission: selectedProject.date_of_submission?.split("T")[0] || "",
        next_deadline: selectedProject.next_deadline?.split("T")[0] || "",
        remarks: selectedProject.remarks || "",
        paper_url: selectedProject.paper_url || "",
        submission_url: selectedProject.submission_url || "",
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

    // Automatically set lead author to the first selected team member if not already set
    if (updatedTeam.length > 0 && !formData.lead_author) {
      setFormData((prevData) => ({ ...prevData, lead_author: updatedTeam[0] }));
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

    const submitData = {
      ...formData,
      faculty_id: user.id,
      team: formData.team,
      lead_author: formData.lead_author,
    };

    try {
      const response = selectedProject
        ? await axios.put(`/api/v1/projects/${selectedProject._id}`, submitData)
        : await axios.post("/api/v1/projects", submitData);

      setMessage(selectedProject ? "Project updated successfully" : "Project added successfully");

      const updatedProjects = selectedProject
        ? projects.map((proj) => (proj._id === response.data._id ? response.data : proj))
        : [...projects, response.data];

      setProjects(updatedProjects);
      resetForm();
      setSelectedProject(null);
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
    setSelectedProject(project);
  };

  // Filter projects list for selection search
  const filteredProjectSelection = projects.filter((project) =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  // Filter users list for team checkboxes (view access)
  const filteredUsers = users.filter((userItem) =>
    userItem.name.toLowerCase().includes(teamSearch.toLowerCase())
  );

  return (
    <div className="editproject-container">
      <button onClick={() => navigate(-1)} className="go-back-btn">Go Back</button>
      <h2 className="editproject-title">{selectedProject ? "Edit Project" : "Add Project"}</h2>

      <div className="editproject-form-page">
        {message && <p className="editproject-message">{message}</p>}

        {/* Project Selection with search and scrollable container */}
        {!selectedProject && (
          <div className="project-selection">
            <h3>Select a project to edit</h3>
            <div className="project-search-box">
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="project-search-input"
              />
              {/* <button className="project-search-btn">Search</button> */}
            </div>
            <div className="project-list-scroll">
              <ul className="editproject-all-project">
                {filteredProjectSelection.map((project) => (
                  <li key={project._id}>
                    <button type="button" onClick={() => handleProjectSelect(project)}>
                      {project.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="editproject-form">
          {/* Form Row 1: Project Name */}
          <div className="form-row">
            <div className="form-group">
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
          </div>
          {/* Form Row 2: Domain & Sub-domain */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="domain">Domain:</label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sub_domain">Sub-domain:</label>
              <input
                type="text"
                id="sub_domain"
                name="sub_domain"
                value={formData.sub_domain}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Form Row 3: Creation & End Dates */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="creation_date">Creation Date:</label>
              <input
                type="date"
                id="creation_date"
                name="creation_date"
                value={formData.creation_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date:</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Form Row 4: Venue */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="venue">Venue:</label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Form Row 5: Date of Submission & Next Deadline */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date_of_submission">Date of Submission:</label>
              <input
                type="date"
                id="date_of_submission"
                name="date_of_submission"
                value={formData.date_of_submission}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="next_deadline">Next Deadline:</label>
              <input
                type="date"
                id="next_deadline"
                name="next_deadline"
                value={formData.next_deadline}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Form Row 6: Remarks */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="remarks">Remarks:</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          {/* Form Row 7: Paper URL & Submission URL */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paper_url">Paper URL:</label>
              <input
                type="url"
                id="paper_url"
                name="paper_url"
                value={formData.paper_url}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="submission_url">Submission URL:</label>
              <input
                type="url"
                id="submission_url"
                name="submission_url"
                value={formData.submission_url}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Form Row 8: Team Members & Lead Author */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Team Members:</label>
              <div className="team-search-box">
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="team-search-input"
                />
                {/* <button className="team-search-btn">Search</button> */}
              </div>
              <div className="editproject-team-checkbox scrollable">
                {filteredUsers.map((userItem) => (
                  <div key={userItem._id} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`teamMember_${userItem._id}`}
                      value={userItem._id}
                      checked={formData.team.includes(userItem._id)}
                      onChange={handleTeamChange}
                    />
                    <label htmlFor={`teamMember_${userItem._id}`}>
                      {userItem.name} ({userItem.role})
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="lead_author">Lead Author:</label>
              <select
                id="lead_author"
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
            </div>
          </div>
          {/* Form Row 9: Status */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="editproject-submit">
              {selectedProject ? "Update Project" : "Add Project"}
            </button>
            {selectedProject && (
              <button
                type="button"
                onClick={() => handleDelete(selectedProject._id)}
                className="editproject-reset"
              >
                Delete
              </button>
            )}
            <button type="button" onClick={resetForm} className="editproject-reset">
              Reset all values
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectFormPage;
