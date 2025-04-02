import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUserGraduate, 
  faFileAlt,
  faTable,
  faThLarge,
  faClock,
  faSearch,
  faChevronDown,
  faChevronUp,
  faUserCircle,
  faEnvelope,
  faListAlt
} from '@fortawesome/free-solid-svg-icons';
import "../../styles/Leaves/LeavesForFacultyPage.css";

const LeavesForFacultyPage = () => {
    const { user } = useSelector((state) => state.user);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState('table');
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalLeaves: 0,
        avgLeaveDuration: 0
    });
    

    useEffect(() => {
        const fetchLeaves = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/leaves/faculty/${user?.id}`);                
                setLeaves(response.data);
                
                // Calculate statistics
                const grouped = response.data.reduce((acc, leave) => {
                    
                    const studentId = leave.user_id?._id || "unknown";
                    if (!acc[studentId]) {
                        acc[studentId] = { leaves: [] };
                    }
                    acc[studentId].leaves.push(leave);
                    return acc;
                }, {});
                
                const totalStudents = Object.keys(grouped).length;
                const totalLeaves = response.data.length;
                const totalDays = response.data.reduce((sum, leave) => {
                    return sum + calculateLeaveDays(leave.from, leave.to);
                }, 0);
                
                setStats({
                    totalStudents,
                    totalLeaves,
                    avgLeaveDuration: totalLeaves > 0 ? Math.round(totalDays / totalLeaves) : 0
                });
            } catch (err) {
                console.error(err);
                setError("Failed to fetch leaves.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchLeaves();
        } else {
            setLoading(false);
        }
    }, [user]);

    const groupedLeaves = leaves.reduce((acc, leave) => {
        const studentId = leave.user_id?._id || "unknown";
        if (!acc[studentId]) {
            acc[studentId] = { 
                name: leave.user_id?.name || "Unknown", 
                email: leave.user_id?.email || "",
                leaves: [] 
            };
        }
        acc[studentId].leaves.push(leave);
        return acc;
    }, {});

    const filteredGroupedLeaves = Object.entries(groupedLeaves).filter(([_, group]) => {
        const searchLower = searchTerm?.toLowerCase();
        return (
            group.name?.toLowerCase().includes(searchLower) ||
            group.email?.toLowerCase().includes(searchLower)
        );
    });

    const toggleStudentExpand = (studentId) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
    };

    const calculateLeaveDays = (from, to) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const diffTime = Math.abs(toDate - fromDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <Loader />;
    if (!user?.id) return <p className="leaves-message">Please log in to view leaves.</p>;
    if (error) return <p className="leaves-message leaves-error">{error}</p>;

    return (
        <div className="leaves-content-container">
            <div className="leaves-header">
                <div className="leaves-header-left">
                    <h1 className="leaves-title">
                        <FontAwesomeIcon icon={faListAlt} className="leaves-title-icon" /> 
                        Student Leaves
                    </h1>
                    <div className="leaves-stats">
                        <div className="leaves-stat-card">
                            <FontAwesomeIcon icon={faUserGraduate} className="leaves-stat-icon" />
                            <div className="leaves-stat-content">
                                <span className="leaves-stat-number">{stats.totalStudents}</span>
                                <span className="leaves-stat-label">Students</span>
                            </div>
                        </div>
                        <div className="leaves-stat-card">
                            <FontAwesomeIcon icon={faFileAlt} className="leaves-stat-icon" />
                            <div className="leaves-stat-content">
                                <span className="leaves-stat-number">{stats.totalLeaves}</span>
                                <span className="leaves-stat-label">Total Leaves</span>
                            </div>
                        </div>
                        <div className="leaves-stat-card">
                            <FontAwesomeIcon icon={faClock} className="leaves-stat-icon" />
                            <div className="leaves-stat-content">
                                <span className="leaves-stat-number">{stats.avgLeaveDuration}</span>
                                <span className="leaves-stat-label">Avg. Days</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="leaves-actions">
                    <div className="leaves-view-toggle-group">
                        <button 
                            className={`leaves-view-toggle ${viewMode === 'card' ? 'leaves-active' : ''}`}
                            onClick={() => setViewMode('card')}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Cards
                        </button>
                        <button 
                            className={`leaves-view-toggle ${viewMode === 'table' ? 'leaves-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FontAwesomeIcon icon={faTable} /> Table
                        </button>
                    </div>
                </div>
            </div>

            <div className="leaves-controls">
                <div className="leaves-search-container">
                    <FontAwesomeIcon icon={faSearch} className="leaves-search-icon" />
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="leaves-search-input"
                    />
                </div>
            </div>

            {filteredGroupedLeaves.length === 0 ? (
                <div className="leaves-empty-state">
                    <div className="leaves-empty-content">
                        <FontAwesomeIcon icon={faFileAlt} className="leaves-empty-icon" />
                        <h3>No Leaves Found</h3>
                        <p>{searchTerm ? "No matching students found" : "No leave applications from your students"}</p>
                    </div>
                </div>
            ) : viewMode === 'table' ? (
                <div className="leaves-table-container">
                    <table className="leaves-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Leave Period</th>
                                <th>Duration</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGroupedLeaves.map(([studentId, group]) => (
                                group.leaves.map((leave, index) => (
                                    <tr key={leave._id} className="leaves-table-row">
                                        {index === 0 && (
                                            <td rowSpan={group.leaves.length} className="leaves-student-cell">
                                                <div className="leaves-student-info">
                                                    <div className="leaves-student-avatar">
                                                        <FontAwesomeIcon icon={faUserCircle} />
                                                    </div>
                                                    <div>
                                                        <div className="leaves-student-name">{group.name}</div>
                                                        <div className="leaves-student-email">
                                                            <FontAwesomeIcon icon={faEnvelope} />
                                                            {group.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="leaves-dates-cell">
                                            <div className="leaves-dates">
                                                <span>{formatDate(leave.from)}</span>
                                                <span className="leaves-date-separator">to</span>
                                                <span>{formatDate(leave.to)}</span>
                                            </div>
                                        </td>
                                        <td className="leaves-duration-cell">
                                            <div className="leaves-duration">
                                                <FontAwesomeIcon icon={faClock} />
                                                {calculateLeaveDays(leave.from, leave.to)} days
                                            </div>
                                        </td>
                                        <td className="leaves-reason-cell">{leave.reason}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="leaves-cards-grid">
                    {filteredGroupedLeaves.map(([studentId, group]) => (
                        <div key={studentId} className="leaves-student-card">
                            <div 
                                className="leaves-student-header" 
                                onClick={() => toggleStudentExpand(studentId)}
                            >
                                <div className="leaves-student-info">
                                    <div className="leaves-student-avatar">
                                        <FontAwesomeIcon icon={faUserGraduate} />
                                    </div>
                                    <div>
                                        <h3 className="leaves-student-name">{group.name}</h3>
                                        <p className="leaves-student-email">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            {group.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="leaves-student-meta">
                                    <span className="leaves-count-badge">
                                        {group.leaves.length} Leave{group.leaves.length !== 1 ? 's' : ''}
                                    </span>
                                    <FontAwesomeIcon 
                                        icon={expandedStudent === studentId ? faChevronUp : faChevronDown} 
                                        className="leaves-expand-icon"
                                    />
                                </div>
                            </div>
                            
                            {expandedStudent === studentId && (
                                <div className="leaves-list">
                                    {group.leaves.map(leave => (
                                        <div key={leave._id} className="leaves-item">
                                            <div className="leaves-item-header">
                                                <div className="leaves-dates">
                                                    <span>{formatDate(leave.from)}</span>
                                                    <span className="leaves-date-separator">to</span>
                                                    <span>{formatDate(leave.to)}</span>
                                                </div>
                            
                                            </div>
                                            <div className="leaves-item-body">
                                                <div className="leaves-duration">
                                                    <FontAwesomeIcon icon={faClock} />
                                                    {calculateLeaveDays(leave.from, leave.to)} days
                                                </div>
                                                <div className="leaves-reason">
                                                    <p>{leave.reason}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeavesForFacultyPage;