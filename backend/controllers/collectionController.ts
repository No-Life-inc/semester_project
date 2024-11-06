import { Request, Response } from "express";
import * as CollectionService from "../services/collectionService";

//TODO - smid kommentarer ind på alle funktioner i form af parametre og returtyper
export const createCollection = async (req: Request, res: Response) => {
  const { name, userId } = req.body;
  try {
    const newCollection = await CollectionService.createCollection(
      name,
      userId
    );
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserCollections = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const collections = await CollectionService.getUserCollections(
      Number(userId)
    );
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await CollectionService.updateCollection(Number(id), name);
    res.json({ message: "Collection updated successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  try {
    await CollectionService.deleteCollection(Number(id), Number(userId));
    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
