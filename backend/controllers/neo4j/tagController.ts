import e, { Request, Response } from "express";
import Tag from "../../models/neo4j/Tag";
import { getTags, getTagByGuid, createTag, deleteTag, addTagToBook, deleteTagFromBook } from "../../services/neo4j/tagService";
import { AuthenticatedRequest } from "../../types/authenticatedRequest";

/**
 * Controller for fetching tags with pagination.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 *
 * @example
 * // GET /tags?page=1&limit=10
 * getTagsController(request, response);
 * // This will fetch the first 10 tags
 */
export const getTagsController = async (
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
        // Fetch tags with pagination
        const tags: Tag[] = await getTags(skip, limitNumber);
    
        // Return the tags in the response
        response.json(tags);
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching tags:", error);
        response
        .status(500)
        .json({ error: "An error occurred while fetching tags." });
    }
    }

//getTagByGuidController function
export const getTagByGuidController = async (request: Request, response: Response) => {
    const guid = request.params.guid;
    
    try {
        const tag = await getTagByGuid(guid);
        response.json(tag);
    } catch (error) {
        console.error("Error fetching tag:", error);
        
        if (error.message === "Tag not found") {
            return response.status(404).json({ error: error.message });
        }
        response.status(500).json({ error: "An error occurred while fetching tag" });
    }
}

//createTagController function
export const createTagController = async (request: Request, response: Response) => {
    const { name } = request.body;

    if (!name || typeof name !== "string") {
        return response.status(400).json({ error: "Tag name is required and must be a string." });
    }

    try {
        const tag = await createTag(name); // Pass the name directly
        response.status(201).json(tag);
    } catch (error) {
        console.error("Error creating tag:", error);
        response.status(500).json({ error: "An error occurred while creating the tag." });
    }
};

//deleteTagController function
export const deleteTagController = async (request: Request, response: Response) => {
    const { guid } = request.params; // Extract GUID from route parameters

    if (!guid || typeof guid !== "string") {
        return response.status(400).json({ error: "Tag GUID is required and must be a string." });
    }

    try {
        await deleteTag(guid); // Call the service to delete the tag
        response.status(200).json({ message: `Tag with GUID '${guid}' has been deleted successfully.` });
    } catch (error) {
        console.error("Error deleting tag:", error);
        response.status(500).json({ error: "An error occurred while deleting the tag." });
    }
};


//addTagToBookController function
export const addTagToBookController = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;
    const { isbn, guid } = req.params;

    if (!email || !isbn || !guid) {
        return res.status(400).json({
            error: "User email, book ISBN, and tag GUID are required.",
        });
    }

    try {
        await addTagToBook(email, isbn, guid);
        res.status(200).json({
            message: `Tag with GUID '${guid}' has been added to book with ISBN '${isbn}'.`,
        });
    } catch (error) {
        console.error("Error in addTagToBookController:", error);
        res.status(500).json({
            error: "An error occurred while adding the tag to the book.",
        });
    }
};


//deleteTagFromBookController function
export const deleteTagFromBookController = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;
    const { isbn, guid } = req.params;

    if (!email || !isbn || !guid) {
        return res.status(400).json({
            error: "User email, book ISBN, and tag GUID are required.",
        });
    }

    try {
        await deleteTagFromBook(email, isbn, guid);
        res.status(200).json({
            message: `Tag with GUID '${guid}' has been removed from book with ISBN '${isbn}'.`,
        });
    } catch (error) {
        console.error("Error in deleteTagFromBookController:", error);
        res.status(500).json({
            error: "An error occurred while removing the tag from the book.",
        });
    }
};