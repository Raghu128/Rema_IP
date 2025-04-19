import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { loginUser } from "../utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faLock, faSignInAlt, 
  faEnvelope, faEye, faEyeSlash 
} from '@fortawesome/free-solid-svg-icons';
import RemaLoader from '../components/RemaLoader';
import '../styles/loginPage.css';

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const user = await loginUser({ email, password });
            dispatch(setUser(user));
            window.location.href = "/";
        } catch (err) {``            
            
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginPage-container">
            <div className="loginPage-card">
                <div className="loginPage-header">
                    <div className="loginPage-logo">
                        <FontAwesomeIcon icon={faUser} className="loginPage-logo-icon" />
                    </div>
                    <h1 className="loginPage-title">Welcome Back</h1>
                    <p className="loginPage-subtitle">Sign in to your account</p>
                </div>

                {loading ? (
                    <div className="loginPage-loader">
                        <RemaLoader />
                    </div>
                ) : (
                    <form className="loginPage-form" onSubmit={handleLogin}>
                        {error && (
                            <div className="loginPage-error">
                                {error}
                            </div>
                        )}

                        <div className="loginPage-input-group">
                            <label htmlFor="email" className="loginPage-input-label">
                                Email Address
                            </label>
                            <div className="loginPage-input-wrapper">
                                <FontAwesomeIcon icon={faEnvelope} className="loginPage-input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="loginPage-input"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="loginPage-input-group">
                            <label htmlFor="password" className="loginPage-input-label">
                                Password
                            </label>
                            <div className="loginPage-input-wrapper">
                                <FontAwesomeIcon icon={faLock} className="loginPage-input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="loginPage-input"
                                    disabled={loading}
                                />
                                <FontAwesomeIcon 
                                    icon={showPassword ? faEyeSlash : faEye} 
                                    className="loginPage-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <div className="loginPage-options">
                            <div className="loginPage-remember">
                                <input type="checkbox" id="remember" className="loginPage-checkbox" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="/forgot-password" className="loginPage-forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        <button 
                            type="submit" 
                            className="loginPage-button"
                            disabled={loading || !email || !password}
                        >
                            <FontAwesomeIcon icon={faSignInAlt} className="loginPage-button-icon" />
                            Sign In
                        </button>

                    </form>
                )}
            </div>
        </div>
    );
}

export default LoginPage;