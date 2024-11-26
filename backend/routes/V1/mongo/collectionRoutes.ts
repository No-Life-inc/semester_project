import express from "express";
import {
    createCollection,
    deleteCollection,
    editCollection,
    getCollections,
} from "../../../controllers/mongo/collectionController";

const router = express.Router();

router.post("/:userId/", createCollection);
router.get("/:userId/", getCollections);
router.put("/:userId/:collectionId", editCollection);
router.delete("/:userId/:collectionId", deleteCollection);

export default router;
