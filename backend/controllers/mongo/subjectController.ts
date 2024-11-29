import { Request, Response } from "express";
import {
  getSubjects,
  getSubjectsByPartialName,
  getSubjectById
} from "../../services/mongo/subjectService";

/**
 * Get all unique subjects with optional pagination.
 */
export const getSubjectsController = async (req: Request, res: Response) => {
    const { page = "1", limit = "10" } = req.query;
  
    try {
      const subjects = await getSubjects(Number(page), Number(limit));
      res.status(200).json(subjects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

/**
 * Search subjects by partial name.
 */
export const getSubjectsByPartialNameController = async (
    req: Request,
    res: Response
  ) => {
    const { name } = req.query;
  
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "A search term is required." });
    }
  
    try {
      const subjects = await getSubjectsByPartialName(name);
      res.status(200).json(subjects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  export const getSubjectByIdController = async (req: Request, res: Response) => {
    const { subjectId } = req.params;
  
    try {
      const subject = await getSubjectById(subjectId);
      res.status(200).json(subject);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
