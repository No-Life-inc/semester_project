import { Request, Response } from "express";
import { getUserBooks, addBookToUser, removeBookFromUser } from "../services/userBookService";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

/**
 * Fetches user books and their associated book details.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // GET /userbook/1?page=1&limit=50
 * getUserBooksController(req, res)
 * // This will fetch the first 50 user books for user with ID 1.
 */
export const getUserBooksController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { page, limit } = req.query;
    const { email } = req.user;

    try {
        const result = await getUserBooks(email, Number(page), Number(limit));
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


/**
 * Adds a book to a user's collection.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // POST /userbook
 * addBookToUserController(req, res)
 * // This will add the book to the user's collection.
 */
export const addBookToUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { bookId } = req.body;
    const { email } = req.user;
    

    try {
        const userBook = await addBookToUser(email, Number(bookId));
        res.status(201).json(userBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Removes a book from a user's collection.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // DELETE /userbook/1
 * removeBookFromUserController(req, res)
 * // This will remove the userBook with id 1 from the user's collection.
 */
export const removeBookFromUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { userBookId } = req.params;
    const { email } = req.user;

    try {
        const success = await removeBookFromUser(email, Number(userBookId));
        if (success) {
            res.status(200).json({ message: "Book removed from user successfully" });
        } else {
            res.status(404).json({ message: "UserBook not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};