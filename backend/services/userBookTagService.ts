import UserBookTag from "../models/sequelize/UserBookTag";
import {getTagById} from "./tagService";
import Tag from "../models/sequelize/Tag";
import {getUserBookById} from "./userBookService";
import {BaseError, ConflictError, InternalServerError, NotFoundError} from "../utility/errors";


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
export const addTagToBook = async (tagId: number, userBookId: number, userId: number) => {
    try{
        const userBook = await getUserBookById(userBookId);

        if (userBook.userId !== userId) {
            throw new ConflictError("You do not have permission to modify this book");
        }

        await getTagById(tagId);

        const existingUserBookTag = await UserBookTag.findOne({
            where: {
                tagId: tagId,
                userBookId: userBookId
            }
        });

        if(existingUserBookTag){
            throw new ConflictError("Tag already exists on the book");
        }

        return await UserBookTag.create({tagId: tagId, userBookId: userBookId});

    }catch (error) {
        if (error instanceof BaseError) {
            throw error;
        }
        else {
            throw new InternalServerError("An error occurred while adding tag to book");
        }
    }
}

/**
 * Deletes a tag from a book.
 *
 * @param {number} tagId - The ID of the tag to delete.
 * @param {number} bookId - The ID of the book to delete the tag from.
 * @param {number} userId - The ID of the user making the request.
 * @returns {Promise<number>} - A promise that resolves to the number of deleted tags.
 *
 * @example
 * deleteTagFromBook(1, 1)
 * // This will delete the tag with ID 1 from the book with ID 1
 */
export const deleteTagFromBook = async (tagId: number, userBookId: number, userId: number) => {
    try {
        const userBook = await getUserBookById(userBookId);

        if (userBook.userId !== userId) {
            throw new ConflictError("You do not have permission to modify this book.");
        }

        await getTagById(tagId);

        const deletedCount = await UserBookTag.destroy({
            where: {
                tagId: tagId,
                userBookId: userBookId
            }
        });

        if (deletedCount === 0) {
            throw new NotFoundError("Tag not found on the book.");
        }

        return deletedCount;
    } catch (error) {
        if (error instanceof BaseError) {
            throw error;
        } else {
            throw new InternalServerError("An error occurred while deleting tag from book.");
        }
    }
};


/**
 * Gets tags for a book if the user owns the book.
 *
 * @param {number} userBookId - The ID of the book to get tags for.
 * @param {number} userId - The ID of the user making the request.
 * @returns {Promise<Tag[]>} - A promise that resolves to an array of tags.
 *
 * @example
 * getTagsForBook(1, 123)
 * // This will return the tags for the book with ID 1 if the user has permission.
 */
export const getTagsForBook = async (userBookId: number, userId: number) => {
    try {
        const userBook = await getUserBookById(userBookId);

        if (userBook.userId !== userId) {
            throw new ConflictError("You do not have permission to view this book.");
        }

        const tags = await UserBookTag.findAll({
            where: { userBookId },
            include: [{ model: Tag, as: "tag" }],
        });

        return tags;
    } catch (error) {
        if (error instanceof BaseError) {
            throw error;
        } else {
            throw new InternalServerError("An error occurred while fetching tags for book.");
        }
    }
};
