import express, { Request, Response } from "express";
import Tag from "../../models/sequelize/Tag";

const router = express.Router();

router.get("/tag", async (req: Request, res: Response) => {
  /**
   * Query parameters:
   * - page: The page number to fetch (default: 1)
   * - limit: The number of records to fetch per page (default: 10)
   *
   * Example: /tag?page=1&limit=10
   *
   * This will fetch the first 10 tags
   *
   */

  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  const offset = (Number(page) - 1) * Number(limit);

  try {
    const tags = await Tag.findAll({
      offset,
      limit: Number(limit),
    });
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "An error occurred while fetching tags" });
  }
});

router.get("/tag/:id", async (req: Request, res: Response) => {
  /**
   * URL parameters:
   * - id: The ID of the tag to fetch
   *
   * Example: /tag/1
   *
   * This will fetch the tag with ID 1
   */

  const { id } = req.params;

  try {
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    res.status(500).json({ error: "An error occurred while fetching tag" });
  }
});
