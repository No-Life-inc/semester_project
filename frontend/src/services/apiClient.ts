import axios from 'axios';
import { Book } from '../types/type'; // Assuming `Book` type is defined in this path

const API_BASE_URL = 'http://localhost:5000/v1'; // Update with your actual backend URL

// Fetch books with pagination
export const fetchBooks = async (page: number = 1, limit: number = 50): Promise<Book[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/book`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Fetch a single book by ID
export const fetchBookById = async (id: number): Promise<Book> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/book/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};
