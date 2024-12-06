import express from "express";
import { 
    getUserBooksController,
    addBookToUserController,
    removeBookFromUserController 
} from "../../controllers/mongo/userBookController";
import { authenticate } from "../../utility/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", getUserBooksController); // Get books owned by a user
router.post("/", addBookToUserController); // Associate a book with a user
router.delete("/:bookId", removeBookFromUserController); // Remove a book from user's owned books

export default router;
