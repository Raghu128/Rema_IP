import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/FinanceBudget/FinanceBudgetList.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faUser } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons and user
import Loader from '../Loader'

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

    return (
        <div className="financebudgetlist-container">
            <div className="financebudgetlist-header">
                <h2 className="financebudgetlist-title">
                    <FontAwesomeIcon icon={faUser} className="financebudgetlist-title-icon" /> Finance Budgets
                </h2>
                <button className="financebudgetlist-add-edit-btn" onClick={() => navigate(`/manage-financebudget/${srp_id}`)}>
                    <FontAwesomeIcon icon={faPlus} /> / <FontAwesomeIcon icon={faEdit} />
                </button>
            </div>
            {loading && <Loader />}
            {error && <p className="financebudgetlist-error">{error}</p>}
            {!loading && financeBudgets.length === 0 && (
                <p className="financebudgetlist-no-data">No finance budgets found.</p>
            )}
            {financeBudgets.length > 0 && (
                <div className="financebudgetlist-table-wrapper">
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
                                    <td>{budget.manpower?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.equipment?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.travel?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.expenses?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.outsourcing?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.contingency?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.consumable?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.others?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.overhead?.$numberDecimal || "N/A"}</td>
                                    <td>{budget.gst?.$numberDecimal || "N/A"}</td>
                                     <td className={budget.status === 'Approved' ? 'status-approved' : (budget.status === 'Rejected' ? 'status-rejected' : 'status-pending')}>
                                      {budget.status}
                                  </td>
                                </tr>
                            ))}
                            {/* Total Row */}
                            <tr className="total-row">
                                <td><strong>Total</strong></td>
                                <td><strong>{total.manpower.toFixed(2)}</strong></td>
                                <td><strong>{total.equipment.toFixed(2)}</strong></td>
                                <td><strong>{total.travel.toFixed(2)}</strong></td>
                                <td><strong>{total.expenses.toFixed(2)}</strong></td>
                                <td><strong>{total.outsourcing.toFixed(2)}</strong></td>
                                <td><strong>{total.contingency.toFixed(2)}</strong></td>
                                <td><strong>{total.consumable.toFixed(2)}</strong></td>
                                <td><strong>{total.others.toFixed(2)}</strong></td>
                                <td><strong>{total.overhead.toFixed(2)}</strong></td>
                                <td><strong>{total.gst.toFixed(2)}</strong></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FinanceBudgetList;