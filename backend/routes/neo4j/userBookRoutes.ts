import { Router } from "express";
import {getUserBookController, addBookToUserController, removeBookFromUserController} from "../../controllers/neo4j/userBookController";
import {authenticate} from "../../utility/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", getUserBookController);
router.post("/addBook/:isbn", addBookToUserController);
router.delete("/removeBook/:isbn", removeBookFromUserController);


export default router; 