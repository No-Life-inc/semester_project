import express from "express";
import * as TagController from "../../controllers/neo4j/tagController";
import { authenticate } from "../../utility/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", TagController.getTagsController);    
router.get("/:guid", TagController.getTagByGuidController);
router.post("/", TagController.createTagController);
router.delete("/:guid", TagController.deleteTagController);
router.post("/:guid/addBook/:isbn", TagController.addTagToBookController);
router.delete("/:guid/removeBook/:isbn", TagController.deleteTagFromBookController);

export default router;