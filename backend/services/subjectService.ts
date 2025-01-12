import Subject from "../models/sequelize/Subject";
import { ValidationError, NotFoundError} from "../utility/errors";

/**
 * Fetches a paginated list of subjects from the database.
 *
 * @param {number} [page=1] - The page number to fetch (default is 1).
 * @param {number} [limit=50] - The number of records to fetch per page (default is 50).
 * @returns {Promise<Subject[]>} - A promise that resolves to an array of subjects.
 * @throws {Error} - Throws an error if the page or limit parameters are invalid or if there is an error fetching the subjects.
 *
 * @example
 * // Fetch the first page of subjects with a limit of 50 records per page
 * const subjects = await getAllSubjects(1, 50);
 *
 * @example
 * // Fetch the second page of subjects with a limit of 20 records per page
 * const subjects = await getAllSubjects(2, 20);
 */

//TODO: change error codes
export const getAllSubjects = async (page: number = 1, limit: number = 50) => {
    if (page === undefined) {
        page = 1;
    }

    if (limit === undefined) {
        limit = 50;
    }

    if (isNaN(page) || page < 1) {
        throw new ValidationError("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if(isNaN(limit) || limit < 1) {
        throw new ValidationError("Invalid limit. Limit must be a number greater than or equal to 1.");
    }

    if (limit > 100) {
        throw new ValidationError("Invalid limit. Limit must be a number less than or equal to 100.");
    }
  
    const offset = (Number(page) - 1) * Number(limit);
  
    try {
      const books = await Subject.findAll({
        offset,
        limit: Number(limit),
      });
     return books;
    } catch (error) {
      throw error;
    }
  };

/**
 * Fetches a single subject by its ID.
 * 
 * @param {number} id - The ID of the subject to fetch.
 * @returns {Promise<Subject>} - A promise that resolves to a Subject instance.
 * 
 * @throws {Error} Throws an error if id is invalid or if the subject is not found.
 */
export const getSubjectById = async (id: number) => {
    try {
        if (typeof id !== "number" || isNaN(id) || id < 1) {
            throw new ValidationError("Invalid subject ID. Subject ID must be a number greater than or equal to 1.");
        }

        const subject = await Subject.findByPk(id);
        
        if (!subject) {
            throw new NotFoundError("Subject not found");
        }
        return subject;
    } catch (error) {
        throw error;
    }
};
