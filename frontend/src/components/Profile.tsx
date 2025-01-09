import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import CreateCollection from "./CreateCollection";
import { User } from "../types/type";
import DisplayTag from "./DisplayTag";
import CreateTag from "./CreateTag";
import { Tag } from "../types/type";
import { getAllTags } from "../services/apiClient";


interface UserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Profile: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const userFromStorage: User = storedUser ? JSON.parse(storedUser) : null;
  const user  = userFromStorage
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const allTags = await getAllTags();
        setTags(allTags);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  const handleTagCreated = async () => {
    try {
      const allTags = await getAllTags();
      setTags(allTags);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        // Show the error message from the API response
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred while fething tags. Please try again.');
      }
    }
  };

  return (
    <div data-testid="profile-container">
        <h2 data-testid="profile-header">Profile</h2>
        <p data-testid="profile-name">Name: {user?.name}</p>
        <p data-testid="profile-email">Email: {user?.email}</p>
        <button
            onClick={() => navigate("/edit-user")}
            data-testid="edit-profile-button"
        >
            Edit Profile
        </button>
        <button
            onClick={() => navigate("/edit-password")}
            data-testid="change-password-button"
        >
            Change Password
        </button>
        <hr />
        <CreateCollection
            onSuccess={(message) => setSuccessMessage(message)}
            data-testid="create-collection-component"
        />
        {successMessage && (
            <p style={{ color: "green" }} data-testid="success-message">
                {successMessage}
            </p>
        )}
        <CreateTag
            onTagCreated={handleTagCreated}
            data-testid="create-tag-component"
        />
        <DisplayTag
            tags={tags}
            data-testid="display-tag-component"
        />
    </div>
);

};

export default Profile;
