import { Router, Request, Response } from "express";
import User from "../../models/sequelize/User";
import Collection from "../../models/sequelize/Collection";
import UserBook from "../../models/sequelize/UserBook";
import Book from "../../models/sequelize/Book";
import * as CollectionController from "../../controllers/collectionController";

const router = Router();

router.get("/:userId/", CollectionController.getUserCollections);
router.post("/", CollectionController.createCollection);
router.put("/:userId/:id", CollectionController.updateCollection);
router.delete("/:userId/:id", CollectionController.deleteCollection);

export default router;
