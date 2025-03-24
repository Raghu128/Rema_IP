import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Expenses/ExpensesList.css";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faSearch, faMoneyBillWave, faFileInvoiceDollar, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


const ExpensesList = () => {
    const { user } = useSelector((state) => state.user);
    const [expenseData, setExpenseData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
    const filteredExpenses = expenseData.filter(({ sponsorProject }) =>
        sponsorProject.agency.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user?.id) return <p className="expenses-list-message">Please log in to view expenses.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="expenses-list-message">{error}</p>;

    return (
        <div className="expenses-list-container">
             <div className="expenses-list-header">
                <h2 className="expenses-list-title">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="expenses-list-title-icon" /> User Expenses
                </h2>
                <button onClick={() => navigate("/manage-expense")} className="manage-expense-btn">
                <FontAwesomeIcon icon={faEdit} /> Manage
                </button>
            </div>

            {/* Search Bar */}
            <div className="expenses-search-bar">
                <FontAwesomeIcon icon={faSearch} className="expenses-search-icon" />
                <input
                    type="text"
                    placeholder="Search by agency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            

            {filteredExpenses.length === 0 ? (
                <p className="expenses-list-message">No expenses found.</p>
            ) : (
                <div className="expenses-list-content">
                    {filteredExpenses.map(({ sponsorProject, expenses }) => {
                        const totalExpenses = expenses.reduce(
                            (sum, expense) => sum + parseFloat(expense.amount.$numberDecimal),
                            0
                        );
                        const budget = parseFloat(sponsorProject.budget.$numberDecimal);
                        const remainingBudget = budget - totalExpenses;

                        return (
                            <div key={sponsorProject.id} className="expenses-project-section">
                                <h3 className="expenses-list-project">
                                    {sponsorProject.title} <span>({sponsorProject.agency})</span>
                                </h3>
                                <p className="expenses-list-budget">
                                    <FontAwesomeIcon icon={faMoneyBillWave} />  <strong>Budget:</strong> ₹{budget.toFixed(2)}
                                </p>

                                {expenses.length === 0 ? (
                                    <p className="expenses-list-no-expense">No expenses recorded for this project.</p>
                                ) : (
                                    <table className="expenses-table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Amount (₹)</th>
                                                <th>Head</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.map((expense) => (
                                                <tr key={expense._id}>
                                                    <td>{expense.item}</td>
                                                    <td>{parseFloat(expense.amount.$numberDecimal).toFixed(2)}</td>
                                                    <td>{expense.head}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                         <tfoot>
                                            <tr className="total-expenses-row">
                                              <td><strong>Total</strong></td>
                                              <td><strong>₹{totalExpenses.toFixed(2)}</strong></td>
                                              <td></td>
                                            </tr>
                                          </tfoot>
                                    </table>
                                )}

                                {/* Total Expenses & Remaining Budget */}
                                <div className="total-expenses-section">

                                    <p className={remainingBudget < 0 ? "over-budget" : "within-budget"}>
                                        {remainingBudget < 0 ? <FontAwesomeIcon icon={faExclamationTriangle} /> : <FontAwesomeIcon icon={faMoneyBillWave} />} <strong>Remaining Budget:</strong> ₹{remainingBudget.toFixed(2)}
                                    </p>
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