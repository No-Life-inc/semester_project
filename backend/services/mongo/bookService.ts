import { NotFoundError } from "../../utility/errors";
import { Book } from "../../models/mongoose/BookModel";

/**
 * Fetches books from the MongoDB database with pagination.
 *
 * @param page - The page number for pagination (defaults to 1).
 * @param limit - The number of books to fetch per page (defaults to 50).
 *
 * @returns A list of books.
 */
export const getBooks = async (page: number = 1, limit: number = 50) => {
    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);

    const books = await Book.find()
        .skip(skip)
        .limit(limit)
        .lean();

    if (books.length === 0) {
        throw new NotFoundError("No books found.");
    }

    return books;
};

/**
 * Fetches books from the MongoDB database by subject name.
 *
 * @param subjectName - The subject name to search for.
 *
 * @returns A list of books.
 */
export const getBooksBySubjectName = async (subjectName: string) => {
    const books = await Book.find({
        "subjects.name": { $regex: subjectName, $options: "i" },
    }).lean();

    if (books.length === 0) {
        throw new NotFoundError(`No books found for subject matching: ${subjectName}`);
    }

    return books;
};

/**
 * Fetches a book from the MongoDB database by ISBN.
 *
 * @param isbn - The ISBN of the book to fetch.
 *
 * @returns A book.
 */
export const getBookByISBN = async (isbn: string) => {
    const book = await Book.findOne({ isbn }).lean();

    if (!book) {
        throw new NotFoundError(`No book found with ISBN: ${isbn}`);
    }

    return book;
};

/**
 * Fetches books from the MongoDB database by title.
 *
 * @param title - The title to search for.
 *
 * @returns A list of books.
 */
export const getBooksByTitle = async (title: string) => {
    const books = await Book.find({
        title: { $regex: title, $options: "i" },
    }).lean();

    if (books.length === 0) {
        throw new NotFoundError(`No books found with title matching: ${title}`);
    }

    return books;
};
