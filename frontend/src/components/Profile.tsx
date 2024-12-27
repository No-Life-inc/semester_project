import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import CreateCollection from "./CreateCollection";
import { User } from "../types/type";

interface UserContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Profile: React.FC = () => {
    const { user } = useContext(UserContext) as UserContextValue;
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        </div>
    );
};

export default Profile;
