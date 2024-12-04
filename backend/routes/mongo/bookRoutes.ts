import express from "express";
import {
    getBooksController,
    getBooksBySubjectTextController,
    getBookByISBNController, getBooksByTitleController
} from "../../controllers/mongo/bookController";

const router = express.Router();

router.get("/", getBooksController);
router.get("/subject", getBooksBySubjectTextController);
router.get("/isbn", getBookByISBNController);
router.get("/title", getBooksByTitleController)

export default router;
