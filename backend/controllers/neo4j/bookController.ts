import { Request, Response } from 'express';
import { getBooks } from '../../services/neo4j/bookService';
import Book from "../../types/book";

/**
 * Controller for fetching books.
 * This controller uses query parameters for pagination.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // GET /books?page=1&limit=50
 * getBooksController(request, response);
 * // This will fetch the first 50 books
 */
export const getBooksController = async (request: Request, response: Response)=> {
    const { page = 1, limit = 50 } = request.query;

    // Validate query parameters if needed
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || pageNumber < 1) {
        return response.status(400).json({ error: 'Page must be a positive number' });
    }

    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
        return response.status(400).json({ error: 'Limit must be a number between 1 and 100' });
    }

    try {
        // Call the service to fetch books with pagination
        const books: Book[] = await getBooks(pageNumber, limitNumber);
        
        // Return the books as the response
        response.json(books);
    } catch (error) {
        // Handle errors gracefully
        console.error('Error fetching books:', error);
        response.status(500).json({ error: 'An error occurred while fetching books' });
    }
};