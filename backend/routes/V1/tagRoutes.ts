import express from "express";
import * as TagController from "../../controllers/tagController";

const router = express.Router();

router.get("/", TagController.getAllTagsController);
router.get("/:id", TagController.getTagByIdController);
router.post("/", TagController.addTagController);
router.delete("/:id", TagController.deleteTagByIdController);
router.post("/addTagToBook", TagController.addTagToBookController);
router.delete("/deleteTagFromBook", TagController.deleteTagFromBookController);

export default router;