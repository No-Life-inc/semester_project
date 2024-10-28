import express, { Request, Response } from "express";
import Author from "../../models/sequelize/Author";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  /**
   * Query parameters:
   * - page: The page number to fetch (default: 1)
   * - limit: The number of records to fetch per page (default: 10)
   *
   * Example: /author?page=1&limit=10
   *
   * This will fetch the first 10 authors
   *
   */

  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  const offset = (Number(page) - 1) * Number(limit);

  try {
    const authors = await Author.findAll({
      offset,
      limit: Number(limit),
    });
    res.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ error: "An error occurred while fetching authors" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  /**
   * URL parameters:
   * - id: The ID of the author to fetch
   *
   * Example: /author/1
   *
   * This will fetch the author with ID 1
   */

  const { id } = req.params;

  try {
    const author = await Author.findByPk(id);

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).json({ error: "An error occurred while fetching author" });
  }
});

export default router;
