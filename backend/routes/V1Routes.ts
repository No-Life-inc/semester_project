import express, { Request, Response } from "express";
import Author from "../models/sequilize/Author";
import Book from "../models/sequilize/Book";
import Publisher from "../models/sequilize/Publisher";
import Tag from "../models/sequilize/Tag";
import User from "../models/sequilize/User"; // Removed .js extension, as TS resolves it
import UserBook from "../models/sequilize/UserBook";
import UserBookTag from "../models/sequilize/UserBookTag";

const router = express.Router();

// Define your routes here
router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from v1 API!" });
});

// Endpoint to get all data for each model
router.get("/:model", async (req: Request, res: Response) => {
    const { model } = req.params;
    let Model: any;

    switch (model) {
        case "authors":
            Model = Author;
            break;
        case "books":
            Model = Book;
            break;
        case "publishers":
            Model = Publisher;
            break;
        case "tags":
            Model = Tag;
            break;
        case "users":
            Model = User;
            break;
        case "user_books":
            Model = UserBook;
            break;
        case "user_book_tags":
            Model = UserBookTag;
            break;
        default:
            return res.status(400).json({ error: "Invalid model name" });
    }

    try {
        const data = await Model.findAll(); // Fetch all records for the specified model
        res.json(data);
    } catch (error) {
        console.error(`Error fetching data for ${model}:`, error);
        res.status(500).json({ error: `An error occurred while fetching data for ${model}` });
    }
});

// Endpoint to get data by ID for each model
router.get("/:model/:id", async (req: Request, res: Response) => {
    const { model, id } = req.params;
    let Model: any;

    switch (model) {
        case "authors":
            Model = Author;
            break;
        case "books":
            Model = Book;
            break;
        case "publishers":
            Model = Publisher;
            break;
        case "tags":
            Model = Tag;
            break;
        case "users":
            Model = User;
            break;
        case "user_books":
            Model = UserBook;
            break;
        case "user_book_tags":
            Model = UserBookTag;
            break;
        default:
            return res.status(400).json({ error: "Invalid model name" });
    }

    try {
        const data = await Model.findByPk(id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: `${model.slice(0, -1)} not found` });
        }
    } catch (error) {
        console.error(`Error fetching ${model.slice(0, -1)} by ID:`, error);
        res.status(500).json({ error: `An error occurred while fetching ${model.slice(0, -1)} by ID` });
    }
});

export default router;
