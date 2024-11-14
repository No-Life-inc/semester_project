import "../models/sequelize/Associations"
import Book from "../models/sequelize/Book";
import Subject from "../models/sequelize/Subject";
import Author from "../models/sequelize/Author";
import Publisher from "../models/sequelize/Publisher";
import { Op } from "sequelize";
import BookData from "../types/bookData";
import sequelize from "../config/SqlConfig";

/**
 * Fetches all books from the database.
 * 
 * @param {number} page - The page number to fetch (default: 1)
 * @param {number} limit - The number of records to fetch per page (default: 50)
 * @returns {Promise<Book[]>} - A promise that resolves to an array of Book instances.
 * 
 * @example
 * getBooks(1, 50)
 * This will fetch the first 50 books
 */
export const getBooks = async (page: number = 1, limit: number = 50) => {

    if (page === undefined) {
        page = 1;
    }

    if (limit === undefined) {
        limit = 50;
    }

    // Validate page and limit
    if (isNaN(page) || page < 1) {
        throw new Error("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if(isNaN(limit) || limit < 1) {
        throw new Error("Invalid limit. Limit must be a number greater than or equal to 1.");
    }

    if (limit > 100) {
        throw new Error("Invalid limit. Limit must be a number less than or equal to 100.");
    }
  
    const offset = (Number(page) - 1) * Number(limit);
  
    try {
      const books = await Book.findAll({
        offset,
        limit: Number(limit),
      });
     return books;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  };

/**
 * Fetches a book by its ID.
 * 
 * @param {number} id - The ID of the book to fetch
 * @returns {Promise<Book>} - A promise that resolves to a Book instance.
 * 
 * @example
 * getBookById(1)
 * // This will fetch the book with ID 1
*/
export const getBookById = async (id: number) => {

    try {
        if (isNaN(id) || id < 1) {
            throw new Error("Invalid book id. Book id must be a number greater than or equal to 1.");
        }

        const book = await Book.findByPk(id);
        
        if (!book) {
            throw new Error("Book not found");
        }

        return book;
    } catch (error) {
        console.error("Error fetching book by id:", error);
        throw error;
    }
}

/**
 * Fetches books by a subset of the title.
 * 
 * @param {string} title - The subset of the title to search for.
 * @returns {Promise<Book[]>} - A promise that resolves to an array of Book instances.
 * 
 * @example
 * getBooksByTitle("Harry")
 * // This will fetch all books with titles containing "Harry".
 */
export const getBooksByTitle = async (title: string): Promise<Book[]> => {
    try {
        if (!title) {
            throw new Error("Invalid title. Title must be a non-empty string.");
        }

        const books = await Book.findAll({
            where: {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        });

        return books;
    } catch (error) {
        console.error("Error fetching books by title:", error);
        throw error;
    }
};

/**
 * Adds new books to the database.
 * 
 * @param {object[]} booksData - The data of the books to add.
 * @returns {Promise<Book[]>} - A promise that resolves to an array of added Book instances.
 * 
 * @example
 * addBooks([{ title: "New Book", author: "Author Name" }])
 * // This will add new books to the database.
 */

export const addBooks = async (booksData: BookData[]): Promise<Book[]> => {
    const t = await sequelize.transaction(); // Start a transaction

    try {
        const addedBooks = [];

        for (const bookData of booksData) {
            const { subjects, authors, publisher, ...bookDetails } = bookData;

            // Handle publisher
            let publisherInstance = null;
            if (publisher) {
                publisherInstance = await Publisher.findOne({ where: { name: publisher }, transaction: t });
                if (!publisherInstance) {
                    publisherInstance = await Publisher.create({ name: publisher }, { transaction: t });
                }
                bookDetails.publisher_id = publisherInstance.id;
            }

            // Create the book
            const book = await Book.create(bookDetails, { transaction: t });

            // Handle subjects
            if (subjects && subjects.length > 0) {
                for (const subjectName of subjects) {
                    let subject = await Subject.findOne({ where: { name: subjectName }, transaction: t });
                    if (!subject) {
                        subject = await Subject.create({ name: subjectName }, { transaction: t });
                    }

                    // Check if the book is already associated with the subject to avoid duplicates
                    const existingAssociation = await sequelize.models.book_subjects.findOne({
                        where: { book_id: book.id, subject_id: subject.id },
                        transaction: t,
                    });

                    if (!existingAssociation) {
                        await sequelize.models.book_subjects.create({
                            book_id: book.id,
                            subject_id: subject.id,
                        }, { transaction: t });
                    }
                }
            }

            // Handle authors
            if (authors && authors.length > 0) {
                for (const authorName of authors) {
                    let author = await Author.findOne({ where: { name: authorName }, transaction: t });
                    if (!author) {
                        author = await Author.create({ name: authorName }, { transaction: t });
                    }

                    // Check if the book is already associated with the author to avoid duplicates
                    const existingAssociation = await sequelize.models.book_authors.findOne({
                        where: { book_id: book.id, author_id: author.id },
                        transaction: t,
                    });

                    if (!existingAssociation) {
                        await sequelize.models.book_authors.create({
                            book_id: book.id,
                            author_id: author.id,
                        }, { transaction: t });
                    }
                }
            }

            addedBooks.push(book);
        }

        await t.commit(); // Commit the transaction if all operations are successful
        return addedBooks;
    } catch (error) {
        await t.rollback(); // Rollback the transaction if there's an error
        console.error("Error adding books:", error);
        throw error;
    }
};