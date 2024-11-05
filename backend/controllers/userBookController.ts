import Book from "../models/sequelize/Book"; // Adjust the path to your Book model
import UserBook from "../models/sequelize/UserBook";
import User from "../models/sequelize/User";


/**
 * Fetches user books and their associated book details.
 * 
 * @param {number} userId - The ID of the user to fetch books for.
 * @param {number} page - The page number to fetch (default: 1)
 * @param {number} limit - The number of records to fetch per page (default: 50)
 * @returns {Promise<{ userBooks: UserBook[], books: Book[] }>} - A promise that resolves to an object containing user books and their associated book details.
 * 
 * @example
 * getUserBooks(1, 50)
 * // This will fetch the first 50 user books and their associated book details.
 */
export const getUserBooks = async (userId: number, page: number = 1, limit: number = 50): Promise<{ userBooks: UserBook[], books: Book[] }> => {
    // Validate page and limit
    if (isNaN(page) || page < 1) {
        throw new Error("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if (isNaN(limit) || limit < 1) {
        throw new Error("Invalid limit. Limit must be a number greater than or equal to 1.");
    }

    if (limit > 100) {
        throw new Error("Invalid limit. Limit must be a number less than or equal to 100.");
    }

    const offset = (page - 1) * limit;

    try {
        const userBooks = await UserBook.findAll({
            where: { user_id: userId },
            offset,
            limit,
            include: [
                {
                    model: Book,
                    as: 'book', // Ensure this matches the alias used in your association
                },
            ],
        });

        const books = userBooks.map(userBook => (userBook as UserBook & { book: Book }).book);

        return { userBooks, books };
    } catch (error) {
        console.error("Error fetching userBooks:", error);
        throw error;
    }
};


/**
 * Adds a book to a user's collection.
 * 
 * @param {number} userId - The ID of the user to add the book to.
 * @param {number} bookId - The ID of the book to add to the user.
 * @returns {Promise<void>} - A promise that resolves when the book is added to the user's collection.
 * 
 * @example
 * addBookToUser(1, 1)
 * // This will add the book with ID 1 to the user with ID 1.
 */
export const addBookToUser = async (userId: number, bookId: number): Promise<UserBook> => {

    try {

        if (isNaN(userId) || userId < 1) {
            throw new Error("Invalid user id. User id must be a number greater than or equal to 1.");
        }

        if (isNaN(bookId) || bookId < 1) {
            throw new Error("Invalid book id. Book id must be a number greater than or equal to 1.");
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            throw new Error("Book not found");
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Check if the user already has the book in their collection
        const existingUserBook = await UserBook.findOne({
            where: {
                user_id: userId,
                book_id: bookId,
            },
        });

        if (existingUserBook) {
            return existingUserBook;
        }

        // Add the book to the user's collection
        const userBook = await UserBook.create({
            user_id: userId,
            book_id: bookId,
        });

        return userBook;
    } catch (error) {
        console.error("Error adding book to user:", error);
        throw error;
    }
}

/**
 * Removes a book from a user's collection.
 * 
 * @param {number} userBookId - The ID of the userBook entry to remove.
 * @returns {Promise<boolean>} - A promise that resolves to true if the book was removed, false otherwise.
 * 
 * @example
 * removeBookFromUser(1)
 * // This will remove the userBook entry with ID 1.
 */
export const removeBookFromUser = async (userBookId: number): Promise<boolean> => {
    try {
        if (isNaN(userBookId) || userBookId < 1) {
            throw new Error("Invalid userBook id. UserBook id must be a number greater than or equal to 1.");
        }

        const userBook = await UserBook.findByPk(userBookId);
        if (!userBook) {
            throw new Error("UserBook not found");
        }

        await userBook.destroy();

        return true;
    } catch (error) {
        console.error("Error removing book from user:", error);
        throw error;
    }
};