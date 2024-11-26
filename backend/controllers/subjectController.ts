import { Request, Response } from "express";
import { getAllSubjects, getSubjectById } from "../services/subjectService";

/**
 * Controller to fetch all subjects.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getAllSubjectsController = async (request: Request, response: Response) => {
    const { page = 1, limit = 50 } = request.query;

    try {
        const subjects = await getAllSubjects(Number(page), Number(limit));
        response.json(subjects);
    } catch (error) {
        response.status(500).json({ error: "An error occurred while fetching subjects" });
    }

  };


/**
 * Controller to fetch a subject by its ID.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const getSubjectByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const subject = await getSubjectById(Number(id));
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the subject" });
    }
};
