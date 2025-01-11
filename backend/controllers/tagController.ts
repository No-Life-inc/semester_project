import  { Request, Response } from "express";
import {addTag, deleteTagById, getAllTags, getTagById} from "../services/tagService";
import {BadRequestError, BaseError} from "../utility/errors";

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
    const { page = 1, limit = 10 } = request.query;

    try {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (isNaN(pageNumber) || pageNumber <= 0) {
            throw new BadRequestError("Page must be a positive number greater than 0.");
        }

        if (isNaN(limitNumber) || limitNumber <= 0) {
            throw new BadRequestError("Limit must be a positive number greater than 0.");
        }

        const tags = await getAllTags(pageNumber, limitNumber);
        response.status(200).json(tags);
    } catch (error) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};

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
        response.status(200).json(tag);
    } catch (error) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
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
        response.status(201).json(tag);
    } catch (error) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};

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
    const id = Number(request.params.id);

    try {
        await deleteTagById(id);
        response.status(200).json({ message: "Tag deleted successfully" });
    } catch (error) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};