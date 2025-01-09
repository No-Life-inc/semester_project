import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Book, Collection } from '../types/type';
import DisplayBooks from './DisplayBooks';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const loadBooks = useCallback(async () => {
    if (debouncedQuery) return;

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/v1/book', {
        params: { page, limit: 50 },
      });
      const fetchedBooks = response.data;

      setBooks((prevBooks: Book[]) => [
        ...prevBooks,
        ...fetchedBooks.filter(
          (book: Book) => !prevBooks.some((prevBook: Book) => prevBook.id === book.id)
        ),
      ]);
      setHasMore(fetchedBooks.length === 50);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQuery]);

  const loadCollections = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token is missing. Please log in again.');
      }
      const response = await axios.get('http://localhost:5000/v1/collection', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollections(response.data);
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  }, []);

  const searchBooks = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/v1/book/search', {
        params: { title: debouncedQuery },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  // Infinite scroll observer
  const lastBookRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || debouncedQuery) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, debouncedQuery]
  );

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  useEffect(() => {
    loadBooks();
  }, [page, loadBooks]);

  useEffect(() => {
    searchBooks();
  }, [searchBooks]);

 return (
    <div data-testid="book-list-container">
        <h1 id="book-list-header" data-testid="book-list-header">Book List</h1>

        <input
            type="text"
            placeholder="Search books by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
            data-testid="search-books-input"
        />

        {successMessage && (
            <div style={{ color: 'green' }} data-testid="success-message">
                {successMessage}
            </div>
        )}

        <DisplayBooks
            books={debouncedQuery ? searchResults : books}
            collections={collections}
            lastBookRef={debouncedQuery ? undefined : lastBookRef}
            onBookAdded={(message) => setSuccessMessage(message)}
        />

        {loading && <div data-testid="loading-indicator">Loading...</div>}
    </div>
);

};

export default BookList;
