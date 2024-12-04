import "../models/sequelize/Associations"
import Book from "../models/sequelize/Book"; // Adjust the path to your Book model
import UserBook from "../models/sequelize/UserBook";
import User from "../models/sequelize/User";
import { NotFoundError, UnauthorizedError, ValidationError } from "../utility/errors";


/**
 * Fetches user books and their associated book details.
 * 
 * @param {string} email - The email of the user to fetch books for.
 * @param {number} page - The page number to fetch (default: 1)
 * @param {number} limit - The number of records to fetch per page (default: 50)
 * @returns {Promise<{ userBooks: UserBook[]}>} - A promise that resolves to an object containing user books and their associated book details.
 * 
 * @example
 * getUserBooks(1, 50)
 * // This will fetch the first 50 user books and their associated book details.
 */
export const getUserBooks = async (email: string, page: number = 1, limit: number = 50): Promise<UserBook[]> => {
    
    if (email === null || email === undefined) {
        throw new ValidationError("Invalid email. Email must be a string.");
    }

    if (isNaN(page) || page < 1) {
        throw new ValidationError("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if (isNaN(limit) || limit < 1) {
        throw new ValidationError("Invalid limit. Limit must be a number greater than or equal to 1.");
    }

    if (limit > 100) {
        throw new ValidationError("Invalid limit. Limit must be a number less than or equal to 100.");
    }

    const offset = (page - 1) * limit;

    try {

        const user = await User.findOne({ where: { email } });

        const userBooks = await UserBook.findAll({
            where: { user_id: user.id },
            offset,
            limit,
            include: [
                {
                    model: Book,
                    as: 'book', // Ensure this matches the alias used in your association
                },
            ],
        });

        return userBooks;
    } catch (error) {
        throw error;
    }
};


/**
 * Adds a book to a user's collection.
 * 
 * @param {string} email - The email of the user to add the book to.
 * @param {number} bookId - The ID of the book to add to the user.
 * @returns {Promise<void>} - A promise that resolves when the book is added to the user's collection.
 * 
 * @example
 * addBookToUser(1, 1)
 * // This will add the book with ID 1 to the user with ID 1.
 */
export const addBookToUser = async (email: string, bookId: number): Promise<UserBook> => {

    try {

        if (email === null || email === undefined) {
            throw new ValidationError("Invalid email. Email must be a string.");
        }

        if (isNaN(bookId) || bookId < 1) {
            throw new ValidationError("Invalid book id. Book id must be a number greater than or equal to 1.");
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            throw new NotFoundError("Book not found");
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Check if the user already has the book in their collection
        const existingUserBook = await UserBook.findOne({
            where: {
                user_id: user.id,
                book_id: bookId,
            },
        });

        if (existingUserBook) {
            return existingUserBook;
        }

        // Add the book to the user's collection
        const userBook = await UserBook.create({
            user_id: user.id,
            book_id: bookId,
        });

        return userBook;
    } catch (error) {
        throw error;
    }
}

/**
 * Removes a book from a user's collection.
 * 
 * @param {string} email - The email of the user to remove the book from.
 * @param {number} userBookId - The ID of the userBook entry to remove.
 * @returns {Promise<boolean>} - A promise that resolves to true if the book was removed, false otherwise.
 * 
 * @example
 * removeBookFromUser(1)
 * // This will remove the userBook entry with ID 1.
 */
export const removeBookFromUser = async (email: string, userBookId: number): Promise<boolean> => {
    try {

        if (email === null || email === undefined) {
            throw new ValidationError("Invalid email. Email must be a string.");
        }

        if (isNaN(userBookId) || userBookId < 1) {
            throw new ValidationError("Invalid userBook id. UserBook id must be a number greater than or equal to 1.");
        }

        const user = await User.findOne({ where: { email } });

        const userBook = await UserBook.findByPk(userBookId);
        if (!userBook) {
            throw new NotFoundError("UserBook not found");
        }

        if (userBook.userId !== user.id) {
            throw new UnauthorizedError("UserBook does not belong to the user");
        }

        await userBook.destroy();

        return true;
    } catch (error) {
        throw error;
    }
};