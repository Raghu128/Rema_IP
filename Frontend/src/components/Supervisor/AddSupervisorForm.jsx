import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AddSupervisorForm.css";

const AddSupervisorForm = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        faculty_id: user?._id || "",
        student_id: "",
        joining: new Date().toISOString().split("T")[0],
        thesis_title: "",
        committee: [],
        stipend: "0",
        funding_source: "",
        srpId: null,
    });
    const [facultySearch, setFacultySearch] = useState("");
    const [supervisors, setSupervisors] = useState([]); 
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    // Extract all unique students from supervisors data
    const students = Array.from(new Set(
        supervisors.map(sup => sup.student_id)
    ));

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            fetchData();
        }
    }, [user, navigate]);

    const filteredFaculty = facultyMembers.filter(faculty => 
        faculty.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
        faculty.email.toLowerCase().includes(facultySearch.toLowerCase())
    );
    const fetchData = async () => {
        setLoading(true);
        try {
            const [supervisorsRes, facultyRes, sponsorsRes] = await Promise.all([
                axios.get(`/api/v1/supervisors/${user?.id}`),
                axios.get("/api/v1/user/faculty"),
                axios.get(`/api/v1/sponsor-projects/${user?.id}`)
            ]);

            setSupervisors(supervisorsRes.data);
            setFacultyMembers(facultyRes.data.filter(f => f._id !== user._id));
            setSponsors(sponsorsRes.data);
            setMessage({ text: "", type: "" });
            
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage({ 
                text: "Error fetching data. Please try again later.", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStudentChange = (e) => {
        const selectedStudentId = e.target.value;
        const existingSupervisor = supervisors.find(sup => sup.student_id._id === selectedStudentId);

        if (existingSupervisor) {
            setFormData({
                faculty_id: user._id,
                student_id: existingSupervisor.student_id._id,
                joining: new Date(existingSupervisor.joining).toISOString().split("T")[0],
                thesis_title: existingSupervisor.thesis_title,
                committee: existingSupervisor.committee.map(member => member._id),
                stipend: existingSupervisor.stipend?.$numberDecimal || "0",
                funding_source: existingSupervisor.funding_source,
                srpId: existingSupervisor.srpId?._id || null,
            });
        } else {
            setFormData(prev => ({
                ...prev,
                student_id: selectedStudentId,
                thesis_title: "",
                committee: [],
                stipend: "0",
                funding_source: "",
                srpId: null,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === "checkbox" && name === "committee") {
            setFormData(prev => ({
                ...prev,
                committee: checked
                    ? [...prev.committee, value]
                    : prev.committee.filter(id => id !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const existingSupervisor = supervisors.find(sup => sup.student_id._id === formData.student_id);
            const url = existingSupervisor 
                ? `/api/v1/supervisors/${existingSupervisor._id}`
                : "/api/v1/supervisors";
            
            const method = existingSupervisor ? "put" : "post";
            
            await axios[method](url, formData);
            
            setMessage({
                text: `Supervisor ${existingSupervisor ? "updated" : "added"} successfully`,
                type: "success"
            });
            
            fetchData();
            
            // Reset form but keep faculty_id
            setFormData({
                faculty_id: user._id,
                student_id: "",
                joining: new Date().toISOString().split("T")[0],
                thesis_title: "",
                committee: [],
                stipend: "0",
                funding_source: "",
                srpId: null,
            });
            
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage({
                text: error.response?.data?.message || "Failed to submit form",
                type: "error"
            });
        }
    };

    return (
        <div className="supervisor-container">
            <button onClick={() => navigate(-1)} className="supervisor-back-button">
                &larr; Go Back
            </button>
            
            <div className="supervisor-form-card">
                <h2 className="supervisor-form-title">
                    {formData.student_id ? "Update Supervision" : "Add New Supervision"}
                </h2>
                
                {loading && <div className="supervisor-loading">Loading...</div>}
                {message.text && (
                    <div className={`supervisor-message supervisor-message-${message.type}`}>
                        {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="supervisor-form">
                    <div className="supervisor-form-grid">
                        {/* Student Selection */}
                        <div className="supervisor-form-group">
                            <label className="supervisor-label">Student</label>
                            <select
                                className="supervisor-select"
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleStudentChange}
                                required
                            >
                                <option value="">Select a student</option>
                                {students.map(student => (
                                    <option key={student._id} value={student._id}>
                                        {student.name} ({student.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Joining Date */}
                        <div className="supervisor-form-group">
                            <label className="supervisor-label">Joining Date</label>
                            <input
                                className="supervisor-input"
                                type="date"
                                name="joining"
                                value={formData.joining}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        {/* Thesis Title */}
                        <div className="supervisor-form-group">
                            <label className="supervisor-label">Thesis Title</label>
                            <input
                                className="supervisor-input"
                                type="text"
                                name="thesis_title"
                                value={formData.thesis_title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        {/* Committee Members */}
                        <div className="supervisor-form-group supervisor-committee-group">
                            <label className="supervisor-label">Committee Members</label>
                            <div className="supervisor-search-container">
                    <input
                        type="text"
                        placeholder="Search faculty..."
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        className="supervisor-search-input"
                    />
                </div>
                
                <div className="supervisor-committee-checkboxes">
                    {filteredFaculty.length > 0 ? (
                        filteredFaculty.map(faculty => (
                            <div key={faculty._id} className="supervisor-checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`committee-${faculty._id}`}
                                    name="committee"
                                    value={faculty._id}
                                    checked={formData.committee.includes(faculty._id)}
                                    onChange={handleChange}
                                    className="supervisor-checkbox"
                                />
                                <label htmlFor={`committee-${faculty._id}`} className="supervisor-checkbox-label">
                                    {faculty.name} ({faculty.email})
                                </label>
                            </div>
                        ))
                    ) : (
                        <div className="supervisor-no-results">
                            No faculty members found
                        </div>
                    )}
                </div>
            </div>
                        
                        {/* Stipend */}
                        <div className="supervisor-form-group">
                            <label className="supervisor-label">Stipend (₹)</label>
                            <input
                                className="supervisor-input"
                                type="number"
                                name="stipend"
                                value={formData.stipend}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>
                        
                        {/* Funding Source */}
                        <div className="supervisor-form-group">
                            <label className="supervisor-label">Funding Source</label>
                            <input
                                className="supervisor-input"
                                type="text"
                                name="funding_source"
                                value={formData.funding_source}
                                onChange={handleChange}
                            />
                        </div>
                        
                        {/* SRP ID */}
                        {sponsors.length > 0 && (
                            <div className="supervisor-form-group">
                                <label className="supervisor-label">Sponsored Research Project</label>
                                <select
                                    className="supervisor-select"
                                    name="srpId"
                                    value={formData.srpId || ""}
                                    onChange={handleChange}
                                >
                                    <option value="">None</option>
                                    {sponsors.map(sponsor => (
                                        <option key={sponsor._id} value={sponsor._id}>
                                            {sponsor.agency} ({sponsor.title})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="supervisor-submit-button" 
                        disabled={loading}
                    >
                        {formData.student_id ? "Update Supervision" : "Add Supervision"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSupervisorForm;