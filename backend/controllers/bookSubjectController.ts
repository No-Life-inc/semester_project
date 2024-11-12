import { Request, Response } from "express";
import { getBooksBySubject } from "../services/bookSubjectService";

/**
 * Controller to fetch books associated with a specific subject.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getBooksBySubjectController = async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;
    const { page, limit } = req.query;

    try {
        const books = await getBooksBySubject(Number(subjectId), Number(page), Number(limit));
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
