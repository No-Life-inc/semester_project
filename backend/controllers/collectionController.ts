import { Response } from "express";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import * as CollectionService from "../services/collectionService";
import User from "../models/sequelize/User";
import Collection from "../models/sequelize/Collection";

/**
 * Creates a new collection for a user.
 *
 * @param {string} name - The name of the collection.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection>} - A promise that resolves to the newly created collection.
 * @throws {Error} - Throws an error if the user is not found.
 */
export const createCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.body;
  const { email } = req.user;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }

      const newCollection = await CollectionService.createCollection(name, user.id);
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
export const getUserCollections = async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.user;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }

      const collections = await CollectionService.getUserCollections(user.id);
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
export const updateCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const { email } = req.user;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }

      const collection = await Collection.findByPk(Number(id));
      if (!collection || collection.userId !== user.id) {
          throw new Error("You are not authorized to update this collection");
      }

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
export const deleteCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { email } = req.user;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }

      await CollectionService.deleteCollection(Number(id), user.id);
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
export const addBookToCollection = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { collectionId, bookId } = req.body;
  const { email } = req.user;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }

      const collectionIdNum = Number(collectionId);
      const bookIdNum = Number(bookId);
      if (isNaN(collectionIdNum) || isNaN(bookIdNum)) {
          throw new Error("Invalid input. collectionId and bookId must be numbers.");
      }

      await CollectionService.addBookToCollection(user.id, collectionIdNum, bookIdNum);
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
export const removeBookFromCollection = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { collectionId, bookId } = req.body;
  const { email } = req.user;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }

      const collectionIdNum = Number(collectionId);
      const bookIdNum = Number(bookId);
      if (isNaN(collectionIdNum) || isNaN(bookIdNum)) {
          throw new Error("Invalid input. collectionId and bookId must be numbers.");
      }

      await CollectionService.removeBookFromCollection(collectionIdNum, user.id, bookIdNum);
      res.status(200).json({ message: "Book removed from collection successfully" });
  } catch (error) {
      res.status(400).json({ error: (error as Error).message });
  }
};