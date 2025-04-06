import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit, faSearch, faUserGraduate, faUserTie,
    faBookOpen, faFilter, faTable, faThLarge,
    faRupeeSign, faChevronUp, faUsers, faPlus,
    faChartBar, faUserCircle, faGraduationCap,
    faChalkboardTeacher, faUniversity, faLaptopCode,faChevronDown, faUserShield
} from '@fortawesome/free-solid-svg-icons';
import "../../styles/Student/Student.css";

const Students = ({ id }) => {
    const [supervisorData, setSupervisorData] = useState(null);
    const [filteredSupervisorData, setFilteredSupervisorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [viewMode, setViewMode] = useState('table');
    const [stats, setStats] = useState({
        total: 0,
        btech: 0,
        mtech: 0,
        phd: 0,
        faculty: 0,
        intern: 0,
        projectstaff: 0
    });
    const navigate = useNavigate();

    const [expandedProjects, setExpandedProjects] = useState({});

    const toggleProjectExpansion = (studentId, projectIndex) => {
        setExpandedProjects(prev => ({
            ...prev,
            [`${studentId}-${projectIndex}`]: !prev[`${studentId}-${projectIndex}`]
        }));
    };
    

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/supervisors/${id}`);
                const supervisors = response.data;

                const roleBasedStudents = {};
                let stats = {
                    total: 0,
                    btech: 0,
                    mtech: 0,
                    phd: 0,
                    faculty: 0,
                    intern: 0,
                    projectstaff: 0
                };

                supervisors.forEach((supervisor) => {
                    const student = supervisor.student_id;
                    const role = student.role || "Unknown Role";

                    if (!roleBasedStudents[role]) {
                        roleBasedStudents[role] = {};
                    }
                    if (!roleBasedStudents[role][student._id]) {
                        roleBasedStudents[role][student._id] = {
                            id: student._id,
                            name: student.name,
                            role: student.role,
                            email: student.email,
                            projects: [],
                            
                        };
                        stats.total++;
                        if (role in stats) stats[role]++;
                    }
                    roleBasedStudents[role][student._id].projects.push({
                        thesis_title: supervisor.thesis_title,
                        stipend: supervisor.stipend && supervisor.stipend.$numberDecimal
                            ? parseFloat(supervisor.stipend.$numberDecimal).toFixed(2)
                            : null,
                        committee: supervisor.committee || [],
                        joining: supervisor.joining,
                        status: supervisor.status || 'Active',
                        workingProjects: supervisor.student_id.projects
                    });
                });

                const roleBasedStudentsArray = {};
                Object.keys(roleBasedStudents).forEach((role) => {
                    roleBasedStudentsArray[role] = Object.values(roleBasedStudents[role]);
                });

                setSupervisorData(roleBasedStudentsArray);
                setFilteredSupervisorData(roleBasedStudentsArray);
                setStats(stats);
            } catch (err) {
                console.error("Error fetching supervisors:", err);
                setError("Error fetching supervisor data from backend");
            } finally {
                setLoading(false);
            }
        };

        fetchSupervisors();
    }, [id]);

    useEffect(() => {
        if (supervisorData) {
            let filteredData = {};
            Object.keys(supervisorData).forEach((role) => {
                if (selectedRole === "all" || role === selectedRole) {
                    const filteredStudents = supervisorData[role].filter((student) =>
                        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.projects.some(proj =>
                            proj.thesis_title.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    );
                    if (filteredStudents.length > 0) {
                        filteredData[role] = filteredStudents;
                    }
                }
            });
            setFilteredSupervisorData(filteredData);
        }
    }, [searchQuery, supervisorData, selectedRole]);

    const getRoleIcon = (role) => {
        switch (role) {
            case 'btech': return <FontAwesomeIcon icon={faGraduationCap} />;
            case 'mtech': return <FontAwesomeIcon icon={faUserGraduate} />;
            case 'phd': return <FontAwesomeIcon icon={faUserTie} />;
            case 'faculty': return <FontAwesomeIcon icon={faChalkboardTeacher} />;
            default: return <FontAwesomeIcon icon={faUserCircle} />;
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'btech': return 'B.Tech Students';
            case 'mtech': return 'M.Tech Students';
            case 'phd': return 'PhD Scholars';
            case 'faculty': return 'Faculty Members';
            default: return `${role.charAt(0).toUpperCase() + role.slice(1)} Students`;
        }
    };

    const getStatusBadge = (status) => {
        let className = "status-badge ";
        switch (status.toLowerCase()) {
            case 'active': className += "active"; break;
            case 'completed': className += "completed"; break;
            case 'graduated': className += "graduated"; break;
            default: className += "inactive";
        }
        return <span className={className}>{status}</span>;
    };

    const renderCommittee = (committee) => {
        if (!committee || committee.length === 0) {
            return <span className="no-committee">No committee members</span>;
        }

        return (
            <div className="committee-members">
                <div className="committee-icon-container">
                    <FontAwesomeIcon icon={faUsers} className="committee-icon" />
                    <span>{committee.length} members</span>
                </div>
                <div className="committee-tooltip">
                    <ul>
                        {committee.map((member, idx) => (
                            <li key={idx}>
                                <strong>{member.name}</strong> ({member.role || 'Member'})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };
    const ProjectDropdown = ({ projects }) => {
        if (!projects || projects.length === 0) {
          return <span className="working-pro-no-projects">No projects</span>;
        }
      
        return (
          <div className="working-pro-hover-container">
            <div className="working-pro-hover-trigger">
              <FontAwesomeIcon icon={faBookOpen} />
              <span>{projects.length}</span>
            </div>
            <div className="working-pro-hover-content">
              {projects.map((project, index) => (
                <div key={index} className="working-pro-hover-item" onClick={() => navigate(`/?tab=Projects&search=${project.name}`)}>
                  {project.name || "Untitled Project"}
                </div>
              ))}
            </div>
          </div>
        );
      };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;


    return (
        <div className="student-container">
            <div className="student-header">
                <div className="student-header-left">
                    <h1 className="student-title">
                        <FontAwesomeIcon icon={faUniversity} className="student-title-icon" />
                        Student Supervision
                    </h1>
                    <div className="student-stats-container">
                        <div className="student-stat-card student-total">
                            <FontAwesomeIcon icon={faChartBar} className="student-stat-icon" />
                            <div className="student-stat-content">
                                <span className="student-stat-number">{stats.total}</span>
                                <span className="student-stat-label">Total</span>
                            </div>
                        </div>
                        <div className="student-stat-card student-btech">
                            <FontAwesomeIcon icon={faGraduationCap} className="student-stat-icon" />
                            <div className="student-stat-content">
                                <span className="student-stat-number">{stats.btech}</span>
                                <span className="student-stat-label">B.Tech</span>
                            </div>
                        </div>
                        <div className="student-stat-card student-mtech">
                            <FontAwesomeIcon icon={faUserGraduate} className="student-stat-icon" />
                            <div className="student-stat-content">
                                <span className="student-stat-number">{stats.mtech}</span>
                                <span className="student-stat-label">M.Tech</span>
                            </div>
                        </div>
                        <div className="student-stat-card student-phd">
                            <FontAwesomeIcon icon={faUserTie} className="student-stat-icon" />
                            <div className="student-stat-content">
                                <span className="student-stat-number">{stats.phd}</span>
                                <span className="student-stat-label">PhD</span>
                            </div>
                        </div>
                        <div className="student-stat-card student-faculty">
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="student-stat-icon" />
                            <div className="student-stat-content">
                                <span className="student-stat-number">{stats.faculty}</span>
                                <span className="student-stat-label">Faculty</span>
                            </div>
                        </div>
                        <div className="student-stat-card student-intern">
                            <FontAwesomeIcon icon={faLaptopCode} className="student-stat-icon" />
                            <div className="student-stat-content">
                                <span className="student-stat-number">{stats.intern}</span>
                                <span className="student-stat-label">Interns</span>
                            </div>
                        </div>
                        <div className="student-stat-card student-projectstaff">
                            <FontAwesomeIcon icon={faUserShield} className="student-stat-icon" />
                            <div className="student-stat-content">
                                <span className="student-stat-number">{stats.projectstaff}</span>
                                <span className="student-stat-label">Staff</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="student-actions">
                    <div className="student-view-toggle-group">
                        <button
                            className={`student-view-toggle ${viewMode === 'cards' ? 'student-active' : ''}`}
                            onClick={() => setViewMode('cards')}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Cards
                        </button>
                        <button
                            className={`student-view-toggle ${viewMode === 'table' ? 'student-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FontAwesomeIcon icon={faTable} /> Table
                        </button>
                    </div>
                    <button
                        onClick={() => navigate("/update-supervisor")}
                        className="student-add-button"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </div>

            <div className="student-controls">
                <div className="student-search-container">
                    <FontAwesomeIcon icon={faSearch} className="student-search-icon" />
                    <input
                        type="text"
                        placeholder="Search students by name, email, or thesis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="student-search-input"
                    />
                </div>
                <div className="student-filter-container">
                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="role-select"
                    >
                        <option value="all">All Roles</option>
                        {supervisorData && Object.keys(supervisorData).map((role) => (
                            <option key={role} value={role}>
                                {getRoleLabel(role)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredSupervisorData && Object.keys(filteredSupervisorData).length === 0 ? (
                <div className="no-results">
                    <div className="no-results-content">
                        <FontAwesomeIcon icon={faUserGraduate} className="no-results-icon" />
                        <h3>No students found</h3>
                        <p>Try adjusting your search or add a new student</p>
                        <button
                            className="add-student-button"
                            onClick={() => navigate("/update-supervisor")}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Student
                        </button>
                    </div>
                </div>
            ) : viewMode === 'cards' ? (
                <div className="student-cards-container">
                    {Object.keys(filteredSupervisorData).map((role) => (
                        <div key={role} className="role-section">
                            <h2 className="role-title">
                                <span className="role-icon">{getRoleIcon(role)}</span>
                                <span className="role-label">{getRoleLabel(role)}</span>
                                <span className="role-count">{filteredSupervisorData[role].length}</span>
                            </h2>
                            <div className="student-cards-grid">
                                {filteredSupervisorData[role].map((student) => (
                                    <div key={student.id} className="student-card">
                                        <div className="student-header">
                                            <div className="student-avatar">
                                                {getRoleIcon(student.role)}
                                            </div>
                                            <div className="student-info">
                                                <h3 className="student-name">{student.name}</h3>
                                                <p className="student-email">{student.email}</p>
                                                <div className="student-meta">
                                                    <span className="student-role">
                                                        {getRoleLabel(student.role).replace('Students', '').replace('Scholars', '').trim()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="student-projects">
                                            <h4 className="projects-title">Title</h4>
                                            {student.projects.map((proj, index) => (
                                                <div key={index} className="student-project-item">
                                                    <div className="student-project-header">
                                                        <h5 className="student-project-title">
                                                            <FontAwesomeIcon icon={faBookOpen} />
                                                            <span>{proj.thesis_title}</span>
                                                        </h5>
                                                        <div className="student-project-meta">
                                                            {proj.stipend && (
                                                                <div className="student-project-stipend">
                                                                    <FontAwesomeIcon icon={faRupeeSign} />
                                                                    <span>{proj.stipend}</span>
                                                                </div>
                                                            )}
                                                            {getStatusBadge(proj.status)}
                                                        </div>
                                                    </div>
                                                    <div className="student-project-details">
                                                        <div className="student-project-date">
                                                            <span>Started: {formatDate(proj.joining)}</span>
                                                        </div>
                                                        <div className="student-project-committee">
                                                            {renderCommittee(proj.committee)}
                                                        </div>
                                                    </div>
                                                    <div className="student-project-working-projects">
    <ProjectDropdown projects={proj.workingProjects} />
  </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                    ))}
                </div>
            ) : (
                <div className="student-table-container">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Role</th>
                                <th>Projects</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Stipend</th>
                                <th>Committee</th>
                                <th>Start Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(filteredSupervisorData).map((role) => (
                                filteredSupervisorData[role].map((student) => (
                                    student.projects.map((proj, index) => (
                                        <tr key={`${student.id}-${index}`} className="student-row">
                                            {index === 0 ? (
                                                <>
                                                    <td className="student-cell" rowSpan={student.projects.length}>
                                                        <div className="student-info-table">
                                                            <div className="student-avatar-table">
                                                                {getRoleIcon(student.role)}
                                                            </div>
                                                            <div>
                                                                <div className="student-name-table">{student.name}</div>
                                                                <div className="student-email-table">{student.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    <td className="role-cell" rowSpan={student.projects.length}>
                                                        <div className="role-badge">
                                                            {getRoleIcon(student.role)}
                                                            <span>{getRoleLabel(student.role).replace('Students', '').replace('Scholars', '').trim()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="projects-cell">
  <ProjectDropdown projects={student.projects.flatMap(p => p.workingProjects)} />
</td>
                                                   
                                                </>
                                            ) : null}
                                            <td className="student-project-cell">
                                                <div className="student-project-title-table">
                                                    <FontAwesomeIcon icon={faBookOpen} />
                                                    <span>{proj.thesis_title}</span>
                                                </div>
                                            </td>
                                            
                                            <td className="status-cell">
                                                {getStatusBadge(proj.status)}
                                            </td>
                                            <td className="stipend-cell">
                                                {proj.stipend ? (
                                                    <div className="stipend-amount-table">
                                                        <FontAwesomeIcon icon={faRupeeSign} />
                                                        <span>{proj.stipend}</span>
                                                    </div>
                                                ) : 'N/A'}
                                            </td>
                                            <td className="committee-cell">
                                                {renderCommittee(proj.committee)}
                                            </td>
                                            <td className="date-cell">
                                                {formatDate(proj.joining)}
                                            </td>
                                        </tr>
                                    ))
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Students;