import { Request, Response } from "express";
import { getBooks, getBookById } from "../services/bookService";

/**
 * Fetches books from the database.
 * 
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // GET /book?page=1&limit=50
 * getBooksController(request, response)
 * // This will fetch the first 50 books
 */
export const getBooksController = async (request: Request, response: Response) => {
    const { page = 1, limit = 50 } = request.query;

    try {
        const books = await getBooks(Number(page), Number(limit));
        response.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        response.status(500).json({ error: "An error occurred while fetching books" });
    }

  };

/**
 * Fetches a book by its ID.
 * 
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // GET /book/1
 * getBookByIdController(request, response)
 * // This will fetch the book with ID 1
 */
export const getBookByIdController = async (request: Request, response: Response) => {
    const { id } = request.params;
    
    try {
        const book = await getBookById(Number(id));
        response.json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        response.status(500).json({ error: "An error occurred while fetching book" });
    }
    };