import React, { useState, useEffect } from "react";
import axios from "axios";

const FinanceBudgetAddForm = () => {
  const [formData, setFormData] = useState({
    srp_id: "",
    year: "",
    manpower: "",
    pi_compenstion: "",
    equipment: "",
    travel: "",
    expenses: "",
    outsourcing: "",
    contingency: "",
    consumable: "",
    others: "",
    overhead: "",
    gst: "",
    status: "pending", // Default status
  });

  const [sponsorProjects, setSponsorProjects] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch sponsor projects
  useEffect(() => {
    const fetchSponsorProjects = async () => {
      try {
        const response = await axios.get("/api/v1/sponsor-projects"); // Replace with your sponsor project API endpoint
        setSponsorProjects(response.data);
      } catch (error) {
        console.error("Error fetching sponsor projects:", error);
        setMessage("Failed to fetch sponsor projects.");
      }
    };

    fetchSponsorProjects();
  }, []);

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
      const response = await axios.post("/api/v1/finance-budgets", formData); // Replace with your finance budget add API endpoint
      setMessage(`Finance Budget added successfully for ${response.data.year}`);
      // Reset form
      setFormData({
        srp_id: "",
        year: "",
        manpower: "",
        pi_compenstion: "",
        equipment: "",
        travel: "",
        expenses: "",
        outsourcing: "",
        contingency: "",
        consumable: "",
        others: "",
        overhead: "",
        gst: "",
        status: "pending", // Default status
      });
    } catch (error) {
      console.error("Error adding finance budget:", error);
      setMessage(error.response?.data?.message || "Failed to add finance budget.");
    }
  };

  return (
    <div>
      <h2>Add Finance Budget</h2>
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
                {project.name} (ID: {project._id})
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            max="2099"
            required
          />
        </div>

        {/* Budget Fields */}
        <div>
          <label htmlFor="manpower">Manpower:</label>
          <input
            type="number"
            id="manpower"
            name="manpower"
            value={formData.manpower}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="pi_compenstion">PI Compensation:</label>
          <input
            type="number"
            id="pi_compenstion"
            name="pi_compenstion"
            value={formData.pi_compenstion}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="equipment">Equipment:</label>
          <input
            type="number"
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="travel">Travel:</label>
          <input
            type="number"
            id="travel"
            name="travel"
            value={formData.travel}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="expenses">Expenses:</label>
          <input
            type="number"
            id="expenses"
            name="expenses"
            value={formData.expenses}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="outsourcing">Outsourcing:</label>
          <input
            type="number"
            id="outsourcing"
            name="outsourcing"
            value={formData.outsourcing}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="contingency">Contingency:</label>
          <input
            type="number"
            id="contingency"
            name="contingency"
            value={formData.contingency}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="consumable">Consumable:</label>
          <input
            type="number"
            id="consumable"
            name="consumable"
            value={formData.consumable}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="others">Others:</label>
          <input
            type="number"
            id="others"
            name="others"
            value={formData.others}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="overhead">Overhead:</label>
          <input
            type="number"
            id="overhead"
            name="overhead"
            value={formData.overhead}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        <div>
          <label htmlFor="gst">GST:</label>
          <input
            type="number"
            id="gst"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">Add Finance Budget</button>
      </form>
    </div>
  );
};

export default FinanceBudgetAddForm;
