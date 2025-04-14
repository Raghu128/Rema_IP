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
        year: 0,
        manpower: 0,
        pi_compensation: 0,
        equipment: 0,
        travel: 0,
        expenses: 0,
        outsourcing: 0,
        contingency: 0,
        consumable: 0,
        others: 0,
        overhead: 0,
        gst: 0,
        status: "approved",
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
            setFormData({
                ...formData,
                year: 0,
                manpower: 0,
                pi_compensation: 0,
                equipment: 0,
                travel: 0,
                expenses: "",
                outsourcing: 0,
                contingency: 0,
                consumable: 0,
                others: 0,
                overhead: 0,
                gst: 0,
                status: "approved",
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
            <div className="financebudget-header">
                <button onClick={() => navigate(-1)} className="financebudget-back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> Go Back
                </button>
                <h2 className="financebudget-title">Add Finance Budget</h2>
            </div>

            {message && (
                <div className={`financebudget-message ${message.includes("successfully") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            <form className="financebudget-form" onSubmit={handleSubmit}>
                <div className="financebudget-form-section">
                    <h3 className="financebudget-form-section-title">Basic Information</h3>
                    <div className="financebudget-form-row">
                        <div className="financebudget-form-group">
                            <label htmlFor="year" className="financebudget-form-label">Year</label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                className="financebudget-form-input"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                placeholder="Enter year"
                                min="2020"
                                max="2050"
                            />
                        </div>
                    </div>
                </div>

                <div className="financebudget-form-section">
                    <h3 className="financebudget-form-section-title">Budget Details</h3>
                    
                    <div className="financebudget-form-grid">
                        <div className="financebudget-form-group">
                            <label htmlFor="manpower" className="financebudget-form-label">Manpower</label>
                            <input 
                                type="number" 
                                id="manpower" 
                                name="manpower" 
                                className="financebudget-form-input"
                                value={formData.manpower} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="pi_compensation" className="financebudget-form-label">PI Compensation</label>
                            <input 
                                type="number" 
                                id="pi_compensation" 
                                name="pi_compensation" 
                                className="financebudget-form-input"
                                value={formData.pi_compensation} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="equipment" className="financebudget-form-label">Equipment</label>
                            <input 
                                type="number" 
                                id="equipment" 
                                name="equipment" 
                                className="financebudget-form-input"
                                value={formData.equipment} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="travel" className="financebudget-form-label">Travel</label>
                            <input 
                                type="number" 
                                id="travel" 
                                name="travel" 
                                className="financebudget-form-input"
                                value={formData.travel} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="expenses" className="financebudget-form-label">Expenses</label>
                            <input 
                                type="number" 
                                id="expenses" 
                                name="expenses" 
                                className="financebudget-form-input"
                                value={formData.expenses} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="outsourcing" className="financebudget-form-label">Outsourcing</label>
                            <input 
                                type="number" 
                                id="outsourcing" 
                                name="outsourcing" 
                                className="financebudget-form-input"
                                value={formData.outsourcing} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="contingency" className="financebudget-form-label">Contingency</label>
                            <input 
                                type="number" 
                                id="contingency" 
                                name="contingency" 
                                className="financebudget-form-input"
                                value={formData.contingency} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="consumable" className="financebudget-form-label">Consumable</label>
                            <input 
                                type="number" 
                                id="consumable" 
                                name="consumable" 
                                className="financebudget-form-input"
                                value={formData.consumable} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="others" className="financebudget-form-label">Others</label>
                            <input 
                                type="number" 
                                id="others" 
                                name="others" 
                                className="financebudget-form-input"
                                value={formData.others} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="overhead" className="financebudget-form-label">Overhead</label>
                            <input 
                                type="number" 
                                id="overhead" 
                                name="overhead" 
                                className="financebudget-form-input"
                                value={formData.overhead} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="gst" className="financebudget-form-label">GST</label>
                            <input 
                                type="number" 
                                id="gst" 
                                name="gst" 
                                className="financebudget-form-input"
                                value={formData.gst} 
                                onChange={handleChange} 
                                min="0" 
                                step="any" 
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div className="financebudget-form-group">
                            <label htmlFor="status" className="financebudget-form-label">Status</label>
                            <select 
                                id="status" 
                                name="status" 
                                className="financebudget-form-select"
                                value={formData.status} 
                                onChange={handleChange}
                            >
                                {/* <option value="pending">Pending</option> */}
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="financebudget-form-actions">
                    <button 
                        type="submit" 
                        className="financebudget-form-submit-btn" 
                        disabled={loading}
                    >
                        {loading ? (
                            "Submitting..."
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPlus} /> Add Finance Budget
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FinanceBudgetAddForm;