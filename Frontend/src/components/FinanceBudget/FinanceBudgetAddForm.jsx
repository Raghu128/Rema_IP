import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/FinanceBudget/financebudget.css';
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

const FinanceBudgetAddForm = () => {
    const navigate = useNavigate();
    const { srp_id } = useParams();
    const [formData, setFormData] = useState({
        srp_id: srp_id,
        year: "",
        manpower: "",
        pi_compensation: "",
        equipment: "",
        travel: "",
        expenses: "",
        outsourcing: "",
        contingency: "",
        consumable: "",
        others: "",
        overhead: "",
        gst: "",
        status: "pending",
    });

    const { user } = useSelector((state) => state.user);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

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
            const response = await axios.post("/api/v1/finance-budgets", formData);
            setMessage(`Finance Budget added successfully for ${response.data.year}`);
            setFormData({  // Keep srp_id, reset others
                ...formData, // Keep srpId value
                year: "",
                manpower: "",
                pi_compensation: "",
                equipment: "",
                travel: "",
                expenses: "",
                outsourcing: "",
                contingency: "",
                consumable: "",
                others: "",
                overhead: "",
                gst: "",
                status: "pending",
            });
        } catch (error) {
            console.error("Error adding finance budget:", error);
            setMessage(error.response?.data?.message || "Failed to add finance budget.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="financebudget-container">
            <button onClick={() => navigate(-1)} className="financebudget-back-btn">
                <FontAwesomeIcon icon={faArrowLeft} /> Go Back
            </button>
            <h2 className="financebudget-title">Add Finance Budget</h2>
            {message && <p className="financebudget-message">{message}</p>}

            <form className="financebudget-form" onSubmit={handleSubmit}>
                <div className="financebudget-form-row">
                    <div className="financebudget-form-group">
                        <label htmlFor="year">Year:</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            className="financebudget-input"
                            value={formData.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="financebudget-form-row">
                    <div className="financebudget-form-group">
                        <label htmlFor="manpower">Manpower:</label>
                        <input type="number" id="manpower" name="manpower" value={formData.manpower} onChange={handleChange} min="0" step="any" />
                    </div>
                    <div className="financebudget-form-group">
                        <label htmlFor="pi_compensation">PI Compensation:</label>
                        <input type="number" id="pi_compensation" name="pi_compensation" value={formData.pi_compensation} onChange={handleChange} min="0" step="any" />
                    </div>
                </div>

                <div className="financebudget-form-row">
                    <div className="financebudget-form-group">
                        <label htmlFor="equipment">Equipment:</label>
                        <input type="number" id="equipment" name="equipment" value={formData.equipment} onChange={handleChange} min="0" step="any" />
                    </div>
                    <div className="financebudget-form-group">
                        <label htmlFor="travel">Travel:</label>
                        <input type="number" id="travel" name="travel" value={formData.travel} onChange={handleChange} min="0" step="any" />
                    </div>
                </div>

                <div className="financebudget-form-row">
                    <div className="financebudget-form-group">
                        <label htmlFor="expenses">Expenses:</label>
                        <input type="number" id="expenses" name="expenses" value={formData.expenses} onChange={handleChange} min="0" step="any" />
                    </div>
                    <div className="financebudget-form-group">
                        <label htmlFor="outsourcing">Outsourcing:</label>
                        <input type="number" id="outsourcing" name="outsourcing" value={formData.outsourcing} onChange={handleChange} min="0" step="any" />
                    </div>
                </div>

                <div className="financebudget-form-row">
                    <div className="financebudget-form-group">
                        <label htmlFor="contingency">Contingency:</label>
                        <input type="number" id="contingency" name="contingency" value={formData.contingency} onChange={handleChange} min="0" step="any" />
                    </div>
                    <div className="financebudget-form-group">
                        <label htmlFor="consumable">Consumable:</label>
                        <input type="number" id="consumable" name="consumable" value={formData.consumable} onChange={handleChange} min="0" step="any" />
                    </div>
                </div>

                <div className="financebudget-form-row">
                    <div className="financebudget-form-group">
                        <label htmlFor="others">Others:</label>
                        <input type="number" id="others" name="others" value={formData.others} onChange={handleChange} min="0" step="any" />
                    </div>
                    <div className="financebudget-form-group">
                        <label htmlFor="overhead">Overhead:</label>
                        <input type="number" id="overhead" name="overhead" value={formData.overhead} onChange={handleChange} min="0" step="any" />
                    </div>
                </div>

                <div className="financebudget-form-row">
                    <div className="financebudget-form-group">
                        <label htmlFor="gst">GST:</label>
                        <input type="number" id="gst" name="gst" value={formData.gst} onChange={handleChange} min="0" step="any" />
                    </div>
                    <div className="financebudget-form-group">
                        <label htmlFor="status">Status:</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="financebudget-submit-btn" disabled={loading}>
                    {loading ? "Submitting..." : <span><FontAwesomeIcon icon={faPlus} /> Add Finance Budget</span>}
                </button>
            </form>
        </div>
    );
};

export default FinanceBudgetAddForm;