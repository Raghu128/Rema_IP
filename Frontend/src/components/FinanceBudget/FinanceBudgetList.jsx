import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/FinanceBudget/FinanceBudgetList.css'
import { useNavigate } from "react-router-dom";

const FinanceBudgetList = () => {
  const [financeBudgets, setFinanceBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFinanceBudgets = async () => {
      try {
        if (!user?.id) return;

        // Fetch finance budgets using faculty_id
        const financeResponse = await axios.get(`/api/v1/finance-budgets/${user.id}`);

        // Flatten the array of arrays
        const flattenedBudgets = financeResponse.data.financeBudgets.flat();
        
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
  }, [user]);

  return (
    <div className="financebudgetlist-container">
      <h2 className="financebudgetlist-title">Finance Budgets</h2>
      <button onClick={() => navigate("/manage-financebudget")}>Manage</button>
      {loading && <p className="financebudgetlist-loading">Loading...</p>}
      {error && <p className="financebudgetlist-error">{error}</p>}
      {!loading && financeBudgets.length === 0 && (
        <p className="financebudgetlist-no-data">No finance budgets found.</p>
      )}
      {financeBudgets.length > 0 && (
        <div className="financebudgetlist-table-wrapper">
          <table className="financebudgetlist-table">
            <thead>
              <tr>
                <th>Agency</th>
                <th>Title</th>
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
                  <td>{budget.agency}</td>
                  <td>{budget.title}</td>
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
                  <td>{budget.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinanceBudgetList;
