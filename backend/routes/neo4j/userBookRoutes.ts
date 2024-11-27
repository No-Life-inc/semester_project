import { Router } from "express";
import getUserBookController from "../../controllers/neo4j/userBookController";

const router = Router();

router.get("/", getUserBookController);

export default router; 