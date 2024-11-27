import { Request, Response } from "express";
import { getUserCollectionsByEmail, createCollection, updateCollection, deleteCollection, addBookToCollection, removeBookFromCollection } from "../../services/neo4j/CollectionService";
import { AuthenticatedRequest } from "../../types/authenticatedRequest";
import {
    NotFoundError,
    ValidationError,
    UnauthorizedError,
  } from "../../utility/errors";
  

/**
 * Handles retrieving collections for a user via an HTTP request.
 @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.body.name`: The name of the collection to be created.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send the result or error.
 */
export const getUserCollectionsController = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;


    if (!email || typeof email !== 'string') {
        return new ValidationError("User email is not valid");
    }

    try {
        const collections = await getUserCollectionsByEmail(email);
        res.json(collections);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

/**
 * Handles creating a new collection for a user via an HTTP request.
 @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.body.name`: The name of the collection to be created.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send the result or error.
 */
export const createCollectionController = async (req: AuthenticatedRequest, res: Response) => {
    const {name} = req.body;
    const  { email } = req.user;

    if (!guid || typeof guid !== 'string') {
        return new ValidationError("Collection guid is not valid");
    }

    if (!email || typeof email !== 'string') {
        return new ValidationError("User email is not valid");
    }

    try {
        const collection = await createCollection(name, email);
        res.json(collection);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

/**
 * Handles updating a collection for a user via an HTTP request.
 @param {AuthenticatedRequest} req - The request object containing:
 *   - `req.params.id`: The ID of the collection to be updated.
 *   - `req.body.name`: The new name of the collection.
 *   - `reg.body.guid`: The guid of the collection to be updated.
 *   - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send the result or error.
 */
export const updateCollectionController = async (req: AuthenticatedRequest, res: Response) => {
    const { guid } = req.params;
    const { name } = req.body;
    const { email } = req.user;

    if (!name || typeof name !== 'string') {
        return new ValidationError("New collection name is not valid");
    }

    if (!guid || typeof guid !== 'string') {
        return new ValidationError("Collection guid is not valid");
    }

    if (!email || typeof email !== 'string') {
        return new ValidationError("User email is not valid");
    }

    try {
        const collection = await updateCollection(email, guid, name);
        res.json(collection);
    } catch (error) {
        console.error("Error updating collection:", error);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

/**
 * Handles deleting a collection for a user via an HTTP request.
 * @param {AuthenticatedRequest} req - The request object containing:
 *  - `req.params.guid`: The guid of the collection to be deleted.
 * - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send the result or error.
 * @returns {Promise<void>} - A promise that resolves once the collection is deleted.
 * @throws {NotFoundError} - Throws an error if the collection is not found.
 * @throws {UnauthorizedError} - Throws an error if the user is not authorized to delete the collection.
 */
export const deleteCollectionController = async (req: AuthenticatedRequest, res: Response) => {
    const { guid } = req.params;
    const { email } = req.user;

    if (!guid || typeof guid !== 'string') {
        return new ValidationError("Collection guid is not valid");
    }

    if (!email || typeof email !== 'string') {
        return new ValidationError("Collection name is not valid");
    }

    try {
        await deleteCollection(email, guid);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

/**
 * Handles adding a book to a collection for a user via an HTTP request.
 * @param {AuthenticatedRequest} req - The request object containing:
 *  - `req.params.guid`: The guid of the collection.
 *  - `req.params.isbn`: The ISBN of the book to be added.
 * - `req.user.email`: The email of the authenticated user.
 * @param {Response} res - The response object used to send the result or error.
 */
export const addBookToCollectionController = async (req: AuthenticatedRequest, res: Response) => {
    const { guid, isbn } = req.params;
    const { email } = req.user;

    if (!guid || typeof guid !== 'string') {
        return new ValidationError("Collection guid is not valid");
    }

    if (!isbn || typeof isbn !== 'string') {
        return new ValidationError("Book ISBN is not valid");
    }

    if (!email || typeof email !== 'string') {
        return new ValidationError("User email is not valid");
    }

    try {
        const collection = await addBookToCollection(email, guid, isbn);
        res.json(collection);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

/**
 * Handles deleting a book from a collection for a user via an HTTP request.
 * @param {AuthenticatedRequest} req - The request object containing:
 * - `req.params.guid`: The guid of the collection.
 * - `req.params.isbn`: The ISBN of the book to be deleted.
 * - `req.user.email`: The email of the authenticated user.
 * 
 * @param {Response} res - The response object used to send the result or error.
 * @returns {Promise<void>} - A promise that resolves once the book is deleted from the collection.
 * @throws {NotFoundError} - Throws an error if the collection is not found.
 * @throws {UnauthorizedError} - Throws an error if the user is not authorized to delete the book from the collection.
 * */
export const removeBookFromCollectionController = async (req: AuthenticatedRequest, res: Response) => {
    const { guid, isbn } = req.params;
    const { email } = req.user;

    if (!guid || typeof guid !== 'string') {
        return new ValidationError("Collection guid is not valid");
    }

    if (!isbn || typeof isbn !== 'string') {
        return new ValidationError("Book ISBN is not valid");
    }

    if (!email || typeof email !== 'string') {
        return new ValidationError("User email is not valid");
    }

    try {
        await removeBookFromCollection(email, guid, isbn);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}