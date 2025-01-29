import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { loginUser } from "../utils/api"; // API function to hit the login endpoint
import '../styles/loginPage.css';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser({ email, password });
      
      // If login is successful, set the user info in Redux store
      dispatch(setUser(user));
      console.log(user);

      // Redirect to the appropriate dashboard based on the role (admin or user)
      
      window.location.href = "/"; // User dashboard
      
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="loginpage-container">
      <h1 className="loginpage-title">Login</h1>
      <form className="loginpage-form" onSubmit={handleLogin}>
        <div className="loginpage-input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="loginpage-input"
          />
        </div>
        <div className="loginpage-input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="loginpage-input"
          />
        </div>
        {error && <p className="loginpage-error">{error}</p>}
        <button type="submit" className="loginpage-button">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
