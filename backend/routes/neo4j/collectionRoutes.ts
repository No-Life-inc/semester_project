import express from "express";
import {getUserCollectionsController, createCollectionController, updateCollectionController, deleteCollectionController, addBookToCollectionController, removeBookFromCollectionController } from "../../controllers/neo4j/collectionController";

const router = express.Router();

router.get("/", getUserCollectionsController);
router.post("/", createCollectionController);
router.put("/:guid", updateCollectionController);
router.delete("/:guid", deleteCollectionController);
router.post("/:guid/addBook/:isbn", addBookToCollectionController);
router.delete("/:guid/removeBook/:isbn", removeBookFromCollectionController);



export default router;
