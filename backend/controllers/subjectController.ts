import { Request, Response } from "express";
import { getAllSubjects, getSubjectById } from "../services/subjectService";
import { BaseError } from "../utility/errors";

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
        if (error instanceof BaseError)
            response.status(error.statusCode).json({ error: error.message });
        else
            response.status(500).json({ error: "An error occurred" });
        }
  };


/**
 * Controller to fetch a subject by its ID.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * 
 */
export const getSubjectByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const subjectId = parseInt(id, 10);
    if (!id || id.trim() === "" || isNaN(subjectId) || subjectId < 1) {
        return res.status(422).json({ error: "ID parameter must be a valid positive number" });
    }

    try {
        const subject = await getSubjectById(subjectId);

        res.json(subject);
    } catch (error) {
        if (error instanceof BaseError)
            res.status(error.statusCode).json({ error: error.message });
        else
            res.status(500).json({ error: "An error occurred" });
        }
};
