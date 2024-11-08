import User from "../models/sequelize/User";
import Collection from "../models/sequelize/Collection";
import UserCollection from "../models/sequelize/UserCollection";
import UserBook from "../models/sequelize/UserBook";
import Book from "../models/sequelize/Book";
import UserBookCollection from "../models/sequelize/UserBookCollection";
import { addBookToUser } from "./userBookService";

export const createCollection = async (name: string, userId: number) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const newCollection = await Collection.create({ name });
    await UserCollection.create({ user_id: userId, collection_id: newCollection.id });
    return newCollection;
};

export const getUserCollections = async (userId: number) => {
    const user = await User.findByPk(userId, {
        include: [
            {
                model: Collection,
                as: "collections",
                through: { attributes: [] },
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

export const updateCollection = async (id: number, name: string) => {
    const collection = await Collection.findByPk(id);
    if (!collection) throw new Error("Collection not found");

    const updatedCollection = await collection.update({ name });
    return updatedCollection;
};

export const deleteCollection = async (id: number, userId: number) => {
    if (!userId || typeof userId !== 'number') throw new Error("Invalid user ID");

    const collection = await Collection.findByPk(id);
    if (!collection) throw new Error("Collection not found");

    const ownership = await UserCollection.findOne({
        where: { user_id: userId, collection_id: id },
    });
    if (!ownership) throw new Error("Unauthorized to delete this collection");

    await UserBookCollection.destroy({ where: { collection_id: id } });
    await UserCollection.destroy({ where: { collection_id: id } });
    const deletedCollection = await Collection.destroy({ where: { id } });

    return deletedCollection;
};

/**
 * Adds a book to a collection for a user.
 * 
 * @param {number} userId - The ID of the user.
 * @param {number} collectionId - The ID of the collection.
 * @param {number} bookId - The ID of the book.
 * @returns {Promise<void>} - A promise that resolves when the book is added to the collection.
 */
export const addBookToCollection = async (userId: number, collectionId: number, bookId: number): Promise<void> => {
  // Find the user_book entry to get user_book_id
  const userBook = await UserBook.findOne({
      where: {
          user_id: userId,
          book_id: bookId,
      },
  });
  
  if (!userBook) {
      throw new Error("UserBook entry not found. Add the book to the user first.");
  }

  // Check if the book is already associated with the collection
  const existingEntry = await UserBookCollection.findOne({
      where: { collection_id: collectionId, user_book_id: userBook.id },
  });
  
  if (existingEntry) {
      throw new Error("Book already exists in the collection");
  }

  // Add the user book to the collection
  await UserBookCollection.create({ collection_id: collectionId, user_book_id: userBook.id });
};


/**
* Removes a book from a collection for a user.
* 
* @param {number} collectionId - The ID of the collection.
* @param {number} userId - The ID of the user.
* @param {number} bookId - The ID of the book.
* @returns {Promise<void>} - A promise that resolves when the book is removed from the collection.
*/
export const removeBookFromCollection = async (collectionId: number, userId: number, bookId: number): Promise<void> => {
  console.log(`Searching for collection with ID: ${collectionId}`);
  const collection = await Collection.findByPk(collectionId);
  if (!collection) throw new Error("Collection not found");

  console.log(`Searching for UserBook with user ID: ${userId} and book ID: ${bookId}`);
  const userBook = await UserBook.findOne({
      where: { user_id: userId, book_id: bookId },
  });
  if (!userBook) throw new Error("UserBook entry not found");

  console.log(`Found UserBook with ID: ${userBook.id}`);

  console.log(`Searching for UserBookCollection entry with collection ID: ${collectionId} and userBook ID: ${userBook.id}`);
  const existingEntry = await UserBookCollection.findOne({
      where: { collection_id: collectionId, user_book_id: userBook.id },
  });
  if (!existingEntry) {
      console.log("UserBookCollection entry not found");
      throw new Error("Book not found in the collection");
  }

  console.log(`Removing UserBookCollection entry with collection ID: ${collectionId} and userBook ID: ${userBook.id}`);
  await UserBookCollection.destroy({
      where: { collection_id: collectionId, user_book_id: userBook.id },
  });
};