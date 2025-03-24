import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../styles/AddUser.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUserPlus, faUser, faEnvelope, faLock, faCheck, faTimes, faUserGraduate } from '@fortawesome/free-solid-svg-icons'; // Added faUserGraduate
import { useNavigate } from "react-router-dom";


const AddUserForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        role: "btech", // Default role
        status: true, // Default status
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post("/api/v1/user/add", formData);

            setMessage(`User created successfully: ${formData.name}`);
            setFormData({
                name: "",
                role: "btech",
                status: true,
                email: "",
                password: "",
            });
            navigate("/update-supervisor");
        } catch (error) {
            console.error(error);
            console.log(error.response);
            
            setMessage(error.response?.data || "Failed to create user");
        }
    };

    return (
        <div className="add-user-container">
            <h2 className="add-user-title"><FontAwesomeIcon icon={faUserPlus} /> Add User</h2>
            {message && <p className={message.startsWith("User created") ? "add-user-message" : "add-user-message error"}>{message}</p>}

            <form className="add-user-form" onSubmit={handleSubmit}>
                <div className="add-user-form-row">
                    <div className="add-user-form-group">
                        <label htmlFor="name"><FontAwesomeIcon icon={faUser} /> Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="add-user-form-group">
                        <label htmlFor="role"><FontAwesomeIcon icon={faUserGraduate} /> Role:</label> {/* Used faUserGraduate here */}
                        <select
                            id="role"
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
                </div>
                <div className="add-user-form-row">
                    <div className="add-user-form-group">
                        <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /> Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="add-user-form-group">
                        <label htmlFor="password"><FontAwesomeIcon icon={faLock} /> Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* <div className="add-user-form-row">
                    <div className="add-user-form-group">
                        <label htmlFor="status">
                            <FontAwesomeIcon icon={formData.status ? faCheck : faTimes} />  Status: Active
                        </label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                id="status"
                                name="status"
                                checked={formData.status}
                                onChange={handleChange}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div> */}

                <button type="submit" className="add-user-submit-btn">
                    <FontAwesomeIcon icon={faUserPlus} /> Add User
                </button>
            </form>
        </div>
    );
};

export default AddUserForm;