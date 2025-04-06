import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/FinanceBudget/FinanceBudgetList.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faUser, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import Loader from '../Loader';

const FinanceBudgetList = ({ srp_id }) => {
    const [financeBudgets, setFinanceBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFinanceBudgets = async () => {
            try {
                const financeResponse = await axios.get(`/api/v1/finance-budgets/${srp_id}`);
                const flattenedBudgets = financeResponse.data.budgets.flat();
                setFinanceBudgets(flattenedBudgets);
                setError("");
            } catch (err) {
                console.error("Error fetching finance budgets:", err);
                setError("Failed to load finance budgets.");
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceBudgets();
    }, [srp_id]);

    const total = financeBudgets.reduce(
        (acc, budget) => ({
            manpower: acc.manpower + (parseFloat(budget.manpower?.$numberDecimal) || 0),
            equipment: acc.equipment + (parseFloat(budget.equipment?.$numberDecimal) || 0),
            travel: acc.travel + (parseFloat(budget.travel?.$numberDecimal) || 0),
            expenses: acc.expenses + (parseFloat(budget.expenses?.$numberDecimal) || 0),
            outsourcing: acc.outsourcing + (parseFloat(budget.outsourcing?.$numberDecimal) || 0),
            contingency: acc.contingency + (parseFloat(budget.contingency?.$numberDecimal) || 0),
            consumable: acc.consumable + (parseFloat(budget.consumable?.$numberDecimal) || 0),
            others: acc.others + (parseFloat(budget.others?.$numberDecimal) || 0),
            overhead: acc.overhead + (parseFloat(budget.overhead?.$numberDecimal) || 0),
            gst: acc.gst + (parseFloat(budget.gst?.$numberDecimal) || 0),
        }),
        {
            manpower: 0,
            equipment: 0,
            travel: 0,
            expenses: 0,
            outsourcing: 0,
            contingency: 0,
            consumable: 0,
            others: 0,
            overhead: 0,
            gst: 0,
        }
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="financebudgetlist-container">
            <div className="financebudgetlist-header">
                <div className="financebudgetlist-title-container">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="financebudgetlist-title-icon" />
                    <h2 className="financebudgetlist-title">Project Budget</h2>
                </div>
                <button 
                    className="financebudgetlist-add-edit-btn" 
                    onClick={() => navigate(`/manage-financebudget/${srp_id}`)}
                >
                    <FontAwesomeIcon icon={faEdit} /> Manage 
                </button>
            </div>
            
            {loading && <Loader />}
            
            {error && (
                <div className="financebudgetlist-error">
                    <p>{error}</p>
                </div>
            )}
            
            {!loading && financeBudgets.length === 0 && (
                <div className="financebudgetlist-empty-state">
                    <p>No budget data available</p>
                    <button 
                        className="financebudgetlist-add-btn"
                        onClick={() => navigate(`/manage-financebudget/${srp_id}`)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Budget
                    </button>
                </div>
            )}
            
            {financeBudgets.length > 0 && (
                <div className="financebudgetlist-content">
                    <div className="financebudgetlist-table-container">
                        <div className="financebudgetlist-table-scroll">
                            <table className="financebudgetlist-table">
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>Manpower</th>
                                        <th>Equipment</th>
                                        <th>Travel</th>
                                        <th>Expenses</th>
                                        <th>Outsourcing</th>
                                        <th>Contingency</th>
                                        <th>Consumable</th>
                                        <th>Others</th>
                                        <th>Overhead</th>
                                        <th>GST</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {financeBudgets.map((budget) => (
                                        <tr key={budget._id}>
                                            <td>{budget.year}</td>
                                            <td>{formatCurrency(parseFloat(budget.manpower?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.equipment?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.travel?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.expenses?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.outsourcing?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.contingency?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.consumable?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.others?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.overhead?.$numberDecimal || 0))}</td>
                                            <td>{formatCurrency(parseFloat(budget.gst?.$numberDecimal || 0))}</td>
                                            <td>
                                                <span className={`status-badge ${budget.status.toLowerCase()}`}>
                                                    {budget.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="financebudgetlist-total-row">
                                        <td><strong>Total</strong></td>
                                        <td><strong>{formatCurrency(total.manpower)}</strong></td>
                                        <td><strong>{formatCurrency(total.equipment)}</strong></td>
                                        <td><strong>{formatCurrency(total.travel)}</strong></td>
                                        <td><strong>{formatCurrency(total.expenses)}</strong></td>
                                        <td><strong>{formatCurrency(total.outsourcing)}</strong></td>
                                        <td><strong>{formatCurrency(total.contingency)}</strong></td>
                                        <td><strong>{formatCurrency(total.consumable)}</strong></td>
                                        <td><strong>{formatCurrency(total.others)}</strong></td>
                                        <td><strong>{formatCurrency(total.overhead)}</strong></td>
                                        <td><strong>{formatCurrency(total.gst)}</strong></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    
                    <div className="financebudgetlist-summary">
                        <div className="financebudgetlist-summary-card">
                            <h3>Budget Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(
                                    total.manpower + 
                                    total.equipment + 
                                    total.travel + 
                                    total.expenses + 
                                    total.outsourcing + 
                                    total.contingency + 
                                    total.consumable + 
                                    total.others
                                )}</span>
                            </div>
                            <div className="summary-row">
                                <span>Overhead:</span>
                                <span>{formatCurrency(total.overhead)}</span>
                            </div>
                            <div className="summary-row">
                                <span>GST:</span>
                                <span>{formatCurrency(total.gst)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Grand Total:</span>
                                <span>{formatCurrency(
                                    total.manpower + 
                                    total.equipment + 
                                    total.travel + 
                                    total.expenses + 
                                    total.outsourcing + 
                                    total.contingency + 
                                    total.consumable + 
                                    total.others + 
                                    total.overhead + 
                                    total.gst
                                )}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceBudgetList;