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

export const getAllTags = async () => {
  const response = await axios.get(`${API_BASE_URL}/tag/`);
  return response.data;
};

export const getTagById = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/tag/${id}`);
  return response.data;
};

export const createTag = async (name: string) => {
  const response = await axios.post(`${API_BASE_URL}/tag/`, { name });
  return response.data;
};

export const deleteTagById = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/tag/${id}`);
  return response.data;
};

export const addTagToBook = async (userBookId: number, tagId: number) => {
  return axios.post(`${API_BASE_URL}/userBookTag`, { userBookId, tagId });
};

export const deleteTagFromBook = async (userBookId: number, tagId: number) => {
  return axios.delete(`${API_BASE_URL}/userBookTag`, {
    data: { userBookId, tagId },
  });
};

export const getTagsForBook = async (userBookId: number) => {
  const response = await axios.get(`${API_BASE_URL}/userBookTag/${userBookId}`);
  return response.data;
};
