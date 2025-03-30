import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faSearch, faUserGraduate, faUserTie, 
  faBookOpen, faFilter, faTable, faThLarge,
  faRupeeSign, faIdCard, faUsers
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
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/supervisors/${id}`);
                const supervisors = response.data;

                const roleBasedStudents = {};
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
                    }
                    roleBasedStudents[role][student._id].projects.push({
                        thesis_title: supervisor.thesis_title,
                        stipend: supervisor.stipend && supervisor.stipend.$numberDecimal
                            ? parseFloat(supervisor.stipend.$numberDecimal).toFixed(2)
                            : null,
                        committee: supervisor.committee || [],
                    });
                });

                const roleBasedStudentsArray = {};
                Object.keys(roleBasedStudents).forEach((role) => {
                    roleBasedStudentsArray[role] = Object.values(roleBasedStudents[role]);
                });

                setSupervisorData(roleBasedStudentsArray);
                setFilteredSupervisorData(roleBasedStudentsArray);
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
                        student.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            case 'btech': return <FontAwesomeIcon icon={faUserGraduate} />;
            case 'mtech': return <FontAwesomeIcon icon={faUserGraduate} />;
            case 'phd': return <FontAwesomeIcon icon={faUserTie} />;
            case 'faculty': return <FontAwesomeIcon icon={faUserTie} />;
            default: return <FontAwesomeIcon icon={faIdCard} />;
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'btech': return 'B.Tech Students';
            case 'mtech': return 'M.Tech Students';
            case 'phd': return 'PhD Scholars';
            case 'faculty': return 'Faculty';
            default: return `${role.charAt(0).toUpperCase() + role.slice(1)} Students`;
        }
    };

    const renderCommittee = (committee) => {
        if (!committee || committee.length === 0) {
            return <span className="no-committee">No committee members</span>;
        }
        
        return (
            <div className="committee-members">
                <FontAwesomeIcon icon={faUsers} className="committee-icon" />
                <ul>
                    {committee.map((member, idx) => (
                        <li key={idx}>
                            {member.name} ({member.email || member.role})
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="student-container">
            <div className="student-header">
                <h1 className="student-title">Students</h1>
                <div className="student-actions">
                    <button 
                        className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
                        onClick={() => setViewMode('cards')}
                    >
                        <FontAwesomeIcon icon={faThLarge} /> Cards
                    </button>
                    <button 
                        className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        <FontAwesomeIcon icon={faTable} /> Table
                    </button>
                    <button 
                        onClick={() => navigate("/update-supervisor")} 
                        className="edit-button"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </div>

            <div className="student-controls">
                <div className="search-container">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-container">
                    <FontAwesomeIcon icon={faFilter} />
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
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
                    No students found matching your criteria
                </div>
            ) : viewMode === 'cards' ? (
                <div className="student-cards-container">
                    {Object.keys(filteredSupervisorData).map((role) => (
                        <div key={role} className="role-section">
                            <h2 className="role-title">
                                {getRoleIcon(role)}
                                <span>{getRoleLabel(role)}</span>
                            </h2>
                            <div className="student-cards">
                                {filteredSupervisorData[role].map((student) => (
                                    <div key={student.id} className="student-card">
                                        <div className="student-info">
                                            <h3>{student.name}</h3>
                                            <p className="student-email">{student.email}</p>
                                        </div>
                                        <div className="student-projects">
                                            {student.projects.map((proj, index) => (
                                                <div key={index} className="project-item">
                                                    <div className="project-header">
                                                        <h4>
                                                            <FontAwesomeIcon icon={faBookOpen} />
                                                            {proj.thesis_title}
                                                        </h4>
                                                        {proj.stipend && (
                                                            <div className="project-stipend">
                                                                <FontAwesomeIcon icon={faRupeeSign} />
                                                                <span>{proj.stipend}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="project-committee">
                                                        {renderCommittee(proj.committee)}
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Project/Thesis</th>
                                <th>Stipend</th>
                                <th>Committee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(filteredSupervisorData).map((role) => (
                                filteredSupervisorData[role].map((student) => (
                                    student.projects.map((proj, index) => (
                                        <tr key={`${student.id}-${index}`}>
                                            {index === 0 ? (
                                                <>
                                                    <td rowSpan={student.projects.length}>{student.name}</td>
                                                    <td rowSpan={student.projects.length}>{student.email}</td>
                                                    <td rowSpan={student.projects.length}>
                                                        <span className="role-badge">
                                                            {getRoleIcon(role)}
                                                            {getRoleLabel(role)}
                                                        </span>
                                                    </td>
                                                </>
                                            ) : null}
                                            <td>
                                                <div className="project-title">
                                                    <FontAwesomeIcon icon={faBookOpen} />
                                                    <span>{proj.thesis_title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {proj.stipend ? (
                                                    <div className="stipend-amount">
                                                        <FontAwesomeIcon icon={faRupeeSign} />
                                                        <span>{proj.stipend}</span>
                                                    </div>
                                                ) : 'N/A'}
                                            </td>
                                            <td>
                                                {renderCommittee(proj.committee)}
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