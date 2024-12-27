import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditPassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null); // Error state for error messages
    const [success, setSuccess] = useState<string | null>(null); // Success state for success messages
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous success messages

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
            setError(null); // Clear any error messages
            setTimeout(() => navigate("/profile"), 2000); // Redirect after 2 seconds
        } catch (error: any) {
            // Handle backend error messages
            setError(error.response?.data?.message || "An error occurred while updating the password.");
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Old Password:
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>

            {/* Display error or success messages */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <button onClick={() => navigate("/profile")}>Return to Profile</button>
        </div>
    );
};

export default EditPassword;
