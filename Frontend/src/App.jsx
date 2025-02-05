import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/slices/userSlice";
import { checkSession } from "./utils/api";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom"; // Import Router components
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import FacultyDashboard from "./pages/Faculty_dashboard";
import AddProjectForm from "./components/AddProjectForm";
import UpdateProjectFormPage from "./components/SimpleProjects/UpdateProject";
import AddSupervisorForm from "./components/Supervisor/AddSupervisorForm";
import AddSponsorProjectForm from "./components/Sponsor/AddSponsorshipForm";
import Navbar from "./components/NavBar";
import VenueAddForm from "./components/Venues/VenueAddForm"; 
import ExpenseAddForm from "./components/Expenses/ExpenseAddForm";
import NotFoundPage from "./pages/NotFoundPage";
import EquipmentAddForm from "./components/Equipment/EquipmentAddForm";
import FinanceBudgetAddForm from './components/FinanceBudget/FinanceBudgetAddForm'
import NotificationAddForm from "./components/Notification/NotificationAddForm";
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const user = await checkSession();
        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(clearUser()); // Clear if session is invalid
        }
      } catch (err) {
        dispatch(clearUser());
      }
    };

    fetchSession();
  }, [dispatch]);

  const buttonStyle = {
    margin: "1rem",
    padding: "10px 20px",
    backgroundColor: "#4e73df",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    display: "inline-block",
  };

  const hoverEffect = {
    backgroundColor: "#3757c1",
    transform: "translateY(-2px)",
  };

  return (
    <Router>
      <div>
        <nav>
          {/* Navigation for login/signup or home depending on session */}
          <ul style={{ listStyleType: "none", padding: 0, display: "flex", gap: "15px" }}>
            <Navbar/>
          </ul>
        </nav>
      </div>
      <Routes>
  <Route
    path="/"
    element={
      isLoggedIn ? (
        user.role === "admin" ? (
          <AdminPage />
        ) : (
          <FacultyDashboard />
        )
      ) : (
        <LoginPage />
      )
    }
  />
  <Route path="/add-project" element={<AddProjectForm />} />
  <Route path="/update-project" element={<UpdateProjectFormPage />} />
  <Route path="/update-supervisor" element={<AddSupervisorForm />} />
  <Route path="/manage-sponsor" element={<AddSponsorProjectForm />} />
  <Route path="/edit-venue" element={<VenueAddForm/>} />
  <Route path="/manage-equipment" element={<EquipmentAddForm/>} />
  <Route path="/manage-expense" element={<ExpenseAddForm/>} />
  <Route path="/manage-financebudget" element={<FinanceBudgetAddForm/>} />
  <Route path="/manage-notification" element={<NotificationAddForm/>} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>

    </Router>
  );
}

export default App;
