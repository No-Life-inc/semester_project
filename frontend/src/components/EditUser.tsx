import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../types/type";
import { UserContext } from "../context/UserContext";

// Define the context value type
interface UserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const EditUser: React.FC = () => {
  const { user, setUser } = useContext(UserContext) as UserContextValue; 
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [error, setError] = useState<string | null>(null); 
  const [success, setSuccess] = useState<string | null>(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); 
    setSuccess(null); 

    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.patch(
        "http://localhost:5000/v1/user/editUser",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update context with the new user data
      if (user && setUser) {
        setUser({ ...user, name, email });
        localStorage.setItem('user', JSON.stringify({ ...user, name, email }));
      }

      setSuccess("User details updated successfully!");
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred while updating details.");
    }
  };

  return (
    <div data-testid="edit-profile-container">
        <h2 id="edit-profile-header" data-testid="edit-profile-header">Edit Profile</h2>
        <form onSubmit={handleSubmit} data-testid="edit-profile-form">
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    data-testid="edit-profile-name-input"
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="edit-profile-email-input"
                />
            </label>
            <button type="submit" data-testid="save-profile-changes-button">Save Changes</button>
        </form>

        {error && <p style={{ color: "red" }} data-testid="edit-profile-error">{error}</p>}
        {success && <p style={{ color: "green" }} data-testid="edit-profile-success">{success}</p>}

        <button onClick={() => navigate("/profile")} data-testid="return-to-profile-button">
            Return to Profile
        </button>
    </div>
);

};

export default EditUser;
