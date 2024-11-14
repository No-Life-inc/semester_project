import User from "../models/sequelize/User";
import Collection from "../models/sequelize/Collection";
import UserBook from "../models/sequelize/UserBook";
import Book from "../models/sequelize/Book";
import UserBookCollection from "../models/sequelize/UserBookCollection";

/**
 * Creates a new collection for a user.
 *
 * @param {string} name - The name of the collection.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection>} - A promise that resolves to the newly created collection.
 * @throws {Error} - Throws an error if the user is not found.
 */
export const createCollection = async (name: string, userId: number) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    // Create the collection with the userId as foreign key
    const newCollection = await Collection.create({ name, userId });
    return newCollection;
};


/**
 * Retrieves all collections for a specific user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection[]>} - A promise that resolves to an array of collections associated with the user.
 * @throws {Error} - Throws an error if the user is not found.
 */
export const getUserCollections = async (userId: number) => {
    const user = await User.findByPk(userId, {
        include: [
            {
                model: Collection,
                as: "collections",
                include: [
                    {
                        model: UserBook,
                        as: "user_books",
                        include: [
                            {
                                model: Book,
                                as: "book",
                            },
                        ],
                    },
                ],
            },
        ],
    });
    if (!user) throw new Error("User not found");
    return user.collections;
};

/**
 * Updates the name of a collection.
 *
 * @param {number} id - The ID of the collection.
 * @param {string} name - The new name for the collection.
 * @returns {Promise<Collection>} - A promise that resolves to the updated collection.
 * @throws {Error} - Throws an error if the collection is not found.
 */
export const updateCollection = async (id: number, name: string) => {
    const collection = await Collection.findByPk(id);
    if (!collection) throw new Error("Collection not found");

    const updatedCollection = await collection.update({ name });
    return updatedCollection;
};


/**
 * Deletes a collection for a specific user.
 *
 * @param {number} id - The ID of the collection.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} - A promise that resolves to the number of deleted records.
 * @throws {Error} - Throws an error if the user ID is invalid, the collection is not found, or the user is not authorized to delete the collection.
 */
export const deleteCollection = async (id: number, userId: number) => {
    const collection = await Collection.findByPk(id);
    if (!collection) throw new Error("Collection not found");

    if (collection.userId !== userId) throw new Error("Unauthorized to delete this collection");

    await UserBookCollection.destroy({ where: { collection_id: id } });
    await collection.destroy();

    return collection;
};

/**
 * Adds a book to a collection for a user.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} collectionId - The ID of the collection.
 * @param {number} bookId - The ID of the book.
 * @returns {Promise<void>} - A promise that resolves when the book is added to the collection.
 * @throws {Error} - Throws an error if the userBook entry is not found or the book already exists in the collection.
 */
export const addBookToCollection = async (userId: number, collectionId: number, bookId: number): Promise<void> => {
    const userBook = await UserBook.findOne({
        where: { user_id: userId, book_id: bookId },
    });

    if (!userBook) {
        throw new Error("UserBook entry not found. Add the book to the user first.");
    }

    const existingEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook.id },
    });

    if (existingEntry) {
        throw new Error("Book already exists in the collection");
    }

    await UserBookCollection.create({ collection_id: collectionId, user_book_id: userBook.id });
};

/**
 * Removes a book from a collection for a user.
 *
 * @param {number} collectionId - The ID of the collection.
 * @param {number} userId - The ID of the user.
 * @param {number} bookId - The ID of the book.
 * @returns {Promise<void>} - A promise that resolves when the book is removed from the collection.
 * @throws {Error} - Throws an error if the collection, userBook, or UserBookCollection entry is not found.
 */
export const removeBookFromCollection = async (collectionId: number, userId: number, bookId: number): Promise<void> => {
    const userBook = await UserBook.findOne({
        where: { user_id: userId, book_id: bookId },
    });
    if (!userBook) throw new Error("UserBook entry not found");

    const existingEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook.id },
    });
    if (!existingEntry) throw new Error("Book not found in the collection");

    await existingEntry.destroy();
};