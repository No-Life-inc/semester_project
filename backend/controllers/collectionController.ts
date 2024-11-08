import { Request, Response } from "express";
import * as CollectionService from "../services/collectionService";


//TODO - add docstrings to all functions
//TODO - create a function that adds a book to a collection
//TODO - create a function that removes a book from a collection
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
 * Adds a book to a user's collection.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
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
 * Removes a book from a user's collection.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
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