import express from "express";
import {getBooksController } from "../../controllers/neo4j/bookController";

const router = express.Router();

router.get("/", getBooksController);

export default router;
