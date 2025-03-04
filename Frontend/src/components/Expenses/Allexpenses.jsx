import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Expenses/ExpensesList.css";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader'

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
  if (loading) return <Loader/>;
  if (error) return <p className="expenses-list-message">{error}</p>;

  return (
    <div className="expenses-list-container">
      <button onClick={() => navigate("/manage-expense")} className="manage-expense-btn">
        Manage
      </button>

      <h2 className="expenses-list-title">User Expenses</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by agency..."
        className="expenses-search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredExpenses.length === 0 ? (
        <p className="expenses-list-message">No expenses found.</p>
      ) : (
        <div>
          {filteredExpenses.map(({ sponsorProject, expenses }) => {
            // Calculate total expenses for this project
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
                  <strong>Budget:</strong> ₹{budget.toFixed(2)}
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
                  </table>
                )}

                {/* Total Expenses & Remaining Budget */}
                <div className="total-expenses-section">
                  <p>
                    <strong>Total Expenses:</strong> ₹{totalExpenses.toFixed(2)}
                  </p>
                  <p className={remainingBudget < 0 ? "over-budget" : "within-budget"}>
                    <strong>Remaining Budget:</strong> ₹{remainingBudget.toFixed(2)}
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
