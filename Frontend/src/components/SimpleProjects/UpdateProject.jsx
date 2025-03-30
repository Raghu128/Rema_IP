import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faSave, faTrashAlt, faPlus, 
  faSearch, faUser, faCalendarAlt, faLink,
  faFileAlt, faMapMarkerAlt, faFlagCheckered,
  faUsers, faFlask, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import "../../styles/SimpleProject/AddOrEditProjectForm.css";

const UpdateProjectFormPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    faculty_id: user?.id || "",
    name: "",
    domain: "",
    sub_domain: "",
    creation_date: today,
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
  const [projectSearch, setProjectSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          axios.get(`/api/v1/projects/${user.id}`),
          axios.get(`/api/v1/user/${user?.id}`)
        ]);
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        setMessage("Failed to fetch data");
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        faculty_id: selectedProject.faculty_id._id || "",
        name: selectedProject.name || "",
        domain: selectedProject.domain || "",
        sub_domain: selectedProject.sub_domain || "",
        creation_date: selectedProject.creation_date?.split("T")[0] || today,
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
    }
  }, [selectedProject, today]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamChange = (e) => {
    const { value, checked } = e.target;
    const updatedTeam = checked
      ? [...formData.team, value]
      : formData.team.filter((memberId) => memberId !== value);

    setFormData({ 
      ...formData, 
      team: updatedTeam,
      lead_author: updatedTeam.length > 0 && !updatedTeam.includes(formData.lead_author) 
        ? updatedTeam[0] 
        : formData.lead_author
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure?")) return;

    try {
      const submitData = { ...formData, faculty_id: user.id };
      const response = selectedProject
        ? await axios.put(`/api/v1/projects/${selectedProject._id}`, submitData)
        : await axios.post("/api/v1/projects", submitData);

      setMessage(selectedProject ? "Project updated!" : "Project created!");
      setProjects(selectedProject
        ? projects.map(p => p._id === response.data._id ? response.data : p)
        : [...projects, response.data]
      );
      resetForm();
    } catch (error) {
      setMessage("Failed to save project");
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    
    try {
      await axios.delete(`/api/v1/projects/${projectId}`);
      setProjects(projects.filter(p => p._id !== projectId));
      if (selectedProject?._id === projectId) resetForm();
      setMessage("Project deleted");
    } catch (error) {
      setMessage("Failed to delete project");
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormData({
      faculty_id: user?.id || "",
      name: "",
      domain: "",
      sub_domain: "",
      creation_date: today,
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
    setProjectSearch("");
    setTeamSearch("");
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.domain.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(teamSearch.toLowerCase())
  );

  return (
    <div className="projectAddForm-container">
      <div className="projectAddForm-header">
        <button onClick={() => navigate(-1)} className="projectAddForm-back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h2 className="projectAddForm-title">
          {/* <FontAwesomeIcon icon={selectedProject ? faEdit : faPlus} /> */}
          {selectedProject ? "Edit Project" : "Create Project"}
        </h2>
      </div>

      {message && (
        <div className={`projectAddForm-message ${message.includes("Failed") ? "error" : "success"}`}>
          {message}
          <button onClick={() => setMessage("")} className="projectAddForm-message-close">&times;</button>
        </div>
      )}

      <div className="projectAddForm-layout">
        {/* Projects List Panel */}
        <div className="projectAddForm-projects-panel">
          <div className="projectAddForm-panel-header">
            <h3 className="projectAddForm-panel-title"><FontAwesomeIcon icon={faFileAlt} /> Your Projects</h3>
            <div className="projectAddForm-search-container">
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} className="projectAddForm-search-icon" />
            </div>
          </div>

          <div className="projectAddForm-projects-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div 
                  key={project._id}
                  className={`projectAddForm-project-item ${selectedProject?._id === project._id ? "active" : ""}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="projectAddForm-project-name">{project.name}</div>
                  <div className="projectAddForm-project-meta">
                    <span className={`projectAddForm-status-badge ${project.status}`}>
                      {project.status}
                    </span>
                    <span><FontAwesomeIcon icon={faFlask} /> {project.domain}</span>
                    {project.creation_date && (
                      <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(project.creation_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="projectAddForm-empty-state">
                <FontAwesomeIcon icon={faFileAlt} size="2x" className="projectAddForm-empty-icon" />
                <p>No projects found</p>
                {projectSearch && (
                  <button 
                    onClick={() => setProjectSearch("")}
                    className="projectAddForm-clear-search-button"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Form Panel */}
        <div className="projectAddForm-form-panel">
          <form onSubmit={handleSubmit} className="projectAddForm-form">
            {/* Basic Information Section */}
            <div className="projectAddForm-form-section">
              <div className="projectAddForm-section-header">
                <FontAwesomeIcon icon={faFileAlt} className="projectAddForm-section-icon" />
                <h3 className="projectAddForm-section-title">Basic Information</h3>
              </div>
              <div className="projectAddForm-form-grid">
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label"><FontAwesomeIcon icon={faFileAlt} /> Project Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="projectAddForm-input"
                  />
                </div>
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label"><FontAwesomeIcon icon={faFlask} /> Domain*</label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                    className="projectAddForm-input"
                  />
                </div>
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label"><FontAwesomeIcon icon={faLayerGroup} /> Sub-domain</label>
                  <input
                    type="text"
                    name="sub_domain"
                    value={formData.sub_domain}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label"><FontAwesomeIcon icon={faMapMarkerAlt} /> Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
              </div>
            </div>

            {/* Dates Section */}
            <div className="projectAddForm-form-section">
              <div className="projectAddForm-section-header">
                <FontAwesomeIcon icon={faCalendarAlt} className="projectAddForm-section-icon" />
                <h3 className="projectAddForm-section-title">Dates</h3>
              </div>
              <div className="projectAddForm-form-grid">
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label">Creation Date</label>
                  <input
                    type="date"
                    name="creation_date"
                    value={formData.creation_date}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label">Submission Date</label>
                  <input
                    type="date"
                    name="date_of_submission"
                    value={formData.date_of_submission}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label">Next Deadline</label>
                  <input
                    type="date"
                    name="next_deadline"
                    value={formData.next_deadline}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="projectAddForm-form-section">
              <div className="projectAddForm-section-header">
                <FontAwesomeIcon icon={faLink} className="projectAddForm-section-icon" />
                <h3 className="projectAddForm-section-title">Links</h3>
              </div>
              <div className="projectAddForm-form-grid">
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label">Paper URL</label>
                  <input
                    type="url"
                    name="paper_url"
                    value={formData.paper_url}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label">Submission URL</label>
                  <input
                    type="url"
                    name="submission_url"
                    value={formData.submission_url}
                    onChange={handleChange}
                    className="projectAddForm-input"
                  />
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="projectAddForm-form-section">
              <div className="projectAddForm-section-header">
                <FontAwesomeIcon icon={faUsers} className="projectAddForm-section-icon" />
                <h3 className="projectAddForm-section-title">Team</h3>
              </div>
              <div className="projectAddForm-form-group">
                <div className="projectAddForm-search-container">
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="projectAddForm-search-input"
                  />
                  <FontAwesomeIcon icon={faSearch} className="projectAddForm-search-icon" />
                </div>
                <div className="projectAddForm-team-members-list">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <label key={user._id} className="projectAddForm-team-member-checkbox">
                        <input
                          type="checkbox"
                          value={user._id}
                          checked={formData.team.includes(user._id)}
                          onChange={handleTeamChange}
                          className="projectAddForm-checkbox-input"
                        />
                        <span className="projectAddForm-checkmark"></span>
                        <span className="projectAddForm-member-name">{user.name}</span>
                        <span className="projectAddForm-member-role">{user.role}</span>
                      </label>
                    ))
                  ) : (
                    <>
                    <div className="projectAddForm-empty-state">
                      No members found
                    </div>
                    <button className="projectAddForm-add-new-user" onClick={() => navigate("/?tab=Add-User")}>Add user</button></>
                  )}
                </div>
              </div>
              <div className="projectAddForm-form-group">
                <label className="projectAddForm-label">Lead Author</label>
                <select
                  name="lead_author"
                  value={formData.lead_author}
                  onChange={handleChange}
                  disabled={formData.team.length === 0}
                  className="projectAddForm-select"
                >
                  <option value="">Select lead author</option>
                  {formData.team.map(memberId => {
                    const member = users.find(u => u._id === memberId);
                    return member ? (
                      <option key={memberId} value={memberId}>
                        {member.name}
                      </option>
                    ) : null;
                  })}
                </select>
              </div>
            </div>

            {/* Status & Remarks Section */}
            <div className="projectAddForm-form-section">
              <div className="projectAddForm-section-header">
                <FontAwesomeIcon icon={faFlagCheckered} className="projectAddForm-section-icon" />
                <h3 className="projectAddForm-section-title">Status & Remarks</h3>
              </div>
              <div className="projectAddForm-form-grid">
                <div className="projectAddForm-form-group">
                  <label className="projectAddForm-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="projectAddForm-select"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="projectAddForm-form-group projectAddForm-full-width">
                  <label className="projectAddForm-label">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="projectAddForm-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="projectAddForm-form-actions">
              <button type="submit" className="projectAddForm-submit-button">
                <FontAwesomeIcon icon={faSave} /> 
                {selectedProject ? "Update Project" : "Create Project"}
              </button>
              {selectedProject && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedProject._id)}
                  className="projectAddForm-delete-button"
                >
                  <FontAwesomeIcon icon={faTrashAlt} /> Delete
                </button>
              )}
              {selectedProject && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="projectAddForm-cancel-button"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectFormPage;