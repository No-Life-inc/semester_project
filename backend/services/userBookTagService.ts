import UserBookTag from "../models/sequelize/UserBookTag";
import {getTagById} from "./tagService";
import {getUserBookById} from "./userBookService";
import {BaseError} from "../utility/errors";


//Add docstrings to the following functions'
/**
 * Adds a tag to a book.
 *
 * @param {number} tagId - The ID of the tag to add.
 * @param {number} bookId - The ID of the book to add the tag to.
 * @returns {Promise<UserBookTag>} - A promise that resolves to the created UserBookTag.
 *
 * @example
 * addTagToBook(1, 1)
 * // This will add the tag with ID 1 to the book with ID 1
 */
export const addTagToBook = async (tagId: number, userBookId: number) => {
    try{
        const tag = await getTagById(tagId);
        const userBook = await getUserBookById(userBookId);

        if(!tag || !userBook){
            throw new Error("Tag or book not found");
        }

        return await UserBookTag.create({tagId: tagId, userBookId: userBookId});

    }catch (error) {
        if (error instanceof BaseError) {
            throw error;
        }
        else {
            throw new Error("An error occurred while adding tag to book");
        }
    }
}

/**
 * Deletes a tag from a book.
 *
 * @param {number} tagId - The ID of the tag to delete.
 * @param {number} bookId - The ID of the book to delete the tag from.
 * @returns {Promise<number>} - A promise that resolves to the number of deleted tags.
 *
 * @example
 * deleteTagFromBook(1, 1)
 * // This will delete the tag with ID 1 from the book with ID 1
 */
export const deleteTagFromBook = async (tagId: number, bookId: number) => {
    try {
        return await UserBookTag.destroy({
            where: {
                tagId: tagId,
                userBookId: bookId
            }
        });
    } catch (error) {
        throw new Error("An error occurred while deleting tag from book");
    }
};
