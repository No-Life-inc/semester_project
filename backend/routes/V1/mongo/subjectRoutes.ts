import express from "express";
import {
  getSubjectsController,
  getSubjectsByPartialNameController,
  getSubjectByIdController
} from "../../../controllers/mongo/subjectController";

const router = express.Router();

router.get("/", getSubjectsController); // Get all subjects
router.get("/search", getSubjectsByPartialNameController); // Search subjects by name
router.get("/:subjectId", getSubjectByIdController); // Get subject by ID

export default router;
