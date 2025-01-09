import React, { useState, useEffect, useRef } from "react";
import { Collection, Tag } from "../types/type";

interface DisplayCollectionsProps {
    collections: Collection[];
    onEdit: (collection: Collection) => void;
    onDelete: (collectionId: number) => void;
    onRemoveBook: (collectionId: number, bookId: number) => void;
    onFetchTags: (userBookId: number) => void;
    tagsForBooks: { [key: number]: Tag[] };
    onAddTag: (userBookId: number, tagId: number) => void;
    availableTags: Tag[];
    fetchMoreTags: () => void;
    hasMoreTags: boolean;
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
    fetchMoreTags,
    hasMoreTags,
}) => {
    const [selectedTagIds, setSelectedTagIds] = useState<{ [key: number]: number | null }>({});
    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMoreTags) {
                    fetchMoreTags();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [hasMoreTags, fetchMoreTags]);

    return (
        <div data-testid="collections-container">
            <h3 id="your-collections-header">Your Collections:</h3>
            {collections.length > 0 ? (
                <ul>
                    {collections.map((collection) => (
                        <li key={collection.id} data-testid={`collection-${collection.id}`}>
                            <strong data-testid={`collection-name-${collection.id}`}>{collection.name}</strong>
                            <button
                                data-testid={`edit-collection-${collection.id}`}
                                onClick={() => onEdit(collection)}
                            >
                                Edit Collection
                            </button>
                            <button
                                data-testid={`delete-collection-${collection.id}`}
                                onClick={() => onDelete(collection.id)}
                            >
                                Delete Collection
                            </button>
                            {collection.user_books && collection.user_books.length > 0 ? (
                                <ul>
                                    {collection.user_books.map((userBook) => (
                                        <li key={userBook.id} data-testid={`book-${userBook.id}`}>
                                            {userBook.book.title}
                                            <button
                                                data-testid={`remove-book-${userBook.id}`}
                                                onClick={() =>
                                                    userBook.book.id !== undefined &&
                                                    onRemoveBook(collection.id, userBook.book.id)
                                                }
                                            >
                                                Remove Book
                                            </button>
    
                                            <button
                                                data-testid={`show-tags-${userBook.id}`}
                                                onClick={() => onFetchTags(userBook.id)}
                                            >
                                                Show Tags
                                            </button>
                                            {tagsForBooks[userBook.id] && (
                                                <ul>
                                                    {tagsForBooks[userBook.id].map((userBookTag: any) => {
                                                        if (userBookTag.tag) {
                                                            return (
                                                                <li
                                                                    key={userBookTag.tag.id}
                                                                    data-testid={`tag-${userBookTag.tag.id}`}
                                                                >
                                                                    {userBookTag.tag.name}
                                                                </li>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </ul>
                                            )}
    
                                            <select
                                                data-testid={`tag-selector-${userBook.id}`}
                                                value={selectedTagIds[userBook.id] || ""}
                                                onChange={(e) =>
                                                    setSelectedTagIds((prev) => ({
                                                        ...prev,
                                                        [userBook.id]: Number(e.target.value),
                                                    }))
                                                }
                                            >
                                                <option value="">Select a tag</option>
                                                {availableTags.map((tag, index) => (
                                                    <option
                                                        key={`available-tag-${tag.id}-${index}`}
                                                        value={tag.id}
                                                    >
                                                        {tag.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div ref={observerRef} style={{ height: "1px" }} />
    
                                            <button
                                                data-testid={`add-tag-${userBook.id}`}
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
                                <p data-testid={`no-books-${collection.id}`}>No books in this collection.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p data-testid="no-collections">No collections found.</p>
            )}
        </div>
    );
    
};

export default DisplayCollection;
