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
  const { user, setUser } = useContext(UserContext) as UserContextValue; // Explicitly type the context value
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [success, setSuccess] = useState<string | null>(null); // State for success messages
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    try {
      const token = localStorage.getItem("token"); // Assume JWT token stored in localStorage.
      const response = await axios.patch(
        "http://localhost:5000/v1/user/editUser",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update context with the new user data
      if (user && setUser) {
        setUser({ ...user, name, email });
      }

      setSuccess("User details updated successfully!");
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred while updating details.");
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save Changes</button>
      </form>

      {/* Display success or error messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <button onClick={() => navigate("/profile")}>Return to Profile</button>
    </div>
  );
};

export default EditUser;
