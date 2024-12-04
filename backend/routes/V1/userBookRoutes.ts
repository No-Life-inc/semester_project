import express from "express";
import { getUserBooksController, addBookToUserController, removeBookFromUserController } from "../../controllers/userBookController";
import { authenticate } from "../../utility/authMiddleware";

const router = express.Router();

router.use(authenticate);
router.get("/", getUserBooksController);
router.post("/", addBookToUserController);
router.delete("/:userBookId", removeBookFromUserController);

export default router;