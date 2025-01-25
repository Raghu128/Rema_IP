import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/slices/userSlice";
import { checkSession } from "./utils/api";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom"; // Import Router components
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
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
                {/* Uncomment for Sign Up */}
                {/* <li>
                  <Link
                    to="/signup"
                    style={buttonStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, hoverEffect)}
                    onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                  >
                    Sign Up
                  </Link>
                </li> */}
              </>
            ) : (
              <li>
                <Link
                  to="/home"
                  style={buttonStyle}
                  onMouseEnter={(e) => Object.assign(e.target.style, hoverEffect)}
                  onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                >
                  Home
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} /> {/* HomePage for logged-in users */}
      </Routes>
    </Router>
  );
}

export default App;
