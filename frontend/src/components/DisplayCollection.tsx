import React from "react";
import { Collection } from "../types/type";

interface DisplayCollectionsProps {
    collections: Collection[];
    onEdit: (collection: Collection) => void; 
    onDelete: (collectionId: number) => void; 
    onRemoveBook: (collectionId: number, bookId: number) => void; 
}

const DisplayCollection: React.FC<DisplayCollectionsProps> = ({ collections, onEdit, onDelete, onRemoveBook }) => {
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
                      {collection.user_books.map((book) => (
                        <li key={book.id}>
                          {book.book.title}
                          <button onClick={() => onRemoveBook(collection.id, book.id)}>Remove Book</button>
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
