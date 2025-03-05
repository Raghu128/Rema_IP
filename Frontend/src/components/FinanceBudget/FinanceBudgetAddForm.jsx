import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/FinanceBudget/financebudget.css';

const FinanceBudgetAddForm = () => {
  const navigate = useNavigate();
  const { srp_id } = useParams();
  const [formData, setFormData] = useState({
    srp_id: srp_id,
    year: "",
    manpower: "",
    pi_compensation: "",
    equipment: "",
    travel: "",
    expenses: "",
    outsourcing: "",
    contingency: "",
    consumable: "",
    others: "",
    overhead: "",
    gst: "",
    status: "pending",
  });

  const { user } = useSelector((state) => state.user);
  const [sponsorProjects, setSponsorProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if user is null
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSponsorProjects = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
        setSponsorProjects(response.data);
      } catch (error) {
        console.error("Error fetching sponsor projects:", error);
        setMessage("Failed to fetch sponsor projects.");
      }
    };

    fetchSponsorProjects();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);    
    try {
      const response = await axios.post("/api/v1/finance-budgets", formData);
      setMessage(`Finance Budget added successfully for ${response.data.year}`);
      setFormData({
        srp_id: "",
        year: "",
        manpower: "",
        pi_compensation: "",
        equipment: "",
        travel: "",
        expenses: "",
        outsourcing: "",
        contingency: "",
        consumable: "",
        others: "",
        overhead: "",
        gst: "",
        status: "pending",
      });
    } catch (error) {
      console.error("Error adding finance budget:", error);
      setMessage(error.response?.data?.message || "Failed to add finance budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financebudget-container">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="financebudget-header">Add Finance Budget</h2>
      {message && <p className="financebudget-message">{message}</p>}
      <form className="financebudget-form" onSubmit={handleSubmit}>
        {/* <div className="financebudget-field">
          <label htmlFor="srp_id">Sponsor Project:</label>
          <select
            id="srp_id"
            name="srp_id"
            className="financebudget-input"
            value={formData.srp_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Sponsor Project</option>
            {sponsorProjects.length > 0 ? (
              sponsorProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name} (agency: {project.agency})
                </option>
              ))
            ) : (
              <option disabled>No projects available</option>
            )}
          </select>
        </div> */}

        <div className="financebudget-field">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            className="financebudget-input"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>

        {[
          "manpower",
          "pi_compensation",
          "equipment",
          "travel",
          "expenses",
          "outsourcing",
          "contingency",
          "consumable",
          "others",
          "overhead",
          "gst",
        ].map((field) => (
          <div key={field} className="financebudget-field">
            <label htmlFor={field}>{field.replace(/_/g, " ").toUpperCase()}:</label>
            <input
              type="number"
              id={field}
              name={field}
              className="financebudget-input"
              value={formData[field]}
              onChange={handleChange}
              min="0"
              step="any"
            />
          </div>
        ))}

        <div className="financebudget-field">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            className="financebudget-input"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button
          type="submit"
          className="financebudget-submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Finance Budget"}
        </button>
      </form>
    </div>
  );
};

export default FinanceBudgetAddForm;
