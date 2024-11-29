import express from "express";
import {
    createCollection,
    deleteCollection,
    updateCollection,
    getUserCollections,
    addBookToCollection,
    removeBookFromCollection,
} from "../../../controllers/mongo/collectionController";
import { authenticate } from "../../../utility/authMiddleware";

const router = express.Router();

router.use(authenticate);
router.post("/", createCollection); // Create a collection
router.get("/", getUserCollections); // Get all collections
router.put("/:collectionId", updateCollection); // Update a collection
router.delete("/:collectionId", deleteCollection); // Delete a collection
router.post("/:collectionId/books/:bookId", addBookToCollection); // Add book to collection
router.delete("/:collectionId/books/:bookId", removeBookFromCollection); // Remove book from collection


export default router;