import { Router} from "express";
import * as CollectionController from "../../controllers/collectionController";

const router = Router();

// Route to get all collections for a specific user
router.get("/:userId/", CollectionController.getUserCollections);

// Route to create a new collection
router.post("/", CollectionController.createCollection);

// Route to update a collection for a user
router.put("/:userId/:id", CollectionController.updateCollection);

// Route to delete a collection for a user
router.delete("/:userId/:id", CollectionController.deleteCollection);

// Route to add a book to a collection
router.post("/addBook", CollectionController.addBookToCollection);

// Route to remove a book from a collection
router.delete("/removeBook", CollectionController.removeBookFromCollection);

export default router;
