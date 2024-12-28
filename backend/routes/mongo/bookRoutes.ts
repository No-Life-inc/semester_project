import express from "express";
import {
    getBooksController,
    getBooksBySubjectNameController,
    getBookByISBNController, getBooksByTitleController
} from "../../controllers/mongo/bookController";

const router = express.Router();

router.get("/", getBooksController);
router.get("/subject", getBooksBySubjectNameController);
router.get("/isbn", getBookByISBNController);
router.get("/title", getBooksByTitleController)

export default router;
