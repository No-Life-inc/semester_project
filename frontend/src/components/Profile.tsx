import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import CreateCollection from "./CreateCollection";
import { User } from "../types/type";
import DisplayTag from "./DisplayTag";
import CreateTag from "./CreateTag";
import { Tag } from "../types/type";
import { getAllTags, deleteTagById } from "../services/apiClient";


interface UserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Profile: React.FC = () => {
  const { user } = useContext(UserContext) as UserContextValue;
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

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
    } catch (err) {
      console.error("Error updating tags:", err);
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagById(id);
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
    } catch (err) {
      console.error("Error deleting tag:", err);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <button onClick={() => navigate("/edit-user")}>Edit Profile</button>
      <button onClick={() => navigate("/edit-password")}>Change Password</button>
      <hr />
      <CreateCollection onSuccess={(message) => setSuccessMessage(message)} />
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <CreateTag onTagCreated={handleTagCreated} />
      <DisplayTag tags={tags} onDeleteTag={handleDeleteTag} />
    </div>
  );
};

export default Profile;
