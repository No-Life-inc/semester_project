import {getBookById} from "./bookService";
import UserBookTag from "../models/sequelize/UserBookTag";
import {getTagById} from "./tagService";
import Tag from "../models/sequelize/Tag";


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
        console.log("Validating tag and book existence:", { tagId, userBookId }); // Log input

        const tag = await getTagById(tagId);
        const userBook = await getBookById(userBookId);

        if(!tag || !userBook){
            throw new Error("Tag or book not found");
        }

        return await UserBookTag.create({tagId: tagId, userBookId: userBookId});

    } catch (error) {
        throw new Error("An error occurred while adding tag to book");
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

export const getTagsForBook = async (userBookId: number) => {
    try {
        return await UserBookTag.findAll({
            where: { userBookId },
            include: [{ model: Tag, as: "tag" }],
        });
    } catch (error) {
        console.error("Error fetching tags for book:", error);
        throw error;
    }
};
