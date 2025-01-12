import Tag from '../models/sequelize/Tag';
import {BadRequestError, ConflictError, InternalServerError, NotFoundError} from "../utility/errors";

/**
 * Fetches all tags from the database.
 *
 * @param {number} page - The page number to fetch (default: 1)
 * @param {number} limit - The number of records to fetch per page (default: 10)
 * @returns {Promise<Tag[]>} - A promise that resolves to an array of tags.
 *
 * @example
 * getAllTags(1, 10)
 * // This will fetch the first 10 tags
 */
export const getAllTags = async (page: number, limit: number) => {
    if (isNaN(page) || page <= 0) {
        throw new BadRequestError("Page must be a positive number greater than 0.");
    }

    if (isNaN(limit) || limit <= 0) {
        throw new BadRequestError("Limit must be a positive number greater than 0.");
    }

    if (limit > 100) {
        throw new BadRequestError("Limit must be a positive number less than or equal to 100.");
    }

    const totalTags = await Tag.count();
    const maxPage = Math.ceil(totalTags / limit);

    if (page > maxPage) {
        throw new BadRequestError(`Page ${page} exceeds the maximum page number ${maxPage}.`);
    }

    const offset = (page - 1) * limit;
    return await Tag.findAll({
        offset,
        limit,
    });
};


/**
 * Fetches a tag by its ID.
 *
 * @param {string} id - The ID of the tag to fetch.
 * @returns {Promise<Tag>} - A promise that resolves to a tag.
 *
 * @example
 * getTagById(1)
 * // This will fetch the tag with ID 1
 */
export const getTagById = async (id: number) => {

    if (isNaN(id) || id < 1) {
        throw new BadRequestError("Invalid tag id. Tag id must be a number greater than or equal to 1.");
    }

    const tag = await Tag.findByPk(id);
    if (!tag) {
        throw new NotFoundError("Tag not found");
    }
    return tag;
};

/**
 * Creates a new tag.
 *
 * @param {string} name - The name of the tag to create.
 * @returns {Promise<Tag>} - A promise that resolves to the created tag.
 *
 * @example
 * addTag("Fantasy")
 * // This will create a new tag with the name "Fantasy"
 */
export const addTag = async (name: string) => {

    if (typeof name !== 'string' || name.trim() === '') {
        throw new BadRequestError("Tag name is required");
    }

    if (name.length > 255) {
        throw new ConflictError("Tag name cannot exceed 255 characters.");
    }
    const tag = await Tag.findOne({ where: { name } });
    if (tag) {
        throw new BadRequestError("Tag name already exists");
    }

    const addTag = await Tag.create({ name });
    if (!addTag) {
        throw new InternalServerError("Tag not created");
    }
    return addTag;
};

/**
 * Delete a tag by its ID.
 *
 * @param {number} id - The ID of the tag to delete.
 * @returns {Promise<number>} - A promise that resolves to the number of deleted tags.
 *
 * @example
 * deleteTag(1)
 * // This will delete the tag with ID 1
 *
 */
export const deleteTagById = async (id: number) => {
    if (isNaN(id) || id < 1) {
        throw new BadRequestError("Invalid tag id. Tag id must be a number greater than or equal to 1.");
    }

    const deletedCount = await Tag.destroy({ where: { id } });
    if (deletedCount === 0) {
        throw new NotFoundError("Tag not found");
    }

    return deletedCount;
};
