import React from "react";
import { Collection } from "../types/type";

interface DisplayCollectionsProps {
    collections: Collection[];
    onEdit: (collection: Collection) => void; // Callback for edit button
    onDelete: (collectionId: number) => void; // Callback for delete button
}

const DisplayCollection: React.FC<DisplayCollectionsProps> = ({ collections, onEdit, onDelete }) => {
    return (
        <div>
            <h3>Your Collections:</h3>
            {collections.length > 0 ? (
                <ul>
                    {collections.map((collection) => (
                        <li key={collection.id}>
                            <strong>{collection.name}</strong>
                            <button onClick={() => onEdit(collection)}>Edit</button>
                            <button onClick={() => onDelete(collection.id)}>Delete</button> {/* Slet knap */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No collections found.</p>
            )}
        </div>
    );
};

export default DisplayCollection;
