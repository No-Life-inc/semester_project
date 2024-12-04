import express from "express";
import { getUserBooksController, addBookToUserController, removeBookFromUserController } from "../../controllers/userBookController";

const router = express.Router();

router.get("/", getUserBooksController);
router.post("/", addBookToUserController);
router.delete("/:userBookId", removeBookFromUserController);

export default router;