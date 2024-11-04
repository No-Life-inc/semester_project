import { Router, Request, Response } from "express";
import User from "../../models/sequelize/User";
import Collection from "../../models/sequelize/Collection";
import UserBook from "../../models/sequelize/UserBook";
import Book from "../../models/sequelize/Book";
import * as CollectionController from "../../controllers/collectionController";

const router = Router();

// Endpoint to get collections belonging to a user along with associated books
router.get("/:userId/", async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Fetch collections belonging to the user and include associated books via UserBook
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Collection,
                    as: "collections",
                    through: { attributes: [] },
                    include: [
                        {
                            model: UserBook,
                            as: "user_books",
                            include: [
                                {
                                    model: Book,
                                    as: "book" // Ensure this matches the alias defined in the association
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.collections);
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ error: "An error occurred while fetching collections" });
    }
});

router.post("/", CollectionController.createCollection);

export default router;
