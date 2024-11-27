import express from "express";
import {getBooksController, getBookByISBNController, getBooksByTitleController } from "../../controllers/neo4j/bookController";

const router = express.Router();

router.get("/", getBooksController);
router.get("/isbn/:isbn", getBookByISBNController);
router.get('/search', getBooksByTitleController);

export default router;
