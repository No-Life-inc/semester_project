import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { Collection } from "../types/type";
import DisplayCollection from "./DisplayCollection";
import EditCollection from "./EditCollection";
import { Tag } from "../types/type";

interface CreateCollectionProps {
    onSuccess: (message: string) => void;
}

const CreateCollection: React.FC<CreateCollectionProps> = ({ onSuccess }) => {
    const [collectionName, setCollectionName] = useState<string>("");
    const [collections, setCollections] = useState<Collection[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [tagsForBooks, setTagsForBooks] = useState<{ [key: number]: Tag[] }>({});
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMoreTags, setHasMoreTags] = useState(true);
    const [message, setMessage] = useState('');
    

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchTags = async () => {
        if (loading || !hasMoreTags) return;

        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/v1/tag", {
                params: { page, limit: 10 },
            });
            const fetchedTags = response.data;

            if (fetchedTags.length === 0) {
                setHasMoreTags(false);
            } else {
                setAvailableTags((prevTags) => [...prevTags, ...fetchedTags]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                // Show the error message from the API response
                setMessage(error.response.data.error);
              } else {
                setMessage('An error occurred while fething tags. Please try again.');
              }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
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
            fetchCollections(); 
            onSuccess("Collection created successfully!");
        } catch (error: any) {
            setError(error.response?.data?.error);
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
            setError(error.response?.data?.error);
        }
    };

    const handleRemoveBook = async (collectionId: number, bookId: number) => {
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
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                // Show the error message from the API response
                setMessage(error.response.data.error);
              } else {
                setMessage('An error occurred while removing book. Please try again.');
              }
        }
      };

    // Fetch tags for a specific book
    const fetchTagsForBook = async (userBookId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:5000/v1/userBookTag/${userBookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTagsForBooks((prev) => ({ ...prev, [userBookId]: response.data as Tag[] }));
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                // Show the error message from the API response
                setMessage(error.response.data.error);
              } else {
                setMessage('An error occurred while fetching tags for books. Please try again.');
              }
        }
    };

    // Add a tag to a specific book
    const handleAddTag = async (userBookId: number, tagId: number) => {
        console.log("Adding tag:", { userBookId, tagId });
        try {
            const token = localStorage.getItem("token"); 
            await axios.post(
                "http://localhost:5000/v1/userBookTag",
                {
                    user_book_id: userBookId,
                    tag_id: tagId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchTagsForBook(userBookId);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                // Show the error message from the API response
                setMessage(error.response.data.error);
              } else {
                setMessage('An error occurred while adding tag to book. Please try again.');
              }
        }
    };
    
      

    const handleEdit = (collection: Collection) => {
        setEditingCollection(collection);
    };

    const handleUpdate = () => {
        fetchCollections();
        setEditingCollection(null);
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
            setError(error.response?.data?.error || "An error occurred while deleting the collection.");
        }
    };
    
return (
    <div data-testid="create-collection-container">
        <h3 id="create-collection-header" data-testid="create-collection-header">Create a Collection</h3>
        <form onSubmit={handleCreateCollection} data-testid="create-collection-form">
            <input
                type="text"
                placeholder="Collection Name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                data-testid="collection-name-input"
            />
            <button type="submit" data-testid="create-collection-button">Create</button>
        </form>
        {error && <p style={{ color: "red" }} data-testid="create-collection-error">{error}</p>}

        {message && <p data-testid="search-error">{message}</p>}

        {editingCollection ? (
            <EditCollection
                collection={editingCollection}
                onUpdate={handleUpdate}
                onCancel={() => setEditingCollection(null)}
                data-testid="edit-collection-component"
            />
        ) : (
            <DisplayCollection
                collections={collections}
                onEdit={handleEdit}
                onDelete={handleDeleteCollection}
                onRemoveBook={handleRemoveBook}
                onFetchTags={fetchTagsForBook}
                tagsForBooks={tagsForBooks}
                onAddTag={handleAddTag}
                availableTags={availableTags}
                fetchMoreTags={fetchTags}
                hasMoreTags={hasMoreTags}
                data-testid="display-collection-component"
            />
        )}
    </div>
);

};

export default CreateCollection;
