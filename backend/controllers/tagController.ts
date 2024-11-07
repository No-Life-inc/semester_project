import express, { Request, Response } from "express";
import {addTag, addTagToBook, deleteTagById, deleteTagFromBook, getAllTags, getTagById} from "../services/tagService";

const router = express.Router();

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
        console.error("Error fetching tags:", error);
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
        console.error("Error creating tag:", error);
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
        const tag = await deleteTagById(id);
        response.json({ message: "Tag deleted successfully" });
    } catch (error) {
        console.error("Error deleting tag:", error);

        if (error.message === "Tag not found") {
            return response.status(404).json({ error: error.message });
        }
        response.status(500).json({ error: "An error occurred while deleting tag" });
    }
}

/**
 * Adds a tag to a book.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // POST /tag/addTagToBook
 * // body: { user_book_id: 1, tag_id: 1 }
 *
 * This will add the tag with ID 1 to the book with ID 1
 */
export const addTagToBookController = async (request: Request, response: Response) => {
    const { user_book_id, tag_id } = request.body;

    try {
        const book = await addTagToBook(user_book_id, tag_id);
        response.json(book);
    } catch (error) {
        console.error("Error adding tag to book:", error);
        response.status(500).json({ error: "An error occurred while adding tag to book" });
    }
}

export const deleteTagFromBookController = async (request: Request, response: Response) => {
    const { user_book_id, tag_id } = request.body;

    // Konverter værdierne til tal
    const bookId = Number(user_book_id);
    const tagId = Number(tag_id);

    if (isNaN(bookId) || isNaN(tagId)) {
        return response.status(400).json({ error: "Invalid user_book_id or tag_id" });
    }

    try {
        const rowsDeleted = await deleteTagFromBook(tagId, bookId);
        if (rowsDeleted === 0) {
            return response.status(404).json({ error: "Tag or association not found" });
        }
        response.json({ message: "Tag deleted from book successfully" });
    } catch (error) {
        console.error("Error deleting tag from book:", error);
        response.status(500).json({ error: "An error occurred while deleting tag from book" });
    }
};


