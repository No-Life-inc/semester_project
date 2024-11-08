import express from "express";
import * as TagController from "../../controllers/tagController";

const router = express.Router();

router.get("/", TagController.getAllTagsController);
router.get("/:id", TagController.getTagByIdController);
router.post("/", TagController.addTagController);
router.delete("/:id", TagController.deleteTagByIdController);

export default router;