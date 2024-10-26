import express, { Request, Response } from "express";
import Publisher from "../../models/sequilize/Publisher";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    /**
     * Query parameters:
     * - page: The page number to fetch (default: 1)
     * - limit: The number of records to fetch per page (default: 10)
     * 
     * Example: /publisher?page=1&limit=10
     * 
     * This will fetch the first 10 publishers
     * 
     */

    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    const offset = (Number(page) - 1) * Number(limit);

    try {
        const publishers = await Publisher.findAll({
            offset,
            limit: Number(limit)
        });
        res.json(publishers);
    } catch (error) {
        console.error("Error fetching publishers:", error);
        res.status(500).json({ error: "An error occurred while fetching publishers" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    /**
     * URL parameters:
     * - id: The ID of the publisher to fetch
     * 
     * Example: /publisher/1
     * 
     * This will fetch the publisher with ID 1
     */
    
    const { id } = req.params;

    try {
        const publisher = await Publisher.findByPk(id);

        if (!publisher) {
            return res.status(404).json({ error: "Publisher not found" });
        }

        res.json(publisher);
    } catch (error) {
        console.error("Error fetching publisher:", error);
        res.status(500).json({ error: "An error occurred while fetching publisher" });
    }
});

export default router;