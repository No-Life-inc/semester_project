import { Request, Response } from 'express';
import { getBooks, getBookByISBN, getBooksByTitle } from '../../services/neo4j/bookService';
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

/**
 * Controller for fetching a book by ISBN.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // GET /books/123
 * getBookByISBN(request, response);
 * // This will fetch the book with ID 123
 */ 
export const getBookByISBNController = async (request: Request, response: Response) => {
    const { isbn } = request.params;

    try {
        // Call the service to fetch the book by ISBN
        const book: Book | null = await getBookByISBN(isbn);

        if (book) {
            // Return the book as the response
            response.json(book);
        } else {
            // Return a 404 Not Found if the book is not found
            response.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        // Handle errors gracefully
        console.error('Error fetching book:', error);
        response.status(500).json({ error: 'An error occurred while fetching the book' });
    }
}

export const getBooksByTitleController = async (req: Request, res: Response) => {
    const titleQuery = req.query.title as string;

    console.log("Received titleQuery:", titleQuery); // Log the incoming query

    if (!titleQuery) {
        return res.status(400).json({ error: 'Title query parameter is required' });
    }

    try {
        const books = await getBooksByTitle(titleQuery);

        console.log("Books fetched:", books); // Log the result from the database

        if (books.length === 0) {
            console.log("No books found for title:", titleQuery); // Log empty result case
            return res.status(404).json({ error: 'No books found matching the title.' });
        }

        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error); // Log errors
        res.status(500).json({ error: 'An error occurred while fetching books.' });
    }
};
