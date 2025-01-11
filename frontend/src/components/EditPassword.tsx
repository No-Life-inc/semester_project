import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditPassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null); 
    const [success, setSuccess] = useState<string | null>(null); 
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); 
        setSuccess(null); 
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing. Please log in again.");
                return;
            }

            const response = await axios.patch(
                "http://localhost:5000/v1/user/editPassword",
                { oldPassword, password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setSuccess(response.data.message || "Password updated successfully!");
            setError(null); 
        } catch (error: any) {
            setError(error.response?.data?.error || "An error occurred while updating the password.");
        }
    };

    return (
        <div data-testid="change-password-container">
            <h2 id="change-password-header" data-testid="change-password-header">Change Password</h2>
            <form onSubmit={handleSubmit} data-testid="change-password-form">
                <label>
                    Old Password:
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        data-testid="old-password-input"
                    />
                </label>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        data-testid="new-password-input"
                    />
                </label>
                <button type="submit" data-testid="save-changes-button">Save Changes</button>
            </form>
    
            {error && <p style={{ color: "red" }} data-testid="change-password-error">{error}</p>}
            {success && <p style={{ color: "green" }} data-testid="change-password-success">{success}</p>}
    
            <button onClick={() => navigate("/profile")} data-testid="return-to-profile-button">
                Return to Profile
            </button>
        </div>
    );
    
};

export default EditPassword;
