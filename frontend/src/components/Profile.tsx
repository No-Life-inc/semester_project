import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { User } from "../types/type";

// Define the context value type
interface UserContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Profile: React.FC = () => {
    const { user } = useContext(UserContext) as UserContextValue; // Explicitly type the context value
    const navigate = useNavigate();

    console.log(user);

    return (
        <div>
            <h2>Profile</h2>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <button onClick={() => navigate("/edit-user")}>Edit Profile</button>
            <button onClick={() => navigate("/edit-password")}>Change Password</button>
        </div>
    );
};

export default Profile;
