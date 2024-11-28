import { Book } from "../../models/mongoose/BookModel";
import { NotFoundError } from "../../utility/errors";
import { Subject } from "../../models/mongoose/SubjectModel";
import {Types} from "mongoose";

/**
 * Get all unique subjects from books.
 * 
 * @param page - The page number (default 1).
 * @param limit - The number of items per page (default 10).
 * @returns A paginated list of unique subjects.
 */
export const getSubjects = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const subjects = await Subject.find().skip(skip).limit(limit).lean();
    return subjects;
  };

/**
 * Search subjects by partial name.
 * 
 * @param partialName - The partial name to search for.
 * @returns A list of matching subjects.
 */
export const getSubjectsByPartialName = async (partialName: string) => {
    const regex = new RegExp(partialName, "i");
    return Subject.find({ name: regex }).lean();
  };

/**
 * Get books by subject ID.
 * 
 * @param subjectId - The ObjectId of the subject.
 * @returns A list of books linked to the subject.
 * @throws NotFoundError if no books or subject are found.
 */
export const getBooksBySubject = async (subjectId: string) => {
    // Validate if subjectId is a valid ObjectId
    if (!Types.ObjectId.isValid(subjectId)) {
        throw new NotFoundError(`Invalid Subject ID: ${subjectId}`);
    }

    // Fetch books linked to the subject by ObjectId
    const books = await Book.find({ subjects: subjectId }).lean();

    if (books.length === 0) {
        throw new NotFoundError(`No books found for subject with ID: ${subjectId}`);
    }

    return books;
};

/**
 * Get subject by its ID.
 * 
 * @param subjectId - The ID of the subject.
 * @returns The subject object if found, else null.
 */
export const getSubjectById = async (subjectId: string) => {
    const subject = await Subject.findById(subjectId).lean();
    if (!subject) {
      throw new NotFoundError(`Subject with ID ${subjectId} not found.`);
    }
    return subject;
  };
