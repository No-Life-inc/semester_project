import React, { useState } from 'react';
import '../styles/Books.css';
import { Book, Collection } from '../types/type';
import axios from 'axios';

interface DisplayBooksProps {
  books: Book[];
  collections: Collection[];
  lastBookRef?: (node: HTMLDivElement | null) => void;
  onBookAdded?: (message: string) => void;
}

const truncateTitle = (title: string, maxLength: number = 30) => {
  return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
};

const DisplayBooks: React.FC<DisplayBooksProps> = ({ books, collections, lastBookRef, onBookAdded }) => {
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCollection = async (bookId: number) => {
    setError(null);

    if (!selectedCollection) {
      setError('Please select a collection.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing. Please log in again.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/v1/collection/addBook',
        { collectionId: selectedCollection, bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onBookAdded) onBookAdded(response.data.message || 'Book added successfully.');
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            setMessage(error.response.data.error);
          } else {
            setMessage('An error occurred while adding book to collection. Please try again.');
          }
    }
  };

  return (
    <div className="book-list" data-testid="book-list">
        {books.map((book, index) => (
            <div
                key={book.id}
                className="card"
                ref={index === books.length - 1 ? lastBookRef : null}
                data-testid={`book-card-${book.id}`}
            >
                <div className="card-image-container" data-testid={`book-image-container-${book.id}`}>
                    {book.image && (
                        <img
                            src={book.image}
                            alt={`${book.title} cover`}
                            className="card-image"
                            data-testid={`book-image-${book.id}`}
                        />
                    )}
                </div>
                <div className="card-title" title={book.title} data-testid={`book-title-${book.id}`}>
                    {truncateTitle(book.title)}
                </div>
                <div className="card-content" data-testid={`book-content-${book.id}`}>
                    {book.authors && (
                        <p data-testid={`book-authors-${book.id}`}>
                            By: {book.authors.map((author) => author.name).join(', ')}
                        </p>
                    )}
                    {book.edition && <p data-testid={`book-edition-${book.id}`}>Edition: {book.edition}</p>}
                    {book.isbn && <p data-testid={`book-isbn-${book.id}`}>ISBN: {book.isbn}</p>}
                    {book.language && <p data-testid={`book-language-${book.id}`}>Language: {book.language}</p>}
                    {book.publicationDate && (
                        <p data-testid={`book-publication-date-${book.id}`}>
                            Publication Date: {new Date(book.publicationDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <div className="add-to-collection" data-testid={`add-to-collection-${book.id}`}>
                    <select
                        onChange={(e) => setSelectedCollection(Number(e.target.value))}
                        defaultValue=""
                        data-testid={`collection-selector-${book.id}`}
                    >
                        <option value="" disabled>
                            Select Collection
                        </option>
                        {collections.map((collection) => (
                            <option key={collection.id} value={collection.id} data-testid={`collection-option-${collection.id}`}>
                                {collection.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => book.id !== undefined && handleAddToCollection(book.id)}
                        data-testid={`add-to-collection-button-${book.id}`}
                    >
                        Add to Collection
                    </button>
                </div>
            </div>
        ))}
        {error && <p style={{ color: 'red' }} data-testid="error-message">{error}</p>}
    </div>
);

};

export default DisplayBooks;
