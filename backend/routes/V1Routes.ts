import express, { Request, Response } from "express";
import User from "../models/User"; // Removed .js extension, as TS resolves it
import BookCollection from "../models/BookCollection";
import Book from "../models/Book";
import Author from "../models/Author";
import Publisher from "../models/Publisher";

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
        case "users":
            Model = User;
            break;
        case "bookCollections":
            Model = BookCollection;
            break;
        case "books":
            Model = Book;
            break;
        case "authors":
            Model = Author;
            break;
        case "publishers":
            Model = Publisher;
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
        case "users":
            Model = User;
            break;
        case "bookCollections":
            Model = BookCollection;
            break;
        case "books":
            Model = Book;
            break;
        case "authors":
            Model = Author;
            break;
        case "publishers":
            Model = Publisher;
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
