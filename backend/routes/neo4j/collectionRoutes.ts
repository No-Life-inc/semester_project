import express from "express";
import {getUserCollectionsController } from "../../controllers/neo4j/collectionController";

const router = express.Router();

router.get("/", getUserCollectionsController);

export default router;
