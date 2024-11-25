import { Router} from "express";
import * as CollectionController from "../../controllers/collectionController";
import {authenticate} from "../../utility/authMiddleware";

const router = Router();

router.use(authenticate);

// Route to get all collections for a specific user
router.get("/", CollectionController.getUserCollections);

// Route to create a new collection
router.post("/", CollectionController.createCollection);

// Route to add a book to a collection
router.post("/addBook", CollectionController.addBookToCollection);

// Route to remove a book from a collection
router.delete("/removeBook", CollectionController.removeBookFromCollection);

// Route to update a collection for a user
router.put("/:id", CollectionController.updateCollection);

// Route to delete a collection for a user
router.delete("/:id", CollectionController.deleteCollection);


export default router;
