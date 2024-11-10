import express, { Request, Response } from "express";
import Book from "../../models/sequelize/Book";
import { getBooksController, getBookByIdController, getBooksByTitleController } from "../../controllers/bookController";

const router = express.Router();

router.get("/", getBooksController);
router.get("/id/:id", getBookByIdController);
router.get("/search", getBooksByTitleController);

export default router;
