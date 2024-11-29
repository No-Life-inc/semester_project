import { NotFoundError } from "../../utility/errors";
import { Subject } from "../../models/mongoose/SubjectModel";

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
