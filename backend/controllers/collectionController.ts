import { Response } from "express";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import * as CollectionService from "../services/collectionService";
import User from "../models/sequelize/User";
import Collection from "../models/sequelize/Collection";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utility/errors";

/**
 * Creates a new collection for the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.body.name`: The name of the collection to be created.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send the created collection or an error message.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Error} - Throws an error if the authenticated user is not found in the database.
 */
export const createCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.body;
  const { email } = req.user;

  try {
    if (!name) {
      throw new ValidationError("Collection name is required");
    }
    if (name.length > 255) {
      return res.status(422).json({ message: "Collection name must be between 1 and 255 characters" });
    }

    const newCollection = await CollectionService.createCollection(name, email);
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Retrieves all collections associated with the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send the user's collections or an error message.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Error} - Throws an error if the authenticated user is not found in the database.
 */
export const getUserCollections = async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.user;

  try {
    const collections = await CollectionService.getUserCollections(email);
    res.status(200).json(collections);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Updates the name of a collection belonging to the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.params.id`: The ID of the collection to be updated.
 *   - `req.body.name`: The new name for the collection.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send a success message or an error message.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Error} - Throws an error if the authenticated user is not found in the database
 *                   or if the user is not authorized to update the specified collection.
 */
export const updateCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!name) {
      throw new ValidationError("Collection name is required");
    }

    const updatedCollection = await CollectionService.updateCollection(Number(id), name);
    res.status(200).json({ message: "Collection updated successfully", updatedCollection });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Deletes a collection belonging to the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.params.id`: The ID of the collection to be deleted.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send a success message or an error message.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Error} - Throws an error if the authenticated user is not found in the database
 *                   or if the specified collection cannot be deleted.
 */
export const deleteCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { email } = req.user;

  try {
    await CollectionService.deleteCollection(Number(id), email);
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Adds a book to a collection belonging to the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.body.collectionId`: The ID of the collection to which the book should be added.
 *   - `req.body.bookId`: The ID of the book to be added.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send a success message or an error message.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Error} - Throws an error if the authenticated user is not found in the database,
 *                   if the input IDs are invalid, or if the book cannot be added to the specified collection.
 */
export const addBookToCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { collectionId, bookId } = req.body;
  const { email } = req.user;

  try {
    if (!collectionId || !bookId) {
      throw new ValidationError("Collection ID and Book ID are required");
    }

    await CollectionService.addBookToCollection(email, Number(collectionId), Number(bookId));
    res.status(201).json({ message: "Book added to collection successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Removes a book from a collection belonging to the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.body.collectionId`: The ID of the collection from which the book should be removed.
 *   - `req.body.bookId`: The ID of the book to be removed.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send a success message or an error message.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Error} - Throws an error if the authenticated user is not found in the database,
 *                   if the input IDs are invalid, or if the book cannot be removed from the specified collection.
 */
export const removeBookFromCollection = async (req: AuthenticatedRequest, res: Response) => {
  const { collectionId, bookId } = req.body;
  const { email } = req.user;

  try {
    await CollectionService.removeBookFromCollection(email, Number(collectionId), Number(bookId));
    res.status(200).json({ message: "Book removed from collection successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};