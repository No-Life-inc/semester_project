import express from "express";
import {getBooksController, getBookByISBNController } from "../../controllers/neo4j/bookController";

const router = express.Router();

router.get("/", getBooksController);
router.get("/:isbn", getBookByISBNController);

export default router;
