import express, { Request, Response } from "express";
import Book from "../../models/sequelize/Book";
import { getBooksController, getBookByIdController } from "../../controllers/bookController";

const router = express.Router();

router.get("/", getBooksController);

router.get("/:id", getBookByIdController);

export default router;
