import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, faUser, faEnvelope, faLock, 
  faCheck, faTimes, faUserGraduate, faBookOpen,
  faUsers, faCalendarDay, faSearch, faRupeeSign
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import '../styles/AddUser.css'

const AddUserForm = () => {
   

    const [facultySearch, setFacultySearch] = useState("");
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        role: "btech",
        status: true,
        email: "",
        password: "",
        faculty_id: user?.id,
        joining: new Date().toISOString().split("T")[0],
        thesis_title: "",
        committee: [],
        stipend: "0",
        funding_source: "",
        srpId: null,
    });

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            fetchFacultyAndSponsors();
            setFormData(prev => ({ ...prev, faculty_id: user._id }));
        }
    }, [user, navigate]);

    const filteredFaculty = facultyMembers.filter(faculty => 
        faculty.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
        faculty.email.toLowerCase().includes(facultySearch.toLowerCase())
    );

    const fetchFacultyAndSponsors = async () => {``
        setLoading(true);
        try {
            const [facultyRes, sponsorsRes] = await Promise.all([
                axios.get("/api/v1/user/faculty"),
                axios.get(`/api/v1/sponsor-projects/${user?.id}`)
            ]);

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
            setLoading(true);
            
            // First create the user
            const userResponse = await axios.post("/api/v1/user/add", {
                name: formData.name,
                role: formData.role,
                email: formData.email,
                password: formData.password
            });            

            // If user is a student, create supervision record
            if (formData.role !== "faculty" && formData.role !== "admin") {
                await axios.post("/api/v1/supervisors", {
                    faculty_id: user?.id,
                    student_id: userResponse.data.user.id,
                    joining: formData.joining,
                    thesis_title: formData.thesis_title,
                    committee: formData.committee,
                    stipend: formData.stipend,
                    funding_source: formData.funding_source,
                    srpId: formData.srpId
                });
            }

            setMessage({
                text: `User created successfully: ${formData.name}`,
                type: "success"
            });
            
            // Reset form
            setFormData({
                name: "",
                role: "btech",
                status: true,
                email: "",
                password: "",
                faculty_id: user?.id,
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
                text: error.response?.data?.message || "Failed to create user",
                type: "error"
            });
        } finally {
            setLoading(false);
            navigate('/update-project')
        }
    };

    return (
        <div className="add-user-container">
            <button onClick={() => navigate(-1)} className="add-user-back-button">
                &larr; Go Back
            </button>
            
            <h2 className="add-user-title">
                <FontAwesomeIcon icon={faUserPlus} /> Add User
            </h2>
            
            {message.text && (
                <div className={`add-user-message add-user-message-${message.type}`}>
                    {message.text}
                </div>
            )}
            
            {loading && <div className="add-user-loading">Loading...</div>}

            <form onSubmit={handleSubmit} className="add-user-form">
                <div className="add-user-form-grid">
                    {/* Basic User Info */}
                    <div className="add-user-form-group">
                        <label className="add-user-label">
                            <FontAwesomeIcon icon={faUser} /> Name:
                        </label>
                        <input
                            className="add-user-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="add-user-form-group">
                        <label className="add-user-label">
                            <FontAwesomeIcon icon={faUserGraduate} /> Role:
                        </label>
                        <select
                            className="add-user-select"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="btech">B.Tech</option>
                            <option value="intern">Intern</option>
                            {user.role === "admin" && <option value="faculty">Faculty</option>}
                            <option value="mtech">M.Tech</option>
                            <option value="phd">PhD</option>
                            <option value="projectstaff">Project Staff</option>
                        </select>
                    </div>

                    <div className="add-user-form-group">
                        <label className="add-user-label">
                            <FontAwesomeIcon icon={faEnvelope} /> Email:
                        </label>
                        <input
                            className="add-user-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="add-user-form-group">
                        <label className="add-user-label">
                            <FontAwesomeIcon icon={faLock} /> Password:
                        </label>
                        <input
                            className="add-user-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Student-specific fields (shown only for student roles) */}
                    {formData.role !== "faculty" && formData.role !== "admin" && (
                        <>
                            <div className="add-user-form-group">
                                <label className="add-user-label">
                                    <FontAwesomeIcon icon={faCalendarDay} /> Joining Date:
                                </label>
                                <input
                                    className="add-user-input"
                                    type="date"
                                    name="joining"
                                    value={formData.joining}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="add-user-form-group">
                                <label className="add-user-label">
                                    <FontAwesomeIcon icon={faBookOpen} /> Thesis Title:
                                </label>
                                <input
                                    className="add-user-input"
                                    type="text"
                                    name="thesis_title"
                                    value={formData.thesis_title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="add-user-form-group add-user-committee-group">
                                <label className="add-user-label">
                                    <FontAwesomeIcon icon={faUsers} /> Committee Members:
                                </label>
                                <div className="add-user-search-container">
                                    <input
                                        type="text"
                                        placeholder="Search faculty..."
                                        value={facultySearch}
                                        onChange={(e) => setFacultySearch(e.target.value)}
                                        className="add-user-search-input"
                                    />
                                </div>
                                
                                <div className="add-user-committee-checkboxes">
                                    {filteredFaculty.length > 0 ? (
                                        filteredFaculty.map(faculty => (
                                            <div key={faculty._id} className="add-user-checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id={`committee-${faculty._id}`}
                                                    name="committee"
                                                    value={faculty._id}
                                                    checked={formData.committee.includes(faculty._id)}
                                                    onChange={handleChange}
                                                    className="add-user-checkbox"
                                                />
                                                <label htmlFor={`committee-${faculty._id}`} className="add-user-checkbox-label">
                                                    {faculty.name} ({faculty.email})
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="add-user-no-results">
                                            No faculty members found
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="add-user-form-group">
                                <label className="add-user-label">
                                    <FontAwesomeIcon icon={faRupeeSign} /> Stipend (₹):
                                </label>
                                <input
                                    className="add-user-input"
                                    type="number"
                                    name="stipend"
                                    value={formData.stipend}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="add-user-form-group">
                                <label className="add-user-label">Funding Source:</label>
                                <input
                                    className="add-user-input"
                                    type="text"
                                    name="funding_source"
                                    value={formData.funding_source}
                                    onChange={handleChange}
                                />
                            </div>

                            {sponsors.length > 0 && (
                                <div className="add-user-form-group">
                                    <label className="add-user-label">Sponsored Research Project:</label>
                                    <select
                                        className="add-user-select"
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
                        </>
                    )}
                </div>
                
                <button 
                    type="submit" 
                    className="add-user-submit-button" 
                    disabled={loading}
                >
                    <FontAwesomeIcon icon={faUserPlus} /> Add User
                </button>
            </form>
        </div>
    );
};

export default AddUserForm;