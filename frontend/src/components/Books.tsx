import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchBooks } from '../services/apiClient';
import { Book, Collection } from '../types/type';
import axios from 'axios';
import DisplayBooks from './DisplayBooks';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there are more books to load
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const [searchResults, setSearchResults] = useState<Book[]>([]); // Til søgefunktion
  const [debouncedQuery, setDebouncedQuery] = useState<string>(''); // Debounced søgeværdi
  

  // Function to load books
  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBooks(page, 50); // Fetch books for the current page
      if (data.length > 0) {
        setBooks((prevBooks) => {
          const uniqueBooks = [...prevBooks, ...data].filter(
            (book, index, self) => self.findIndex((b) => b.id === book.id) === index
          );
          return uniqueBooks;
        });
        setHasMore(data.length === 50); // If less than 50 books, assume no more to load
      } else {
        setHasMore(false); // No more books to load
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);
  

  // Function to load collections
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
      setSearchResults([]); // Ryd søgeresultater, hvis input er tomt
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/v1/book/search', {
        params: { title: debouncedQuery },
      });
      setSearchResults(response.data); // Gem søgeresultater
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

    // Debounce søgefeltets værdi
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedQuery(searchQuery); // Opdater kun efter en pause
      }, 300); // 300ms debounce-tid
      return () => {
        clearTimeout(handler); // Ryd timeout ved næste input
      };
    }, [searchQuery]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Observer to detect scrolling to the end
  interface LastBookRefCallback {
    (node: HTMLElement | null): void;
  }

  const lastBookRef: LastBookRefCallback = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // Load next page
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    searchBooks();
  }, [searchBooks]);

  return (
    <div>
      <h1>Book List</h1>
      <input
        type="text"
        placeholder="Search books by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
      />
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <DisplayBooks
        books={debouncedQuery ? searchResults : books}
        collections={collections}
        lastBookRef={lastBookRef}
        onBookAdded={(message) => setSuccessMessage(message)}
      />
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default BookList;
