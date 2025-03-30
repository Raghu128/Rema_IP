import React, { useState } from "react";
import { sendPasswordReset } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import '../styles/ForgotPassword.css';
import Loader from "../components/Loader";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await sendPasswordReset(email);
            setMessage(response.message);
            setIsSuccess(true);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error sending reset link. Please try again.");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <div className="password-icon">
                        <FontAwesomeIcon icon={isSuccess ? faCheckCircle : faEnvelope} />
                    </div>
                    <h2>Reset Your Password</h2>
                    <p>
                        {isSuccess 
                            ? "Check your email for further instructions" 
                            : "Enter your email to receive a password reset link"}
                    </p>
                </div>

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || !email}
                            className="submit-button"
                        >
                            {isLoading ? (
                                <Loader text="Sending..." />
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                    Send Reset Link
                                </>
                            )}
                        </button>
                    </form>
                ) : null}

                {message && (
                    <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="forgot-password-footer">
                    <p>Remember your password? <a href="/">Sign in</a></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;