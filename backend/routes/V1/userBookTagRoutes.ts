import express from "express";
import * as UserBookTagController from "../../controllers/userBookTagController";
import {authenticate} from "../../utility/authMiddleware";

const router = express.Router();

router.post("/", authenticate, UserBookTagController.addTagToBookController);
router.delete("/", authenticate, UserBookTagController.deleteTagFromBookController);
router.get("/:userBookId", authenticate, UserBookTagController.getTagsForBookController);

export default router;
