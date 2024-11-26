import { Request, Response } from "express";
import { getUserCollectionsByEmail } from "../../services/neo4j/CollectionService";

/**
 * Handles retrieving collections for a user via an HTTP request.
 *
 * @param {Request} req - The request object containing the user ID as a parameter.
 * @param {Response} res - The response object used to send the result or error.
 */
export const getUserCollectionsController = async (req: Request, res: Response) => {
    const { email } = req.query;

    // Validate email
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Invalid or missing email" });
    }

    try {
        const collections = await getUserCollectionsByEmail(email);
        res.json(collections);
    } catch (error) {
        console.error("Error fetching user collections:", error);
        res.status(500).json({ message: (error as Error).message });
    }
};
