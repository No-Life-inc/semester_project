import { AuthenticatedRequest } from "../../types/authenticatedRequest";
import { getUserBooks, addBookToUser, removeBookFromUser } from "../../services/mongo/userBookService";
import { Response } from "express";
import { ValidationError, UnauthorizedError } from "../../utility/errors";

/**
 * Fetches user books and their associated book details.
 */
export const getUserBooksController = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;
    const { page, limit } = req.query;

    if (!email) {
        throw new UnauthorizedError("Unauthorized user");
    }

    try {
        const books = await getUserBooks(email, Number(page) || 1, Number(limit) || 50);
        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Associates a book with the authenticated user.
 */
export const addBookToUserController = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;
    const { bookId } = req.body;

    if (!email || !bookId) {
        throw new ValidationError("Email and bookId are required");
    }

    try {
        const userBook = await addBookToUser(email, bookId);
        res.status(201).json({ message: "Book added successfully", userBook });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Removes a book from the authenticated user's collection.
 */
export const removeBookFromUserController = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;
    const { bookId } = req.params;

    if (!email || !bookId) {
        throw new ValidationError("Email and bookId are required");
    }

    try {
        const updatedBooks = await removeBookFromUser(email, bookId);
        res.status(200).json({ message: "Book removed successfully", updatedBooks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};