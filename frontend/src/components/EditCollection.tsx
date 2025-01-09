// EditCollection.tsx
import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Collection } from "../types/type";

interface EditCollectionProps {
    collection: Collection;
    onUpdate: () => void; // Callback to refresh the collections after editing
    onCancel: () => void; // Callback to cancel editing
}

const EditCollection: React.FC<EditCollectionProps> = ({ collection, onUpdate, onCancel }) => {
    const [name, setName] = useState<string>(collection.name);
    const [error, setError] = useState<string | null>(null);

    const handleEditCollection = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
    
        if (!name) {
            setError("Collection name is required.");
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing. Please log in again.");
                return;
            }
    
            const response = await axios.put(
                `http://localhost:5000/v1/collection/${collection.id}`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            onUpdate(); // Send opdateret collection til CreateCollection
        } catch (error: any) {
            setError(error.response?.data?.message || "An error occurred while editing the collection.");
        }
    };

    return (
        <div data-testid="edit-collection-container">
            <h3 id="edit-collection-header" data-testid="edit-collection-header">Edit Collection</h3>
            <form onSubmit={handleEditCollection} data-testid="edit-collection-form">
                <input
                    type="text"
                    placeholder="Collection Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="edit-collection-input"
                />
                <button type="submit" data-testid="save-collection-button">Save</button>
                <button type="button" onClick={onCancel} data-testid="cancel-edit-button">
                    Cancel
                </button>
            </form>
            {error && <p style={{ color: "red" }} data-testid="edit-collection-error">{error}</p>}
        </div>
    );
    
};

export default EditCollection;
