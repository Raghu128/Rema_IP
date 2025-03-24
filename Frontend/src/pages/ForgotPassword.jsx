import React, { useState } from "react";
import { sendPasswordReset } from "../utils/api";
import '../styles/ForgotPassword.css';
import Loader from "../components/Loader";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start loader
        try {
            const response = await sendPasswordReset(email);
            setMessage(response.message);
        } catch (error) {
            setMessage("Error sending reset link.");
        } finally {
            setIsLoading(false);  // Stop loader
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={isLoading} // Disable input while sending
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader text="Sending Reset Link"/> : "Send Reset Link"} {/* Show loader */}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPassword;
