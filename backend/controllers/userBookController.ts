import { Request, Response } from "express";
import { getUserBooks, addBookToUser, removeBookFromUser } from "../services/userBookService";

export const getUserBooksController = async (req: Request, res: Response): Promise<void> => {
    const { userId, page, limit } = req.query;

    try {
        const result = await getUserBooks(Number(userId), Number(page), Number(limit));
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const addBookToUserController = async (req: Request, res: Response): Promise<void> => {
    const { userId, bookId } = req.body;

    try {
        const userBook = await addBookToUser(Number(userId), Number(bookId));
        res.status(201).json(userBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const removeBookFromUserController = async (req: Request, res: Response): Promise<void> => {
    const { userBookId } = req.params;

    try {
        const success = await removeBookFromUser(Number(userBookId));
        if (success) {
            res.status(200).json({ message: "Book removed from user successfully" });
        } else {
            res.status(404).json({ message: "UserBook not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};