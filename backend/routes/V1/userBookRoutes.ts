import express, { Request, Response } from "express";
import { addBookToUser } from "../../controllers/userBookController";


const router = express.Router();

router.post("/:userId/:bookId", async (req: Request, res: Response) => {
  const { userId, bookId } = req.params;

  try {
    const book = await addBookToUser(Number(userId), Number(bookId));

    res.json(book);
  } catch (error) {
    console.error("Error adding book to user:", error);
    res.status(500).json({ error: "An error occurred while adding the book to the user" });
  }
});