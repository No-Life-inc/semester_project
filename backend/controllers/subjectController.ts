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
export const getAllSubjectsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjects = await getAllSubjects();
        res.json(subjects);
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ error: "An error occurred while fetching subjects" });
    }
};


/**
 * Controller to fetch a subject by its ID.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getSubjectByIdController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const subject = await getSubjectById(Number(id));
        res.json(subject);
    } catch (error) {
        console.error("Error fetching subject by ID:", error);
        res.status(500).json({ error: "An error occurred while fetching the subject" });
    }
};
