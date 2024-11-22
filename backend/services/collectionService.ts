import User from "../models/sequelize/User";
import Collection from "../models/sequelize/Collection";
import UserBook from "../models/sequelize/UserBook";
import Book from "../models/sequelize/Book";
import UserBookCollection from "../models/sequelize/UserBookCollection";
import sequelize from "../config/SqlConfig";
import { Transaction } from "sequelize";
import {NotFoundError, ValidationError, UnauthorizedError} from "../utility/errors";

/**
 * Creates a new collection for a user.
 *
 * @param {string} name - The name of the collection.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection>} - A promise that resolves to the newly created collection.
 * @throws {Error} - Throws an error if the user is not found.
 */
export const createCollection = async (name: string, userId: number) => {
    if (!name) {
      throw new ValidationError("Collection name is required");
    }
  
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
  
    return await Collection.create({ name, userId });
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
            include: [{ model: Book, as: "book" }],
          },
        ],
      },
    ],
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }
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
  if (!collection) {
    throw new NotFoundError("Collection not found");
  }

  return await collection.update({ name });
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
    const t = await sequelize.transaction();
  
    try {
      if (!userId || isNaN(userId)) {
        throw new ValidationError("Invalid user ID");
      }
  
      const collection = await Collection.findByPk(id, { transaction: t });
      if (!collection) {
        throw new NotFoundError("Collection not found");
      }
  
      if (collection.userId !== userId) {
        throw new UnauthorizedError("You are not authorized to delete this collection");
      }
  
      await UserBookCollection.destroy({ where: { collection_id: id }, transaction: t });
      await collection.destroy({ transaction: t });
  
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
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
export const addBookToCollection = async (
    userId: number,
    collectionId: number,
    bookId: number
  ) => {
    const t = await sequelize.transaction();
    try {
      const userBook = await UserBook.findOne({
        where: { user_id: userId, book_id: bookId },
        transaction: t,
      });
  
      if (!userBook) {
        throw new NotFoundError(
          "UserBook entry not found. Add the book to the user first."
        );
      }
  
      // Check if the book is already associated with the collection
      const existingEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook.id },
        transaction: t,
      });
  
      if (existingEntry) {
        throw new ValidationError("Book already exists in the collection");
      }
  
      // Add the user book to the collection
      await UserBookCollection.bulkCreate(
        [
          {
            collection_id: collectionId,
            user_book_id: userBook.id,
            createdAt: new Date(),
          },
        ],
        { returning: false, transaction: t }
      );
  
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
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
export const removeBookFromCollection = async (
    collectionId: number,
    userId: number,
    bookId: number
  ) => {
    const t = await sequelize.transaction();
    try {
      const collection = await Collection.findByPk(collectionId, {
        transaction: t,
      });
  
      if (!collection) {
        throw new NotFoundError("Collection not found");
      }
  
      const userBook = await UserBook.findOne({
        where: { user_id: userId, book_id: bookId },
        transaction: t,
      });
  
      if (!userBook) {
        throw new NotFoundError("UserBook entry not found");
      }
  
      const collectionEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook.id },
        transaction: t,
      });
  
      if (!collectionEntry) {
        throw new NotFoundError("Book not found in the collection");
      }
  
      await collectionEntry.destroy({ transaction: t });
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };  