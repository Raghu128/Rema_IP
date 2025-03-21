import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/Expenses/AddExpense.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

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
    const { user } = useSelector((state) => state.user);

    const expenseHeads = [
        "manpower",
        "travel",
        "expenses",
        "outsourcing",
        "contingency",
        "consumable",
        "others",
        "overhead",
        "gst"
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

        try {
            const response = await axios.post("/api/v1/expenses", formData);
            setMessage(`Expense added successfully: ${response.data.item}`);
            setFormData({ // Reset form, but keep faculty_id if needed
                srp_id: "",
                item: "",
                amount: "",
                head: "",
                payment_date: "",
            });
        } catch (error) {
            console.error("Error adding expense:", error);
            setMessage(error.response?.data?.message || "Failed to add expense.");
        }
    };

    return (
        <div className="addexpense-container">
            <button onClick={() => navigate(-1)} className="addexpense-back-btn">
                <FontAwesomeIcon icon={faArrowLeft} /> Go Back
            </button>
            <h2 className="addexpense-title">Add Expense</h2>
            {message && <p className={message.startsWith("Expense added") ? "addexpense-message" : "addexpense-message error"}>{message}</p>}

            <form onSubmit={handleSubmit} className="addexpense-form">
               <div className="addexpense-form-row">
                <div className="addexpense-form-group">
                        <label htmlFor="srp_id">Sponsor Project:</label>
                        <select id="srp_id" name="srp_id" value={formData.srp_id} onChange={handleChange} required>
                            <option value="">Select Sponsor Project</option>
                            {sponsorProjects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.title} ({project.agency})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="addexpense-form-group">
                        <label htmlFor="item">Item:</label>
                        <input type="text" id="item" name="item" value={formData.item} onChange={handleChange} required />
                    </div>
                </div>
               
                <div className="addexpense-form-row">
                    <div className="addexpense-form-group">
                        <label htmlFor="amount">Amount:</label>
                        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} min="0" required />
                    </div>
                    <div className="addexpense-form-group">
                        <label htmlFor="head">Head:</label>
                        <select id="head" name="head" value={formData.head} onChange={handleChange} required>
                            <option value="">Select Expense Head</option>
                            {expenseHeads.map((head) => (
                                <option key={head} value={head}>{head}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="addexpense-form-row">
                    <div className="addexpense-form-group">
                        <label htmlFor="payment_date">Payment Date:</label>
                        <input type="date" id="payment_date" name="payment_date" value={formData.payment_date} onChange={handleChange} required />
                    </div>
                </div>

                <button type="submit" className="addexpense-submit-btn">
                   <FontAwesomeIcon icon={faPlus} /> Add Expense
                </button>
            </form>
        </div>
    );
};

export default ExpenseAddForm;