import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/slices/userSlice";
import { checkSession } from "./utils/api";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import FacultyDashboard from "./pages/Faculty_dashboard";
import UpdateProjectFormPage from "./components/SimpleProjects/UpdateProject";
import AddSupervisorForm from "./components/Supervisor/AddSupervisorForm";
import AddSponsorProjectForm from "./components/Sponsor/AddSponsorshipForm";
import Navbar from "./components/NavBar";
import VenueAddForm from "./components/Venues/VenueAddForm";
import ExpenseAddForm from "./components/Expenses/ExpenseAddForm";
import NotFoundPage from "./pages/NotFoundPage";
import EquipmentAddForm from "./components/Equipment/EquipmentAddForm";
import FinanceBudgetAddForm from './components/FinanceBudget/FinanceBudgetAddForm';
import NotificationAddForm from "./components/Notification/NotificationAddForm";
import AddLeaveForm from "./components/Leaves/LeavesForm";
import StudentDashboard from "./pages/Student_dashboard";
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const location = useLocation(); 

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const user = await checkSession();
        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        dispatch(clearUser());
      }
    };

    fetchSession();
  }, [dispatch]);

  return (
    <>
      {/* ✅ Show Navbar only on the home route */}
      {location.pathname === "/" && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              user.role === "admin" ? (
                <AdminPage />
              ) : user.role === "faculty" ? (
                <FacultyDashboard />
              ) : (
                <StudentDashboard />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/update-project" element={<UpdateProjectFormPage />} />
        <Route path="/update-supervisor" element={<AddSupervisorForm />} />
        <Route path="/manage-sponsor" element={<AddSponsorProjectForm />} />
        <Route path="/edit-venue" element={<VenueAddForm />} />
        <Route path="/manage-equipment" element={<EquipmentAddForm />} />
        <Route path="/manage-expense" element={<ExpenseAddForm />} />
        <Route path="/manage-financebudget/:srp_id" element={<FinanceBudgetAddForm />} />
        <Route path="/manage-leaves" element={<AddLeaveForm />} />
        <Route path="/manage-notification" element={<NotificationAddForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
