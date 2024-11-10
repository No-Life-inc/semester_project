import express from "express";
import * as UserBookTagController from "../../controllers/userBookTagController";

const router = express.Router();

router.post("/", UserBookTagController.addTagToBookController);
router.delete("/", UserBookTagController.deleteTagFromBookController);

export default router;
