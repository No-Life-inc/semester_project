import express from "express";
import { loginUserController, registerUserController } from "../../controllers/neo4j/userController";

const router = express.Router();

router.post("/login", loginUserController);
router.post("/register", registerUserController);

export default router;