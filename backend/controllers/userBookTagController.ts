import {Request, Response} from "express";
import {addTagToBook, deleteTagFromBook, getTagsForBook } from "../services/userBookTagService";
import {BaseError} from "../utility/errors";
import {getUserIdByEmail} from "../services/userService";
import {AuthenticatedRequest} from "../types/authenticatedRequest";

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
 * // body: { tag_id: 1, user_book_id: 1 }
 *
 * This will add the tag with ID 1 to the book with ID 1
 */
export const addTagToBookController = async (request: AuthenticatedRequest, response: Response) => {
    const { tag_id, user_book_id } = request.body;
    const userId = await getUserIdByEmail(request.user.email);

    if (!tag_id || !user_book_id || isNaN(Number(tag_id)) || isNaN(Number(user_book_id))) {
        return response.status(400).json({ error: "Invalid tag_id or user_book_id" });
    }

    try {
        const book = await addTagToBook(tag_id, user_book_id, userId);
        response.json(book);
    } catch (error) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
    }
}

/**
 * Deletes a tag from a book.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // DELETE /tag/deleteTagFromBook
 * // body: { tag_id: 1, user_book_id: 1 }
 *
 * This will delete the tag with ID 1 from the book with ID 1
 */
export const deleteTagFromBookController = async (request: AuthenticatedRequest, response: Response) => {
    const { tag_id, user_book_id } = request.body;
    const userId = await getUserIdByEmail(request.user.email);

    const tagId = Number(tag_id);
    const bookId = Number(user_book_id);

    if (!tag_id || !user_book_id || isNaN(Number(tag_id)) || isNaN(Number(user_book_id))) {
        return response.status(400).json({ error: "Invalid tag_id or user_book_id" });
    }

    try {
        const rowsDeleted = await deleteTagFromBook(tagId, bookId, userId);
        if (rowsDeleted === 0) {
            return response.status(404).json({ error: "Tag or association not found" });
        }
        response.json({ message: "Tag deleted from book successfully" });
    } catch (error) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};

export const getTagsForBookController = async (request: AuthenticatedRequest, response: Response) => {
    const { userBookId } = request.params;
    const userId = await getUserIdByEmail(request.user.email);


    if (!userBookId|| isNaN(Number(userBookId))) {
        return response.status(400).json({ error: "userBookId is required" });
    }

    try {
        const tags = await getTagsForBook(Number(userBookId), userId);
        response.status(200).json(tags);
    } catch (error) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};