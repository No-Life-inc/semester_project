import Tag from '../models/sequelize/Tag';

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
        throw new Error("Invalid tag id. Tag id must be a number greater than or equal to 1.");
    }

    const tag = await Tag.findByPk(id);
    if (!tag) {
        throw new Error("Tag not found");
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
    if (!name) {
        throw new Error("Tag name is required");
    }
    try{
        return await Tag.create({name});
    } catch (error) {
        throw new Error("An error occurred while creating tag");
    }
}

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
    try {
        const deletedCount = await Tag.destroy({ where: { id } });
        if (deletedCount === 0) {
            throw new Error("Tag not found");
        }
        return deletedCount;
    } catch (error) {
        throw new Error("An error occurred while deleting tag");
    }
};
