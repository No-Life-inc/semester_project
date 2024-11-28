import { Request, Response } from "express";
import {
  getSubjectByGuid,
  getSubjects,
  getSubjectsByPartialName,
} from "../../services/neo4j/subjectService";
import Subject from "../../models/neo4j/Subject";

/**
 * Controller for fetching subjects with pagination.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 *
 * @example
 * // GET /subjects?page=1&limit=10
 * getSubjectsController(request, response);
 * // This will fetch the first 10 subjects
 */
export const getSubjectsController = async (
  request: Request,
  response: Response
) => {
  const { page = "1", limit = "10" } = request.query;

  // Convert query parameters to numbers and calculate skip value
  const pageNumber = Math.trunc(Number(page));
  const limitNumber = Math.trunc(Number(limit));
  const skip = (pageNumber - 1) * limitNumber;

  // Validate query parameters
  if (isNaN(pageNumber) || pageNumber < 1) {
    return response
      .status(400)
      .json({ error: "Page must be a positive integer." });
  }

  if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
    return response
      .status(400)
      .json({ error: "Limit must be a number between 1 and 100." });
  }

  try {
    // Fetch subjects with pagination
    const subjects: Subject[] = await getSubjects(skip, limitNumber);

    // Return the subjects in the response
    response.json(subjects);
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching subjects:", error);
    response
      .status(500)
      .json({ error: "An error occurred while fetching subjects." });
  }
};

/**
 * Controller for fetching a subject by its GUID.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 *
 * @example
 * // GET /subjects/:GUID
 * getSubjectByIdController(request, response);
 * // This will fetch the subject with the specified GUID
 */
export const getSubjectByGuidController = async (
  request: Request,
  response: Response
) => {
  const { guid } = request.params;

  try {
    // Fetch the subject by ID
    const subject: Subject = await getSubjectByGuid(guid);

    // Return the subject in the response
    response.json(subject);
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching subject by ID:", error);
    response
      .status(500)
      .json({ error: "An error occurred while fetching the subject." });
  }
};

// controller for partial name subject search

/**
 * Controller for searching subjects by partial name.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 *
 * @example
 * // GET /subjects/search?name=math
 * searchSubjectsController(request, response);
 * // This will search for subjects with names containing "math"
 */
export const getSubjectsByPartialNameController = async (  request: Request,  response: Response) => {
        const name = request.query.name; 

    try {
        // Fetch subjects by partial name
        const subjects: Subject[] = await getSubjectsByPartialName(name as string);
    
        // Return the subjects in the response
        response.json(subjects);
    } catch (error) {
        // Handle errors gracefully
        console.error("Error searching subjects by name:", error);
        response
        .status(500)
        .json({ error: "An error occurred while searching for subjects." });
    }
    };
