import {Request, Response} from "express";
import {addTagToBook, deleteTagFromBook} from "../services/userBookTagService";

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
export const addTagToBookController = async (request: Request, response: Response) => {
    const { tag_id, user_book_id } = request.body;

    try {
        const book = await addTagToBook(tag_id, user_book_id);
        response.json(book);
    } catch (error) {
        if (error) {
            response.status(400).json({ error: error.message });
        } else if (error) {
            response.status(404).json({ error: error.message });
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
export const deleteTagFromBookController = async (request: Request, response: Response) => {
    const { tag_id, user_book_id } = request.body;

    const tagId = Number(tag_id);
    const bookId = Number(user_book_id);

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
        response.status(500).json({ error: "An error occurred while deleting tag from book" });
    }
};
