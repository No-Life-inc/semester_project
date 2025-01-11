import e, { Request, Response } from "express";
import { getBooks, getBookById, getBooksByTitle, addBooks } from "../services/bookService";
import { fetchBooksFromExternalAPI } from "../services/externalAPIService";
import Book from "../models/sequelize/Book";

import { BaseError } from "../utility/errors";

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
    } 
    catch (error) {
        if (error instanceof BaseError)
            response.status(error.statusCode).json({ error: error.message });
        else
            response.status(500).json({ error: "An error occurred" });
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

    
    const bookId = parseInt(id, 10);
    if (!id || id.trim() === "" || isNaN(bookId) || bookId < 1) {
        return response.status(422).json({ error: "ID parameter must be a valid positive number" });
    }

    try {
        const book = await getBookById(bookId);

        response.json(book);

    } catch (error) {
        if (error instanceof BaseError)
            response.status(error.statusCode).json({ error: error.message });
        else
            response.status(500).json({ error: "An error occurred" });
        }
};


/**
 * Fetches books by a subset of the title.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // GET /books/search?title=Harry
 * getBooksByTitleController(req, res)
 * // This will fetch all books with titles containing "Harry".
 */
export const getBooksByTitleController = async (req: Request, res: Response) => {
    const titleQuery = req.query.title as string;

    if (!titleQuery) {
        return res.status(422).json({ message: "Title query parameter is required" });
    }

    try {
        let books = await getBooksByTitle(titleQuery);

        if (books.length === 0) {
            
            const apiBooks = await fetchBooksFromExternalAPI(titleQuery);

            if (apiBooks.length > 0) {
                const addedBooks: Book[] = await addBooks(apiBooks);
                books = addedBooks;
            }
        }

        res.status(200).json(books);
    } catch (error) {
        if (error instanceof BaseError)
            res.status(error.statusCode).json({ error: error.message });
        else
            res.status(500).json({ error: "An error occurred" });
        }
};