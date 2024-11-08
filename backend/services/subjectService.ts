import Subject from "../models/sequelize/Subject";

/**
 * Fetches all subjects from the database.
 * 
 * @returns {Promise<Subject[]>} - A promise that resolves to an array of Subject instances.
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
    try {
        const subjects = await Subject.findAll();
        return subjects;
    } catch (error) {
        console.error("Error fetching subjects:", error);
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
export const getSubjectById = async (id: number): Promise<Subject> => {
    if (isNaN(id) || id < 1) {
        throw new Error("Invalid subject ID. Subject ID must be a number greater than or equal to 1.");
    }

    try {
        const subject = await Subject.findByPk(id);
        if (!subject) {
            throw new Error("Subject not found");
        }
        return subject;
    } catch (error) {
        console.error("Error fetching subject by ID:", error);
        throw error;
    }
};
