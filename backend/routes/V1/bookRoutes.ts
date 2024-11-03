import express, { Request, Response } from "express";
import Book from "../../models/sequelize/Book";
import { getBooks, getBookById } from "../../controllers/bookController";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  /**
   * Query parameters:
   * - page: The page number to fetch (default: 1)
   * - limit: The number of records to fetch per page (default: 50)
   *
   * Example: /book?page=1&limit=50
   *
   * This will fetch the first 50 books
   *
   */

  const { page = 1, limit = 50 } = req.query; // Default to page 1 and limit 50

  try {
    const books = await getBooks(Number(page), Number(limit));

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "An error occurred while fetching books" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  /**
   * URL parameters:
   * - id: The ID of the book to fetch
   *
   * Example: /book/1
   *
   * This will fetch the book with ID 1
   */

  const { id } = req.params;

  try {
    const book = await getBookById(Number(id));

    res.json(book);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching the book" });
  }
});

export default router;
