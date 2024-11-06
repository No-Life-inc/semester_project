import express from "express";
import { getUserBooksController, addBookToUserController, removeBookFromUserController } from "./controllers/userBookController";

const router = express.Router();

router.get("/userBooks", getUserBooksController);
router.post("/userBooks", addBookToUserController);
router.delete("/userBooks/:userBookId", removeBookFromUserController);

export default router;