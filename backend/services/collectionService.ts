import User from "../models/sequelize/User";
import Collection from "../models/sequelize/Collection";
import UserBook from "../models/sequelize/UserBook";
import Book from "../models/sequelize/Book";
import UserBookCollection from "../models/sequelize/UserBookCollection";
import sequelize from "../config/SqlConfig";
import { Transaction } from "sequelize";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,ForbiddenError
} from "../utility/errors";
import { ValidationError as SequelizeValidationError } from "sequelize";
/**
 * Creates a new collection for a user.
 *
 * @param {string} name - The name of the collection.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection>} - A promise that resolves to the newly created collection.
 * @throws {ValidationError} - Throws an error if the collection name is missing.
 * @throws {NotFoundError} - Throws an error if the user is not found.
 */
export const createCollection = async (name: string, email: string) => {
  if (!name) {
    throw new ValidationError("Collection name is required");
  }

  if (name.length > 255) {
    throw new ValidationError("Collection name must be between 1 and 255 characters");
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return await Collection.create({ name, userId: user.id });
};

/**
 * Retrieves all collections for a specific user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection[]>} - A promise that resolves to an array of collections associated with the user.
 * @throws {NotFoundError} - Throws an error if the user is not found.
 */
export const getUserCollections = async (email: string) => {
  const user = await User.findOne({
    where: { email },
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

  return user.collections || [];
};

/**
 * Updates the name of a collection.
 *
 * @param {number} id - The ID of the collection.
 * @param {string} name - The new name for the collection.
 * @returns {Promise<Collection>} - A promise that resolves to the updated collection.
 * @throws {NotFoundError} - Throws an error if the collection is not found.
 */
export const updateCollection = async (id: number, name: string) => {
  const collection = await Collection.findByPk(id);
  if (!collection) {
    throw new NotFoundError("Collection not found");
  }

  try {
    return await collection.update({ name });
  } catch (error) {
    if (error instanceof SequelizeValidationError) {
      throw new ValidationError(error.errors[0].message || "Validation failed");
    }
    throw error;
  }
};

/**
 * Deletes a collection for a specific user.
 *
 * @param {number} id - The ID of the collection.
 * @param {number} userId - The ID of the user attempting to delete the collection.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the collection is successfully deleted.
 * @throws {ValidationError} - Throws an error if the user ID is invalid.
 * @throws {NotFoundError} - Throws an error if the collection is not found.
 * @throws {UnauthorizedError} - Throws an error if the user is not authorized to delete the collection.
 */
export const deleteCollection = async (id: number, email: string) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const collection = await Collection.findByPk(id);

  if (!collection) {
    throw new NotFoundError("Collection not found");
  }

  if (collection.userId !== user.id) {
    throw new ForbiddenError("You are not authorized to delete this collection");
  }

  const t = await sequelize.transaction();
  try {
    await UserBookCollection.destroy({
      where: { collection_id: id },
      transaction: t,
    });
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
 * @returns {Promise<void>} - A promise that resolves when the book is successfully added to the collection.
 * @throws {NotFoundError} - Throws an error if the UserBook entry is not found.
 * @throws {ValidationError} - Throws an error if the book already exists in the collection.
 */
export const addBookToCollection = async (
  email: string,
  collectionId: number,
  bookId: number
) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({ where: { email }, transaction: t });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const collection = await Collection.findByPk(collectionId, {
      transaction: t,
    });

    if (!collection) {
      throw new NotFoundError("Collection not found");
    }
    
    if (collection.userId !== user.id) {
      throw new UnauthorizedError(
        "You are not authorized to add a book to this collection"
      );
    }

    let userBook = await UserBook.findOne({
      where: { user_id: user.id, book_id: bookId },
      transaction: t,
    });

    if (!userBook) {
      userBook = await UserBook.create(
        {
          user_id: user.id,
          book_id: bookId,
        },
        { transaction: t }
      );
    }

    const existingEntry = await UserBookCollection.findOne({
      where: { collection_id: collectionId, user_book_id: userBook.id },
      transaction: t,
    });

    if (existingEntry) {
      throw new ValidationError("Book already exists in the collection");
    }

    await UserBookCollection.bulkCreate(
      [
        {
          collection_id: collectionId,
          user_book_id: userBook.id,
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
 * @returns {Promise<void>} - A promise that resolves when the book is successfully removed from the collection.
 * @throws {NotFoundError} - Throws an error if the collection is not found.
 * @throws {NotFoundError} - Throws an error if the UserBook entry is not found.
 * @throws {NotFoundError} - Throws an error if the book is not associated with the collection.
 */
export const removeBookFromCollection = async (
  email: string,
  collectionId: number,
  bookId: number
) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({ where: { email }, transaction: t });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const collection = await Collection.findByPk(collectionId, {
      transaction: t,
    });

    if (!collection) {
      throw new NotFoundError("Collection not found");
    }
    
    if (collection.userId !== user.id) {
      throw new UnauthorizedError(
        "You are not authorized to remove a book from this collection"
      );
    }

    const userBook = await UserBook.findOne({
      where: { user_id: user.id, book_id: bookId },
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
