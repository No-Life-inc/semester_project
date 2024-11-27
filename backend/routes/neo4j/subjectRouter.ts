import express from "express";
import {
  getSubjectsController,
  getSubjectByGuidController,
  getSubjectsByPartialNameController,
} from "../../controllers/neo4j/subjectController";

const subjectRouter = express.Router();

subjectRouter.get("/", getSubjectsController);
subjectRouter.get("/guid/:guid", getSubjectByGuidController);
subjectRouter.get("/search", getSubjectsByPartialNameController);

export default subjectRouter;
