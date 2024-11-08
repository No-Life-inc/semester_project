import { Request, Response } from "express";
import * as CollectionService from "../services/collectionService";

/**
 * Creates a new collection for a user.
 *
 * @param {string} name - The name of the collection.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection>} - A promise that resolves to the newly created collection.
 * @throws {Error} - Throws an error if the user is not found.
 */
export const createCollection = async (req: Request, res: Response) => {
  const { name, userId } = req.body;
  try {
    const newCollection = await CollectionService.createCollection(
      name,
      userId
    );
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Handles retrieving collections for a user via an HTTP request.
 *
 * @param {Request} req - The request object containing the user ID as a parameter.
 * @param {Response} res - The response object used to send the result or error.
 */
export const getUserCollections = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const collections = await CollectionService.getUserCollections(
      Number(userId)
    );
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


/**
 * Updates the name of a collection.
 *
 * @param {number} id - The ID of the collection.
 * @param {string} name - The new name for the collection.
 * @returns {Promise<Collection>} - A promise that resolves to the updated collection.
 * @throws {Error} - Throws an error if the collection is not found.
 */
export const updateCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await CollectionService.updateCollection(Number(id), name);
    res.json({ message: "Collection updated successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Deletes a collection for a specific user.
 *
 * @param {number} id - The ID of the collection.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} - A promise that resolves to the number of deleted records.
 * @throws {Error} - Throws an error if the user ID is invalid, the collection is not found, or the user is not authorized to delete the collection.
 */
export const deleteCollection = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  try {
    await CollectionService.deleteCollection(Number(id), Number(userId));
    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
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
export const addBookToCollection = async (req: Request, res: Response): Promise<void> => {
  let { userId, collectionId, bookId } = req.body;

  try {
      // Konverter til tal for at sikre korrekt type
      userId = Number(userId);
      collectionId = Number(collectionId);
      bookId = Number(bookId);

      if (isNaN(userId) || isNaN(collectionId) || isNaN(bookId)) {
          throw new Error("Invalid input. userId, collectionId, and bookId must be numbers.");
      }

      await CollectionService.addBookToCollection(userId, collectionId, bookId);
      res.status(201).json({ message: "Book added to collection successfully" });
  } catch (error) {
      console.error("Error in addBookToCollection:", error);
      res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Handles removing a book from a user's collection via an HTTP request.
 *
 * @param {Request} req - The request object containing the user ID, collection ID, and book ID in the body.
 * @param {Response} res - The response object used to send the result or error.
 * @returns {Promise<void>} - A promise that resolves when the book is removed from the collection.
 */
export const removeBookFromCollection = async (req: Request, res: Response): Promise<void> => {
  let { userId, collectionId, bookId } = req.body;

  try {
      // Konverter til tal for at sikre korrekt type
      userId = Number(userId);
      collectionId = Number(collectionId);
      bookId = Number(bookId);

      if (isNaN(userId) || isNaN(collectionId) || isNaN(bookId)) {
          throw new Error("Invalid input. userId, collectionId, and bookId must be numbers.");
      }

      await CollectionService.removeBookFromCollection(collectionId, userId, bookId);
      res.status(200).json({ message: "Book removed from collection successfully" });
  } catch (error) {
      res.status(400).json({ error: (error as Error).message });
  }
};