import {
    getBookByISBN,
    getBooks,
    getBooksBySubjectName, // Bemærk ændring her
    getBooksByTitle,
} from "../../services/mongo/bookService";
import { Request, Response } from "express";

/**
 * Get all books with optional pagination.
 */
export const getBooksController = async (req: Request, res: Response) => {
    const { page = "1", limit = "50" } = req.query;

    try {
        const books = await getBooks(Number(page), Number(limit));
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get books by subject name.
 */
export const getBooksBySubjectNameController = async (req: Request, res: Response) => {
    const { subject } = req.query;

    try {
        if (!subject || typeof subject !== "string") {
            return res.status(400).json({
                error: "Subject query parameter is required and must be a string",
            });
        }

        const books = await getBooksBySubjectName(subject); // Bemærk ændring her
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

/**
 * Get books by ISBN.
 */
export const getBookByISBNController = async (req: Request, res: Response) => {
    const { isbn } = req.query;

    try {
        if (!isbn || typeof isbn !== "string") {
            return res.status(400).json({
                error: "ISBN parameter is required and must be a string",
            });
        }

        const book = await getBookByISBN(isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

/**
 * Get books by title.
 */
export const getBooksByTitleController = async (req: Request, res: Response) => {
    const { title } = req.query;

    try {
        if (!title || typeof title !== "string") {
            return res.status(400).json({
                error: "Title query parameter is required and must be a string",
            });
        }

        const books = await getBooksByTitle(title);
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
