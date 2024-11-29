import { User } from "../../models/mongoose/UserModel";
import { NotFoundError, ValidationError } from "../../utility/errors";
import { Types } from "mongoose";


/**
 * Creates a new collection for a user.
 *
 * @param email - The email of the user.
 * @param name - The name of the collection.
 * @returns The created collection.
 * @throws NotFoundError - If the user is not found.
 * @throws ValidationError - If the collection name is invalid.
 */
export const createCollectionService = async (email: string, name: string) => {
    if (!name || typeof name !== "string") {
        throw new ValidationError("Collection name must be a valid string");
    }


    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found");
    }


    const newCollection = { name, books: [] };
    user.collections.push(newCollection);
    await user.save();


    return user.collections[user.collections.length - 1];
};


/**
 * Deletes a collection.
 *
 * @param email - The email of the user.
 * @param collectionId - The ID of the collection to delete.
 * @throws NotFoundError - If the user or collection is not found.
 */
export const deleteCollectionService = async (email: string, collectionId: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found");
    }


    const initialLength = user.collections.length;
    user.collections = user.collections.filter(
        (c) => c._id?.toString() !== collectionId
    );


    if (initialLength === user.collections.length) {
        throw new NotFoundError("Collection not found");
    }


    await user.save();
};


/**
 * Updates the name of a collection.
 *
 * @param email - The email of the user.
 * @param collectionId - The ID of the collection to update.
 * @param name - The new name of the collection.
 * @returns The updated collection.
 * @throws NotFoundError - If the user or collection is not found.
 */
export const updateCollectionService = async (
    email: string,
    collectionId: string,
    name: string
) => {
    if (!name || typeof name !== "string") {
        throw new ValidationError("New collection name must be a valid string");
    }


    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found");
    }


    const collection = user.collections.find(
        (c) => c._id?.toString() === collectionId
    );


    if (!collection) {
        throw new NotFoundError("Collection not found");
    }


    collection.name = name;
    await user.save();


    return collection;
};


/**
 * Fetches all collections for a specific user.
 *
 * @param email - The email of the user.
 * @returns The user's collections.
 * @throws NotFoundError - If the user is not found.
 */
export const getUserCollectionsService = async (email: string) => {
    const user = await User.findOne({ email }).populate("collections.books");
    if (!user) {
        throw new NotFoundError("User not found");
    }


    return user.collections;
};


/**
 * Adds a book to a collection for a user.
 *
 * @param email - The email of the user.
 * @param collectionId - The ID of the collection.
 * @param bookId - The ID of the book to add.
 * @returns The updated collection.
 * @throws NotFoundError - If the user, collection, or book is not found.
 * @throws ValidationError - If the book already exists in the collection.
 */
export const addBookToCollectionService = async (
    email: string,
    collectionId: string,
    bookId: string
) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    const bookOwned = user.books.some((userBook) => userBook.book_id.equals(bookId));
    if (!bookOwned) {
        throw new ValidationError("User must own the book before adding it to a collection.");
    }

    const collection = user.collections.find((c) => c._id?.toString() === collectionId);
    if (!collection) {
        throw new NotFoundError("Collection not found.");
    }

    if (collection.books.some((b) => b.equals(bookId))) {
        throw new ValidationError("Book already exists in the collection.");
    }

    collection.books.push(new Types.ObjectId(bookId));
    await user.save();

    return collection;
};


/**
 * Removes a book from a collection for a user.
 *
 * @param email - The email of the user.
 * @param collectionId - The ID of the collection.
 * @param bookId - The ID of the book to remove.
 * @returns The updated collection.
 * @throws NotFoundError - If the user, collection, or book is not found.
 */
export const removeBookFromCollectionService = async (
    email: string,
    collectionId: string,
    bookId: string
) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found");
    }


    const collection = user.collections.find(
        (c) => c._id?.toString() === collectionId
    );


    if (!collection) {
        throw new NotFoundError("Collection not found");
    }


    const bookIndex = collection.books.findIndex((b) => b.toString() === bookId);
    if (bookIndex === -1) {
        throw new NotFoundError("Book not found in the collection");
    }


    collection.books.splice(bookIndex, 1);
    await user.save();


    return collection;
};
