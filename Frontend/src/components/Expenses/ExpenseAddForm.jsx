import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/Expenses/AddExpense.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faCalendarAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const ExpenseAddForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        srp_id: "",
        item: "",
        amount: "",
        head: "",
        payment_date: "",
    });

    const [sponsorProjects, setSponsorProjects] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);

    const expenseHeads = [
        "Manpower",
        "Travel",
        "Expenses",
        "Outsourcing",
        "Contingency",
        "Consumable",
        "Others",
        "Overhead",
        "GST"
    ];

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchSponsorProjects = async () => {
            try {
                const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
                setSponsorProjects(response.data);
                setMessage("");
            } catch (error) {
                console.error("Error fetching sponsor projects:", error);
                setMessage("Failed to fetch sponsor projects.");
            }
        };

        if (user?.id) fetchSponsorProjects();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/api/v1/expenses", formData);
            setMessage(`Expense added successfully: ${response.data.item}`);
            setFormData({
                srp_id: "",
                item: "",
                amount: "",
                head: "",
                payment_date: "",
            });
        } catch (error) {
            console.error("Error adding expense:", error);
            setMessage(error.response?.data?.message || "Failed to add expense.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="expenses-add-container">
            <div className="expenses-add-header">
                <button onClick={() => navigate(-1)} className="expenses-back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> Go Back
                </button>
                <h2 className="expenses-add-title">Add New Expense</h2>
            </div>

            {message && (
                <div className={`expenses-message ${message.startsWith("Expense added") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="expenses-add-form">
                <div className="expenses-form-section">
                    <h3 className="expenses-section-title">Expense Details</h3>
                    
                    <div className="expenses-form-row">
                        <div className="expenses-form-group">
                            <label htmlFor="srp_id" className="expenses-form-label">
                                Sponsor Project
                            </label>
                            <select 
                                id="srp_id" 
                                name="srp_id" 
                                value={formData.srp_id} 
                                onChange={handleChange} 
                                className="expenses-form-select"
                                required
                            >
                                <option value="">Select Sponsor Project</option>
                                {sponsorProjects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.title} ({project.agency})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="expenses-form-group">
                            <label htmlFor="item" className="expenses-form-label">
                                Item Description
                            </label>
                            <input 
                                type="text" 
                                id="item" 
                                name="item" 
                                value={formData.item} 
                                onChange={handleChange} 
                                className="expenses-form-input"
                                placeholder="Enter item description"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="expenses-form-row">
                        <div className="expenses-form-group">
                            <label htmlFor="amount" className="expenses-form-label">
                                Amount (₹)
                            </label>
                            <div className="expenses-input-with-icon">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="expenses-input-icon" />
                                <input 
                                    type="number" 
                                    id="amount" 
                                    name="amount" 
                                    value={formData.amount} 
                                    onChange={handleChange} 
                                    className="expenses-form-input"
                                    min="0" 
                                    step="0.01"
                                    placeholder="0.00"
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="expenses-form-group">
                            <label htmlFor="head" className="expenses-form-label">
                                Expense Head
                            </label>
                            <select 
                                id="head" 
                                name="head" 
                                value={formData.head} 
                                onChange={handleChange} 
                                className="expenses-form-select"
                                required
                            >
                                <option value="">Select Expense Head</option>
                                {expenseHeads.map((head) => (
                                    <option key={head} value={head.toLowerCase()}>{head}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="expenses-form-row">
                        <div className="expenses-form-group">
                            <label htmlFor="payment_date" className="expenses-form-label">
                                Payment Date
                            </label>
                            <div className="expenses-input-with-icon">
                                <FontAwesomeIcon icon={faCalendarAlt} className="expenses-input-icon" />
                                <input 
                                    type="date" 
                                    id="payment_date" 
                                    name="payment_date" 
                                    value={formData.payment_date} 
                                    onChange={handleChange} 
                                    className="expenses-form-input"
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="expenses-form-actions">
                    <button 
                        type="submit" 
                        className="expenses-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            "Processing..."
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPlus} /> Add Expense
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseAddForm;