import { getUserBooks } from "../../services/neo4j/userBookService";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticatedRequest";
import {
    NotFoundError,
    ValidationError,
    UnauthorizedError,
  } from "../../utility/errors";
  
/**
 * Controller to handle requests for fetching user books.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getUserBookController = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;
    const { page, limit } = req.query; // Extract pagination options from query parameters

    // Validate required parameters
    if (!email || typeof email !== 'string') {
        return new ValidationError("User email is not valid");
    }
    
    try {
        // Parse pagination values or use defaults
        const pageNumber = parseInt(page as string) || 1; // Default page: 1
        const limitNumber = parseInt(limit as string) || 50; // Default limit: 50

        // Fetch user books from the service
        const { books } = await getUserBooks(email, pageNumber, limitNumber);

        // Respond with the books
        if (books.length === 0) {
            return res.status(404).json({
                message: "No books found for this user.",
                books: [],
            });
        }

        res.status(200).json({
            books,
        });
    } catch (error) {
        console.error("Error in getUserBookController:", error);
        res.status(500).json({ error: "Failed to fetch user books." });
    }
};

//add book to user

