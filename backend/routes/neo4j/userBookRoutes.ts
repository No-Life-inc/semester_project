import { Router } from "express";
import {getUserBookController} from "../../controllers/neo4j/userBookController";
import {authenticate} from "../../utility/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", getUserBookController);

export default router; 