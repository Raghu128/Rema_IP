import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Expenses/ExpensesList.css";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faEdit, faSearch, faMoneyBillWave,
    faFileInvoiceDollar, faExclamationTriangle,
    faTable, faThLarge
} from '@fortawesome/free-solid-svg-icons';

const ExpensesList = () => {
    const { user } = useSelector((state) => state.user);
    const [expenseData, setExpenseData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!user?.id) {
                setLoading(false);
                setError("User not found. Please log in.");
                return;
            }

            try {
                const response = await axios.get(`/api/v1/expenses/${user.id}`);
                setExpenseData(response.data);
            } catch (err) {
                setError("Failed to fetch expenses");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [user?.id]);

    // Filter expenses by agency name
    const filteredExpenses = expenseData.filter(({ sponsorProject }) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            sponsorProject.agency.toLowerCase().includes(searchLower) ||
            sponsorProject.title.toLowerCase().includes(searchLower)
        );
    });
    if (!user?.id) return <p className="expenses-message">Please log in to view expenses.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="expenses-message expenses-error">{error}</p>;

    return (
        <div className="expenses-container">
            <div className="expenses-header">
                <h2 className="expenses-title">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="expenses-title-icon" />
                    User Expenses
                </h2>
                <div className="expenses-actions">
                    <button
                        onClick={() => setViewMode('card')}
                        className={`expenses-view-toggle ${viewMode === 'card' ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={faThLarge} /> Card
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`expenses-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={faTable} /> Table
                    </button>

                    <button
                        onClick={() => navigate("/manage-expense")}
                        className="expenses-manage-btn"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="expenses-search-bar">
                <FontAwesomeIcon icon={faSearch} className="expenses-search-icon" />
                <input
                    type="text"
                    placeholder="Search by agency or project name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="expenses-search-input"
                />
            </div>

            {filteredExpenses.length === 0 ? (
                <div className="expenses-empty-state">
                    <p className="expenses-message">No Expenses or Project found.</p>
                    {/* <button 
                        onClick={() => navigate("/manage-expense")} 
                        className="expenses-add-btn"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add New Expense
                    </button> */}
                </div>
            ) : (
                <div className={`expenses-content ${viewMode}`}>
                    {filteredExpenses.map(({ sponsorProject, expenses }) => {
                        const totalExpenses = expenses.reduce(
                            (sum, expense) => sum + parseFloat(expense.amount.$numberDecimal),
                            0
                        );
                        const budget = parseFloat(sponsorProject.budget.$numberDecimal);
                        const remainingBudget = budget - totalExpenses;
                        const budgetPercentage = (totalExpenses / budget) * 100;

                        return (
                            <div key={sponsorProject.id} className="expenses-project-card">
                                <div className="expenses-project-header">
                                    <h3 className="expenses-project-title">
                                        {sponsorProject.title}
                                        <span className="expenses-project-agency">({sponsorProject.agency})</span>
                                    </h3>
                                    <div className="expenses-budget-info">
                                        <p className="expenses-budget-amount">
                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                            <strong>Budget:</strong> ₹{budget.toFixed(2)}
                                        </p>
                                        <div className="expenses-progress-bar">
                                            <div
                                                className="expenses-progress"
                                                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                                data-percentage={`${Math.round(budgetPercentage)}%`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {expenses.length === 0 ? (
                                    <div className="expenses-no-data">
                                        <p className="expenses-message">No expenses recorded for this project.</p>
                                        <button
                                            onClick={() => navigate("/manage-expense")}
                                            className="expenses-add-btn"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Add Expense
                                        </button>
                                    </div>
                                ) : viewMode === 'table' ? (
                                    <table className="expenses-data-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Item</th>
                                                <th>Amount (₹)</th>
                                                <th>Head</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.map((expense) => (
                                                <tr key={expense._id}>
                                                    <td>{new Date(expense.payment_date).toLocaleDateString()}</td>
                                                    <td>{expense.item}</td>
                                                    <td>{parseFloat(expense.amount.$numberDecimal).toFixed(2)}</td>
                                                    <td>{expense.head}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="expenses-total-row">
                                                <td colSpan="2"><strong>Total</strong></td>
                                                <td><strong>₹{totalExpenses.toFixed(2)}</strong></td>
                                                <td colSpan="2"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                ) : (
                                    <div className="expenses-cards-container">
                                        {expenses.map((expense) => (
                                            <div key={expense._id} className="expense-card">
                                                <div className="expense-card-header">
                                                    <h4>{expense.item}</h4>
                                                    <span className="expense-amount">
                                                        ₹{parseFloat(expense.amount.$numberDecimal).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="expense-card-details">
                                                    <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
                                                    <p><strong>Head:</strong> {expense.head}</p>
                                                    {expense.description && (
                                                        <p><strong>Notes:</strong> {expense.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="expenses-summary">
                                    <div className="expenses-summary-item">
                                        <span>Total Expenses:</span>
                                        <span className="expenses-summary-value">₹{totalExpenses.toFixed(2)}</span>
                                    </div>
                                    <div className="expenses-summary-item">
                                        <span>Remaining Budget:</span>
                                        <span className={`expenses-summary-value ${remainingBudget < 0 ? 'expenses-over-budget' : ''}`}>
                                            ₹{remainingBudget.toFixed(2)}
                                            {remainingBudget < 0 && (
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="expenses-warning-icon" />
                                            )}
                                        </span>
                                    </div>
                                    <div className="expenses-summary-item">
                                        <span>Utilized:</span>
                                        <span className="expenses-summary-value">{Math.round(budgetPercentage)}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExpensesList;