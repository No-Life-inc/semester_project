import React, { useState } from "react";
import { Collection, Tag } from "../types/type";

interface DisplayCollectionsProps {
    collections: Collection[];
    onEdit: (collection: Collection) => void;
    onDelete: (collectionId: number) => void;
    onRemoveBook: (collectionId: number, bookId: number) => void;
    onFetchTags: (userBookId: number) => void;
    tagsForBooks: { [key: number]: Tag[] };
    onAddTag: (userBookId: number, tagId: number) => void; // Opdater onAddTag til at tage tagId
    availableTags: Tag[]; // Liste over tilgængelige tags
}

const DisplayCollection: React.FC<DisplayCollectionsProps> = ({
    collections,
    onEdit,
    onDelete,
    onRemoveBook,
    onFetchTags,
    tagsForBooks,
    onAddTag,
    availableTags,
}) => {
    const [selectedTagIds, setSelectedTagIds] = useState<{ [key: number]: number | null }>({});

    return (
        <div>
            <h3>Your Collections:</h3>
            {collections.length > 0 ? (
                <ul>
                    {collections.map((collection) => (
                        <li key={collection.id}>
                            <strong>{collection.name}</strong>
                            <button onClick={() => onEdit(collection)}>Edit Collection</button>
                            <button onClick={() => onDelete(collection.id)}>Delete Collection</button>
                            {collection.user_books && collection.user_books.length > 0 ? (
                                <ul>
                                    {collection.user_books.map((userBook) => (
                                        <li key={userBook.id}>
                                            {userBook.book.title}
                                            <button
                                                onClick={() =>
                                                    userBook.book.id !== undefined &&
                                                    onRemoveBook(collection.id, userBook.book.id)
                                                }
                                            >
                                                Remove Book
                                            </button>

                                            <button onClick={() => onFetchTags(userBook.id)}>Show Tags</button>
                                            {tagsForBooks[userBook.id] && (
                                                <ul>
                                                    {tagsForBooks[userBook.id].map((userBookTag: any) => {
                                                        if (userBookTag.tag) {
                                                            return <li key={userBookTag.tag.id}>{userBookTag.tag.name}</li>;
                                                        }
                                                        return null;
                                                    })}
                                                </ul>
                                            )}

                                            {/* Dropdown for Tag Selection */}
                                            <select
                                                value={selectedTagIds[userBook.id] || ""}
                                                onChange={(e) =>
                                                    setSelectedTagIds((prev) => ({
                                                        ...prev,
                                                        [userBook.id]: Number(e.target.value),
                                                    }))
                                                }
                                            >
                                                <option value="">Select a tag</option>
                                                {availableTags.map((tag) => (
                                                    <option key={tag.id} value={tag.id}>
                                                        {tag.name}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Button for Adding Tag */}
                                            <button
                                                onClick={() => {
                                                    const tagId = selectedTagIds[userBook.id];
                                                    if (tagId) {
                                                        onAddTag(userBook.id, tagId);
                                                        setSelectedTagIds((prev) => ({
                                                            ...prev,
                                                            [userBook.id]: null,
                                                        }));
                                                    }
                                                }}
                                            >
                                                Add Tag
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No books in this collection.</p>
                            )}
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
