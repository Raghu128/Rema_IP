import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { loginUser } from "../utils/api";
import '../styles/loginPage.css';
import RemaLoader from '../components/RemaLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError("");    // Clear any previous errors

        try {
            const user = await loginUser({ email, password });
            dispatch(setUser(user));
            window.location.href = "/"; // Redirect after successful login
        } catch (err) {
            setError("Invalid credentials");
        } finally {
            setLoading(false); // Stop loading, regardless of success/failure
        }
    };

    return (
        <div className="loginpage-container">
            <h1 className="loginpage-title"><FontAwesomeIcon icon={faUser} className="loginpage-icon"/> Login</h1>
            {loading && <RemaLoader />} {/* Display Loader when loading */}
            {!loading && (
                <form className="loginpage-form" onSubmit={handleLogin}>
                    <div className="loginpage-input-group">
                        <label htmlFor="email"><FontAwesomeIcon icon={faUser} /></label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="loginpage-input"
                        />
                    </div>
                    <div className="loginpage-input-group">
                         <label htmlFor="password"><FontAwesomeIcon icon={faLock} /></label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="loginpage-input"
                        />
                    </div>
                    {error && <p className="loginpage-error">{error}</p>}
                    <button type="submit" className="loginpage-button">
                        <FontAwesomeIcon icon={faSignInAlt} /> Login
                    </button>
                </form>
            )}
        </div>
    );
}

export default LoginPage;