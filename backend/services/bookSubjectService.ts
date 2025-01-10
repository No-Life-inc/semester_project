import Book from "../models/sequelize/Book"; // Ensure the path is correct
import Subject from "../models/sequelize/Subject"; // Ensure the path is correct

/**
 * Fetches books associated with a given subject ID.
 * 
 * @param {number} subjectId - The ID of the subject.
 * @param {number} page - The page number for pagination (default: 1).
 * @param {number} limit - The number of records per page (default: 50).
 * @returns {Promise<Book[]>} - A promise that resolves to a list of books associated with the subject.
 */
export const getBooksBySubject = async (
    subjectId: number,
    page: number = 1,
    limit: number = 50
): Promise<Book[]> => {
    page = page || 1;
    limit = limit || 50;
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
        const books = await Book.findAll({
            offset,
            limit,
            include: [
                {
                    model: Subject,
                    as: "subjects",
                    where: { id: subjectId },
                    required: true,
                },
            ],
        });

        return books;
    } catch (error) {
        throw error;
    }
};
