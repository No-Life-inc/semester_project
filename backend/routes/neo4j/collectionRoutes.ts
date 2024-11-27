import express from "express";
import {getUserCollectionsController, createCollectionController, updateCollectionController, deleteCollectionController } from "../../controllers/neo4j/collectionController";

const router = express.Router();

router.get("/", getUserCollectionsController);
router.post("/", createCollectionController);
router.put("/:name", updateCollectionController);
router.delete("/:name", deleteCollectionController);


export default router;
