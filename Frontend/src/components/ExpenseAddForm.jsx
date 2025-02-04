import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ExpenseAddForm = () => {
  const [formData, setFormData] = useState({
    srp_id: "",
    item: "",
    amount: "",
    head: "",
    payment_date: "",
  });

  const [sponsorProjects, setSponsorProjects] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);

  // Fetch sponsor projects
  useEffect(() => {
    const fetchSponsorProjects = async () => {
      try {
        const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`); // Replace with your sponsor project API endpoint
        setSponsorProjects(response.data);
        setMessage("");
      } catch (error) {
        console.error("Error fetching sponsor projects:", error);
        setMessage("Failed to fetch sponsor projects.");
      }
    };

    if(user?.id)fetchSponsorProjects();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/expenses", formData); // Replace with your expense-add API endpoint
      setMessage(`Expense added successfully: ${response.data.item}`);
      // Reset form
      setFormData({
        srp_id: "",
        item: "",
        amount: "",
        head: "",
        payment_date: "",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      setMessage(error.response?.data?.message || "Failed to add expense.");
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Sponsor Project */}
        <div>
          <label htmlFor="srp_id">Sponsor Project:</label>
          <select
            id="srp_id"
            name="srp_id"
            value={formData.srp_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Sponsor Project</option>
            {sponsorProjects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.agency} 
              </option>
            ))}
          </select>
        </div>

        {/* Item */}
        <div>
          <label htmlFor="item">Item:</label>
          <input
            type="text"
            id="item"
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        {/* Head */}
        <div>
          <label htmlFor="head">Head:</label>
          <input
            type="text"
            id="head"
            name="head"
            value={formData.head}
            onChange={handleChange}
          />
        </div>

        {/* Payment Date */}
        <div>
          <label htmlFor="payment_date">Payment Date:</label>
          <input
            type="date"
            id="payment_date"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseAddForm;
