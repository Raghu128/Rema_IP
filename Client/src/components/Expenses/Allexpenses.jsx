import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faSearch, faMoneyBillWave,
  faFileInvoiceDollar, faExclamationTriangle,
  faTable, faThLarge, faChartPie, faCalendarDay,
  faTags, faInfoCircle, faPercentage
} from '@fortawesome/free-solid-svg-icons';
import "../../styles/Expenses/ExpensesList.css"

const ExpensesList = () => {
    const { user } = useSelector((state) => state.user);
    const [expenseData, setExpenseData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState('table');
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalExpenses: 0,
        budgetUtilization: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!user?.id) {
                setLoading(false);
                setError("User not found. Please log in.");
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/expenses/${user.id}`);
                setExpenseData(response.data);
                
                // Calculate statistics
                const totalProjects = response.data.length;
                let totalExpenses = 0;
                let totalBudget = 0;
                
                response.data.forEach(({ sponsorProject, expenses }) => {
                    totalBudget += parseFloat(sponsorProject.budget.$numberDecimal);
                    expenses.forEach(expense => {
                        totalExpenses += parseFloat(expense.amount.$numberDecimal);
                    });
                });
                
                const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
                
                setStats({
                    totalProjects,
                    totalExpenses,
                    budgetUtilization: Math.round(budgetUtilization)
                });
            } catch (err) {
                setError("Failed to fetch expenses");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [user?.id]);

    const filteredExpenses = expenseData.filter(({ sponsorProject }) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            sponsorProject.agency.toLowerCase().includes(searchLower) ||
            sponsorProject.title.toLowerCase().includes(searchLower)
        );
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (!user?.id) return <p className="expenses-project-message">Please log in to view expenses.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="expenses-project-message expenses-project-error">{error}</p>;

    return (
        <div className="expenses-project-container">
            <div className="expenses-project-header">
                <div className="expenses-project-header-left">
                    <h1 className="expenses-project-title">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="expenses-project-title-icon" />
                        Project Expenses
                    </h1>
                    <div className="expenses-project-stats">
                        <div className="expenses-project-stat-card">
                            <FontAwesomeIcon icon={faChartPie} className="expenses-project-stat-icon" />
                            <div className="expenses-project-stat-content">
                                <span className="expenses-project-stat-number">{stats.totalProjects}</span>
                                <span className="expenses-project-stat-label">Projects</span>
                            </div>
                        </div>
                        <div className="expenses-project-stat-card">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="expenses-project-stat-icon" />
                            <div className="expenses-project-stat-content">
                                <span className="expenses-project-stat-number">{formatCurrency(stats.totalExpenses)}</span>
                                <span className="expenses-project-stat-label">Total Expenses</span>
                            </div>
                        </div>
                        <div className="expenses-project-stat-card">
                            <FontAwesomeIcon icon={faPercentage} className="expenses-project-stat-icon" />
                            <div className="expenses-project-stat-content">
                                <span className="expenses-project-stat-number">{stats.budgetUtilization}%</span>
                                <span className="expenses-project-stat-label">Utilization</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="expenses-project-actions">
                    <div className="expenses-project-view-toggle-group">
                        <button 
                            className={`expenses-project-view-toggle ${viewMode === 'card' ? 'expenses-project-active' : ''}`}
                            onClick={() => setViewMode('card')}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Card 
                        </button>
                        <button 
                            className={`expenses-project-view-toggle ${viewMode === 'table' ? 'expenses-project-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FontAwesomeIcon icon={faTable} /> Table 
                        </button>
                    </div>
                    <button 
                        className="expenses-project-manage-button"
                        onClick={() => navigate("/manage-expense")}
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage 
                    </button>
                </div>
            </div>

            <div className="expenses-project-controls">
                <div className="expenses-project-search-container">
                    <FontAwesomeIcon icon={faSearch} className="expenses-project-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by agency or project name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="expenses-project-search-input"
                    />
                </div>
            </div>

            {filteredExpenses.length === 0 ? (
                <div className="expenses-project-empty-state">
                    <div className="expenses-project-empty-content">
                        <FontAwesomeIcon icon={faInfoCircle} className="expenses-project-empty-icon" />
                        <h3>No Expenses Found</h3>
                        <p>Try adjusting your search or add new expenses</p>
                        <button 
                            className="expenses-project-add-button"
                            onClick={() => navigate("/manage-expense")}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add New Expense
                        </button>
                    </div>
                </div>
            ) : (
                <div className="expenses-project-content">
                    {filteredExpenses.map(({ sponsorProject, expenses }) => {
                        const totalExpenses = expenses.reduce(
                            (sum, expense) => sum + parseFloat(expense.amount.$numberDecimal),
                            0
                        );
                        const budget = parseFloat(sponsorProject.budget.$numberDecimal);
                        const remainingBudget = budget - totalExpenses;
                        const budgetPercentage = (totalExpenses / budget) * 100;
                        const isOverBudget = remainingBudget < 0;

                        return (
                            <div key={sponsorProject.id} className="expenses-project-card">
                                <div className="expenses-project-card-header">
                                    <div className="expenses-project-card-title">
                                        <h3>{sponsorProject.title}</h3>
                                        <span className="expenses-project-agency">{sponsorProject.agency}</span>
                                    </div>
                                    <div className="expenses-project-budget-info">
                                        <div className="expenses-project-budget-amount">
                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                            <span>Total Budget: {formatCurrency(budget)}</span>
                                        </div>
                                        <div className="expenses-project-progress-container">
                                            <div 
                                                className={`expenses-project-progress-bar ${isOverBudget ? 'expenses-project-over-budget' : ''}`}
                                                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                            >
                                                <span className="expenses-project-progress-text">
                                                    {Math.round(budgetPercentage)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {expenses.length === 0 ? (
                                    <div className="expenses-project-no-expenses">
                                        <p>No expenses recorded for this project</p>
                                        <button
                                            className="expenses-project-add-expense-button"
                                            onClick={() => navigate("/manage-expense")}
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Add Expense
                                        </button>
                                    </div>
                                ) : viewMode === 'table' ? (
                                    <div className="expenses-project-table-container">
                                        <table className="expenses-project-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Item</th>
                                                    <th>Amount</th>
                                                    <th>Category</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenses.map((expense) => (
                                                    <tr key={expense._id} className="expenses-project-table-row">
                                                        <td>
                                                            <FontAwesomeIcon icon={faCalendarDay} className="expense-date-icon" />
                                                            {new Date(expense.payment_date).toLocaleDateString()}
                                                        </td>
                                                        <td>{expense.item}</td>
                                                        <td className="expenses-project-amount">
                                                            {formatCurrency(parseFloat(expense.amount.$numberDecimal))}
                                                        </td>
                                                        <td>
                                                            <span className="expenses-project-category">
                                                                <FontAwesomeIcon icon={faTags} />
                                                                {expense.head}
                                                            </span>
                                                        </td>
                                                        <td>{expense.description || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="expenses-project-total-row">
                                                    <td colSpan="2">Total Expenses</td>
                                                    <td className="expenses-project-total-amount">
                                                        {formatCurrency(totalExpenses)}
                                                    </td>
                                                    <td colSpan="2"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="expenses-project-cards-grid">
                                        {expenses.map((expense) => (
                                            <div key={expense._id} className="expenses-project-expense-card">
                                                <div className="expenses-project-expense-header">
                                                    <h4>{expense.item}</h4>
                                                    <span className="expenses-project-expense-amount">
                                                        {formatCurrency(parseFloat(expense.amount.$numberDecimal))}
                                                    </span>
                                                </div>
                                                <div className="expenses-project-expense-details">
                                                    <div className="expenses-project-expense-detail">
                                                        <FontAwesomeIcon icon={faCalendarDay} />
                                                        <span>{new Date(expense.payment_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="expenses-project-expense-detail">
                                                        <FontAwesomeIcon icon={faTags} />
                                                        <span>{expense.head}</span>
                                                    </div>
                                                    {expense.description && (
                                                        <div className="expenses-project-expense-notes">
                                                            <p>{expense.description}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="expenses-project-summary">
                                    <div className="expenses-project-summary-item">
                                        <span>Total Expenses:</span>
                                        <span className="expenses-project-summary-value">
                                            {formatCurrency(totalExpenses)}
                                        </span>
                                    </div>
                                    <div className="expenses-project-summary-item">
                                        <span>Remaining Budget:</span>
                                        <span className={`expenses-project-summary-value ${isOverBudget ? 'expenses-project-over-budget' : ''}`}>
                                            {formatCurrency(remainingBudget)}
                                            {isOverBudget && (
                                                <FontAwesomeIcon 
                                                    icon={faExclamationTriangle} 
                                                    className="expenses-project-warning-icon" 
                                                    title="Over budget"
                                                />
                                            )}
                                        </span>
                                    </div>
                                    <div className="expenses-project-summary-item">
                                        <span>Budget Utilization:</span>
                                        <span className="expenses-project-summary-value">
                                            {Math.round(budgetPercentage)}%
                                        </span>
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