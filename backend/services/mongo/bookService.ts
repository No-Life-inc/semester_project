import { NotFoundError } from "../../utility/errors";
import {Types} from "mongoose";
import {Book, IBook} from "../../models/mongoose/BookModel";
import {Subject} from "../../models/mongoose/SubjectModel";

// getBooks
/**
 * Fetches books from the MongoDB database with pagination.
 *
 * @param page - The page number for pagination (defaults to 1).
 * @param limit - The number of books to fetch per page (defaults to 50).
 *
 * @returns A list of books.
 * @throws NotFoundError if no books are found.
 *
 * @example
 * const books = await getBooks(1, 50);
 * // Fetches the first 50 books from the database.
 */
export const getBooks = async (page: number = 1, limit: number = 50) => {
    // Ensure 'page' and 'limit' are valid integers
    const pageNumber = Math.max(1, parseInt(page.toString(), 10));
    const limitNumber = Math.max(1, parseInt(limit.toString(), 10));

    if (pageNumber < 1) {
        throw new NotFoundError("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if (limitNumber < 1) {
        throw new NotFoundError("Invalid limit. Limit must be a number greater than or equal to 1.");
    }

    // Fetch books from MongoDB with pagination
    const books = await Book.find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean() as IBook[];

    if (books.length === 0) {
        throw new NotFoundError("No books found.");
    }

    return books;
}

// getBooksBySubjectText
/**
 * Fetches books from the MongoDB database by subject text.
 *
 * @param subjectText - The subject text to search for.
 *
 * @returns A list of books.
 * @throws NotFoundError if no subjects are found or no books are found for the subjects.
 *
 * @example
 * const books = await getBooksBySubjectText("math");
 * // Fetches books with subjects containing the text "math".
 */

export const getBooksBySubjectText = async (subjectText: string) => {
    const subjects = await Subject.find({
        name: { $regex: subjectText, $options: 'i' }
    }).lean();

    if (subjects.length === 0) {
        throw new NotFoundError(`No subjects found matching: ${subjectText}`);
    }

    const subjectIds = subjects.map(subject => subject._id);

    const books = await Book.find({ subjects: { $in: subjectIds } }).lean();

    if (books.length === 0) {
        throw new NotFoundError(`No books found for subjects matching: ${subjectText}`);
    }

    return books;
};

// getBookByISBN
/**
 * Fetches a book from the MongoDB database by ISBN.
 *
 * @param isbn - The ISBN of the book to fetch.
 *
 * @returns A book.
 * @throws NotFoundError if no book is found.
 *
 * @example
 * const book = await getBookByISBN("9781593275846");
 * // Fetches the book with the ISBN "9781593275846".
 */
export const getBookByISBN = async (isbn: string) => {
    const book = await Book
        .findOne({isbn: isbn})
        .lean();

    if (!book) {
        throw new NotFoundError(`No book found with ISBN: ${isbn}`);
    }

    return book;
}

// getBooksByTitle
/**
 * Fetches books from the MongoDB database by title.
 *
 * @param title - The title to search for.
 *
 * @returns A list of books.
 * @throws NotFoundError if no books are found.
 *
 * @example
 * const books = await getBooksByTitle("math");
 * // Fetches books with titles containing the text "math".
 */
export const getBooksByTitle = async (title: string) => {
    const books = await Book.find({
        title: { $regex: title, $options: 'i' }
    }).lean();

    if (books.length === 0) {
        throw new NotFoundError(`No books found with title matching: ${title}`);
    }

    return books;
}
