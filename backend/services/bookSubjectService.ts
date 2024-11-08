import BookSubject from "../models/sequelize/BookSubject";
import Book from "../models/sequelize/Book"; // Ensure the path is correct
import { Op } from "sequelize";

/**
 * Fetches books associated with a given subject ID.
 * 
 * @param {number} subjectId - The ID of the subject.
 * @param {number} page - The page number for pagination (default: 1).
 * @param {number} limit - The number of records per page (default: 50).
 * @returns {Promise<Book[]>} - A promise that resolves to a list of books associated with the subject.
 */
export const getBooksBySubject = async (subjectId: number, page: number = 1, limit: number = 50): Promise<BookSubject[]> => {
    if (isNaN(subjectId) || subjectId < 1) {
        throw new Error("Invalid subject ID. Subject ID must be a number greater than or equal to 1.");
    }

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
        const books = await BookSubject.findAll({
            where: { subject_id: subjectId },
            offset,
            limit,
            include: [
                {
                    model: Book,
                    as: "book", // Ensure this matches the alias used in your association
                },
            ],
        });

        return books;
    } catch (error) {
        console.error("Error fetching books by subject:", error);
        throw error;
    }
};
