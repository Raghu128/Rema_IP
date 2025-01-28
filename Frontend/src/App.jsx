import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/slices/userSlice";
import { checkSession } from "./utils/api";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom"; // Import Router components
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import FacultyPage from "./pages/FacultyEditPage";
import FacultyDashboard from "./pages/Faculty_dashboard";
import AddProjectForm from "./components/AddProjectForm";
import UpdateProjectFormPage from "./components/SimpleProjects/UpdateProject";
import AddSupervisorForm from "./components/Students/AddSupervisorForm";
import Navbar from "./components/NavBar";
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
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/login"
                    style={buttonStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, hoverEffect)}
                    onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                  >
                    Login
                  </Link>
                </li>
      
              </>
            ) : (
              <li>
                  <Navbar/>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/faculty_dashboard" element={<FacultyDashboard />} />
        <Route path="/add-project" element={<AddProjectForm />} />
        <Route path="/update-project" element={<UpdateProjectFormPage />} />
        <Route path="/update-supervisor" element={<AddSupervisorForm />} />
      </Routes>
    </Router>
  );
}

export default App;
