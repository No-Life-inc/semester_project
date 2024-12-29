import {NotFoundError} from "../../utility/errors";
import {Book} from "../../models/mongoose/BookModel";

/**
 * Get all unique subjects from books.
 *
 * @param page - The page number (default 1).
 * @param limit - The number of items per page (default 10).
 * @returns A paginated list of unique subjects.
 */
export const getSubjectsFromBooks = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const books = await Book.find().lean();
    if (!books || books.length === 0) {
        throw new NotFoundError("No books found.");
    }

    // Collect all subjects using reduce
    const allSubjects = books.reduce((acc, book) => {
        book.subjects.forEach(subject => acc.push(subject.name));
        return acc;
    }, [] as string[]);

    const uniqueSubjects = [...new Set(allSubjects)];
    return uniqueSubjects.slice(skip, skip + limit);
};

/**
 * Search subjects by partial name in books.
 *
 * @param partialName - The partial name to search for.
 * @returns A list of matching subjects.
 */
export const searchSubjectsInBooks = async (partialName: string) => {
    const regex = new RegExp(partialName, "i");

    const books = await Book.find().lean();
    if (!books || books.length === 0) {
        throw new NotFoundError("No books found.");
    }

    // Collect all subjects using reduce
    const allSubjects = books.reduce((acc, book) => {
        book.subjects.forEach(subject => acc.push(subject.name));
        return acc;
    }, [] as string[]);

    // Match subjects by regex
    const matchingSubjects = allSubjects.filter(name => regex.test(name));

    return [...new Set(matchingSubjects)]; // Return unique matches
};

/**
 * Get a specific subject by name from books.
 *
 * @param subjectName - The exact name of the subject.
 * @returns The subject name if found, else throws an error.
 */
export const getSubjectByNameFromBooks = async (subjectName: string) => {
    const books = await Book.find().lean();
    if (!books || books.length === 0) {
        throw new NotFoundError("No books found.");
    }

    // Collect all subjects using reduce
    const allSubjects = books.reduce((acc, book) => {
        book.subjects.forEach(subject => acc.push(subject.name));
        return acc;
    }, [] as string[]);

    // Find the specific subject
    const foundSubject = allSubjects.find(name => name.toLowerCase() === subjectName.toLowerCase());

    if (!foundSubject) {
        throw new NotFoundError(`Subject '${subjectName}' not found.`);
    }

    return foundSubject;
};
