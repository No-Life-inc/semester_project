import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchBooks } from '../services/apiClient';
import { Book } from '../types/type';
import DisplayBooks from './DisplayBooks';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there are more books to load
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Function to load books
  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBooks(page, 50); // Fetch books for the current page
      if (data.length > 0) {
        setBooks((prevBooks) => [...prevBooks, ...data]); // Append new books
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

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

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

  return (
    <div>
      <h1>Book List</h1>
      <DisplayBooks books={books} lastBookRef={lastBookRef} />
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default BookList;
