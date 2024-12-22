import { User } from "../../models/mongoose/UserModel";
import { Book } from "../../models/mongoose/BookModel";
import { NotFoundError, ValidationError } from "../../utility/errors";
import mongoose from "mongoose";

/**
 * Fetch books owned by the user.
 */
export const getUserBooks = async (email: string, page: number = 1, limit: number = 50) => {
    const user = await User.findOne({ email })
        .populate({
            path: "books.book_id",
            options: {
                skip: (page - 1) * limit,
                limit,
            },
        })
        .exec();

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    return user.books;
};

/**
 * Associate a book with a user.
 */
export const addBookToUser = async (email: string, bookId: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    const book = await Book.findById(bookId);
    if (!book) {
        throw new NotFoundError("Book not found.");
    }

    // Check if the user already owns the book
    const alreadyOwned = user.books.some((userBook) => userBook.book_id.equals(bookId));
    if (alreadyOwned) {
        throw new ValidationError("User already owns this book.");
    }

    // Build embeddedBook from the fields in the book document
    const embeddedBook = {
        authors: book.authors,            // or map them if needed
        publisher: book.publisher,
        title: book.title,
        isbn: book.isbn,
        isbn10: book.isbn10,
        isbn13: book.isbn13,
        subjects: book.subjects,
        language: book.language,
        pages: book.pages,
        publication_date: book.publication_date,
        image: book.image,
        title_long: book.title_long,
        synopsis: book.synopsis,
        msrp: book.msrp,
        dimensions: book.dimensions,
        binding: book.binding,
        edition: book.edition
    };

    // Now include 'embeddedBook' in the push
    user.books.push({
        _id: new mongoose.Types.ObjectId(),
        book_id: book._id,
        tags: [],
        embeddedBook: embeddedBook,
    });

    await user.save();
    return user.books;
};

/**
 * Remove a book from the user's owned books.
 */
export const removeBookFromUser = async (email: string, userBookId: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    // Match the `userBookId` to the `_id` of the user-book object
    const bookIndex = user.books.findIndex((userBook) =>
        userBook._id.toString() === userBookId
    );

    if (bookIndex === -1) {
        throw new NotFoundError("Book not found in user's collection.");
    }

    // Remove the book from the user's books array
    user.books.splice(bookIndex, 1);
    await user.save();

    return user.books;
};
