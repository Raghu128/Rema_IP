import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faKey, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import '../styles/ResetPassword.css';
import Loader from "../components/Loader";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        // Simple password strength calculation
        let strength = 0;
        if (value.length > 0) strength += 1;
        if (value.length >= 8) strength += 1;
        if (/[A-Z]/.test(value)) strength += 1;
        if (/[0-9]/.test(value)) strength += 1;
        if (/[^A-Za-z0-9]/.test(value)) strength += 1;
        setPasswordStrength(strength);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to reset your password?");
        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            const response = await resetPassword(token, newPassword);
            setMessage(response.message);
            setIsDisabled(true);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <FontAwesomeIcon icon={faKey} className="header-icon" />
                    <h2>Reset Your Password</h2>
                    <p>Create a new password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                required
                                disabled={isDisabled || isLoading}
                                className={passwordStrength > 0 ? "has-value" : ""}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        {passwordStrength > 0 && (
                            <div className="password-strength">
                                <div className="strength-meter">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`strength-bar ${passwordStrength >= level ? 'active' : ''}`}
                                            style={{ backgroundColor: passwordStrength >= level ? 
                                                (passwordStrength < 3 ? '#ff4d4d' : 
                                                 passwordStrength < 5 ? '#ffcc00' : '#4CAF50') : '#e0e0e0' }}
                                        />
                                    ))}
                                </div>
                                <div className="strength-text">
                                    {passwordStrength < 3 ? 'Weak' : 
                                     passwordStrength < 5 ? 'Moderate' : 'Strong'}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isDisabled || isLoading || newPassword.length < 8}
                        className="reset-button"
                    >
                        {isLoading ? (
                            <Loader text="Resetting..." />
                        ) : isDisabled ? (
                            <>
                                <FontAwesomeIcon icon={faCheckCircle} /> Password Reset
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`message ${isDisabled ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="password-tips">
                    <h4>Password Requirements:</h4>
                    <ul>
                        <li className={newPassword.length >= 8 ? 'met' : ''}>
                            Minimum 8 characters
                        </li>
                        <li className={/[A-Z]/.test(newPassword) ? 'met' : ''}>
                            At least one uppercase letter
                        </li>
                        <li className={/[0-9]/.test(newPassword) ? 'met' : ''}>
                            At least one number
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'met' : ''}>
                            At least one special character
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;