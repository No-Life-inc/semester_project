import {
    getUserCollectionsService,
    createCollectionService,
    updateCollectionService,
    deleteCollectionService,
    addBookToCollectionService,
    removeBookFromCollectionService
} from "../../services/mongo/collectionService";
import { Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticatedRequest";


/**
 * Fetches all collections for a user.
 */
export const getUserCollections = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.user.email;
        const collections = await getUserCollectionsService(email);
        res.status(200).json(collections);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};


/**
 * Creates a new collection for a user.
 */
export const createCollection = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.user.email;
        const { name } = req.body;
        const collection = await createCollectionService(email, name);
        res.status(201).json(collection);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
/**
 * Updates the name of a collection.
 */
export const updateCollection = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.user.email;
        const { collectionId } = req.params;
        const { name } = req.body;
        const collection = await updateCollectionService(email, collectionId, name);
        res.status(200).json(collection);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};


/**
 * Deletes a collection.
 */
export const deleteCollection = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.user.email;
        const { collectionId } = req.params;
        await deleteCollectionService(email, collectionId);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};


/**
 * Adds a book to a user's collection.
 */
export const addBookToCollection = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.user.email;
        const { collectionId, bookId } = req.params;


        const updatedCollection = await addBookToCollectionService(email, collectionId, bookId);
        res.status(200).json({ message: "Book added successfully", collection: updatedCollection });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};


/**
 * Removes a book from a user's collection.
 */
export const removeBookFromCollection = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.user.email;
        const { collectionId, bookId } = req.params;


        const updatedCollection = await removeBookFromCollectionService(email, collectionId, bookId);
        res.status(200).json({ message: "Book removed successfully", collection: updatedCollection });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
