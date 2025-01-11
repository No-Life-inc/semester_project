import express from "express";
import { getBooksBySubjectController } from "../../controllers/bookSubjectController";

const router = express.Router();

// Route to get books associated with a specific subject
router.get("/:subjectId", getBooksBySubjectController);

export default router;
