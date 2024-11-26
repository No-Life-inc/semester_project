import  { Request, Response } from "express";
import {addTag, deleteTagById, getAllTags, getTagById} from "../services/tagService";

/**
 * Fetches all tags from the database.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // GET /tag?page=1&limit=10
 * getAllTagsController(request, response)
 * // This will fetch the first 10 tags
 */
export const getAllTagsController = async (request: Request, response: Response) => {
    const { page = 1, limit = 10 } = request.query; // Default to page 1 and limit 10

    try {
        getAllTags(Number(page), Number(limit)).then((tags) => {
            response.json(tags);
        });
    } catch (error) {
        response.status(500).json({ error: "An error occurred while fetching tags" });
    }
}

/**
 * Fetches a tag by its ID.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // GET /tag/1
 *
 * This will fetch the tag with ID 1
 */
export const getTagByIdController = async (request: Request, response: Response) => {
    const id = Number(request.params.id);

    try {
        const tag = await getTagById(id);
        response.json(tag);
    } catch (error) {
        console.error("Error fetching tag:", error);

        if (error.message === "Tag not found") {
            return response.status(404).json({ error: error.message });
        }
        response.status(500).json({ error: "An error occurred while fetching tag" });
    }
};

/**
 * Creates a new tag.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // POST /tag
 * // body: { name: "Fantasy" }
 *
 * This will create a new tag with the name "Fantasy"
 */
export const addTagController = async (request: Request, response: Response) => {
    const { name } = request.body;

    try {
        const tag = await addTag(name);
        response.json(tag);
    } catch (error) {
        response.status(500).json({ error: "An error occurred while creating tag" });
    }
}

/**
 * Deletes a tag by its ID.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // DELETE /tag/1
 *
 * This will delete the tag with ID 1
 */
export const deleteTagByIdController = async (request: Request, response: Response) => {
    const { id } = request.params;

    try {
        await deleteTagById(parseInt(id));
        response.json({ message: "Tag deleted successfully" });
    } catch (error) {
        console.error("Error deleting tag:", error);

        if (error.message === "Tag not found") {
            return response.status(404).json({ error: error.message });
        }
        response.status(500).json({ error: "An error occurred while deleting tag" });
    }
}
