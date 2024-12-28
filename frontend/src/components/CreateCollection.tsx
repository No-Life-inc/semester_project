// CreateCollection.tsx
import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { Collection } from "../types/type";
import DisplayCollection from "./DisplayCollection";
import EditCollection from "./EditCollection";

interface CreateCollectionProps {
    onSuccess: (message: string) => void;
}

const CreateCollection: React.FC<CreateCollectionProps> = ({ onSuccess }) => {
    const [collectionName, setCollectionName] = useState<string>("");
    const [collections, setCollections] = useState<Collection[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleCreateCollection = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!collectionName) {
            setError("Collection name is required.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing. Please log in again.");
                return;
            }

            await axios.post(
                "http://localhost:5000/v1/collection",
                { name: collectionName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCollectionName("");
            fetchCollections(); // Refresh collections
            onSuccess("Collection created successfully!");
        } catch (error: any) {
            setError(error.response?.data?.message || "An error occurred while creating the collection.");
        }
    };

    const fetchCollections = async () => {
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing. Please log in again.");
                return;
            }

            const response = await axios.get("http://localhost:5000/v1/collection", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCollections(response.data);
        } catch (error: any) {
            setError(error.response?.data?.message || "An error occurred while fetching collections.");
        }
    };

    const handleRemoveBook = async (collectionId: number, bookId: number) => {
        console.log("Attempting to remove book:", { collectionId, bookId }); // Log dataen sendt fra frontend
        try {
          const token = localStorage.getItem("token"); 
          await axios.delete("http://localhost:5000/v1/collection/removeBook", {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            data: { collectionId, bookId },
          });

          setCollections((prevCollections) =>
            prevCollections.map((collection) =>
              collection.id === collectionId
                ? {
                    ...collection,
                    user_books: collection.user_books.filter((book) => book.book.id !== bookId),
                  }
                : collection
            )
          );
        } catch (error) {
          console.error("Error removing book from collection:", error);
          if (axios.isAxiosError(error) && error.response) {
            console.error("Server response:", error.response.data); // Log serverens svar
        }
        }
      };
      

    const handleEdit = (collection: Collection) => {
        setEditingCollection(collection);
    };

    const handleUpdate = () => {
        fetchCollections(); // Refresh collections
        setEditingCollection(null); // Luk redigeringsvisningen
    };
    

    const handleDeleteCollection = async (collectionId: number) => {
        setError(null);
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing. Please log in again.");
                return;
            }
    
            await axios.delete(`http://localhost:5000/v1/collection/${collectionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            fetchCollections(); // Opdater listen efter sletning
        } catch (error: any) {
            setError(error.response?.data?.message || "An error occurred while deleting the collection.");
        }
    };
    

    return (
        <div>
            <h3>Create a Collection</h3>
            <form onSubmit={handleCreateCollection}>
                <input
                    type="text"
                    placeholder="Collection Name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {editingCollection ? (
                <EditCollection
                    collection={editingCollection}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditingCollection(null)}
                />
            ) : (
                <DisplayCollection
                    collections={collections}
                    onEdit={handleEdit}
                    onDelete={handleDeleteCollection}
                    onRemoveBook={handleRemoveBook}
                />
            )}
        </div>
    );
};

export default CreateCollection;
