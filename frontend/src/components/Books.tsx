import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Book, Collection } from '../types/type';
import DisplayBooks from './DisplayBooks';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Pagination for standard loading
  const [hasMore, setHasMore] = useState(true); // Track if more books are available
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Book[]>([]); // For search results
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query value
  const [debouncedQuery, setDebouncedQuery] = useState<string>(''); // Debounced search value
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounce søgefeltets værdi
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Opdater kun efter en pause
    }, 300); // 300ms debounce-tid
    return () => {
      clearTimeout(handler); // Ryd timeout ved næste input
    };
  }, [searchQuery]);

  // Funktion til at hente bøger (standardfunktion med pagination)
  const loadBooks = useCallback(async () => {
    if (debouncedQuery) return; // Undgå at køre, hvis der er en aktiv søgning

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
      setHasMore(fetchedBooks.length === 50); // Hvis mindre end 50, er der ingen flere bøger
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQuery]);

  // Funktion til at hente samlinger (uden ændringer)
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

  // Funktion til at søge bøger
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

  // Infinite scroll observer
  const lastBookRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || debouncedQuery) return; // Undgå at aktivere ved søgning

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // Hent næste side
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, debouncedQuery]
  );

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Standardbøger: Hent flere, når page ændrer sig
  useEffect(() => {
    loadBooks();
  }, [page, loadBooks]);

  // Søgning: Kør, når den debounced query ændrer sig
  useEffect(() => {
    searchBooks();
  }, [searchBooks]);

  return (
    <div>
      <h1>Book List</h1>

      {/* Søgefelt */}
      <input
        type="text"
        placeholder="Search books by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
      />

      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {/* DisplayBooks viser enten søgeresultater eller normale bøger */}
      <DisplayBooks
        books={debouncedQuery ? searchResults : books} // Viser søgeresultater, hvis der er en søgning
        collections={collections}
        lastBookRef={debouncedQuery ? undefined : lastBookRef} // Infinite scroll kun aktiv uden søgning
        onBookAdded={(message) => setSuccessMessage(message)}
      />

      {loading && <div>Loading...</div>}
    </div>
  );
};

export default BookList;
