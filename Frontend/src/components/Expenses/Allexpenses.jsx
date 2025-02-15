import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Expenses/ExpensesList.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const ExpensesList = () => {
  const { user } = useSelector((state) => state.user);
  const [expenseData, setExpenseData] = useState([]);
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

  if (!user?.id) return <p className="expenses-list-message">Please log in to view expenses.</p>;
  if (loading) return <p className="expenses-list-message">Loading expenses...</p>;
  if (error) return <p className="expenses-list-message">{error}</p>;

  return (
    <div className="expenses-list-container">
      <button onClick={() => navigate("/manage-expense")} className="manage-expense-btn">
        Manage Expenses
      </button>

      <h2 className="expenses-list-title">User Expenses</h2>

      {expenseData.length === 0 ? (
        <p className="expenses-list-message">No expenses found.</p>
      ) : (
        <div>
          {expenseData.map(({ sponsorProject, expenses }) => (
            <div key={sponsorProject.id} className="expenses-project-section">
              <h3 className="expenses-list-project">
                {sponsorProject.title} <span>({sponsorProject.agency})</span>
              </h3>
              <p className="expenses-list-budget">
                <strong>Budget:</strong> ₹{parseFloat(sponsorProject.budget.$numberDecimal).toFixed(2)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
