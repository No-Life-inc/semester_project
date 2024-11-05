import Book from "../models/sequelize/Book"; // Adjust the path to your Book model
import UserBook from "../models/sequelize/UserBook";
import User from "../models/sequelize/User";

export const addBookToUser = async (userId: number, bookId: number) => {
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

        // Add the book to the user's collection
        await UserBook.create({
            user_id: userId,
            book_id: bookId,
        });

        return book;
    } catch (error) {
        console.error("Error adding book to user:", error);
        throw error;
    }
}