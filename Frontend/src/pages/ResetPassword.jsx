import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import '../styles/ResetPassword.css';
import Loader from "../components/Loader";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);  // Toggle password visibility

    const handleSubmit = async (e) => {
        const isConfirmed = window.confirm("Are you sure you want to reset your password?");
    if (!isConfirmed) return;  // Stop execution if user cancels
    
        e.preventDefault();

        setIsLoading(true);
        try {
            const response = await resetPassword(token, newPassword);
            setMessage(response.message);
            setIsDisabled(true);
        } catch (error) {
            setMessage("Error resetting password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter new password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        disabled={isDisabled || isLoading} 
                    />
                    <FontAwesomeIcon 
                        icon={showPassword ? faEyeSlash : faEye} 
                        className="icon toggle-icon" 
                        onClick={() => setShowPassword(!showPassword)} 
                    />
                </div>
                <button type="submit" disabled={isDisabled || isLoading}>
                    {isLoading ? <Loader text="Resetting" /> : "Reset Password"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPassword;
