import { Request, Response } from "express";
import Collection from "../models/sequelize/Collection";
import UserCollection from "../models/sequelize/UserCollection";
import UserBook from "../models/sequelize/UserBook";
import UserBookCollection from "../models/sequelize/UserBookCollection";
import User from "../models/sequelize/User";
import Book from "../models/sequelize/Book";

export const createCollection = async (req: Request, res: Response) => {
  const { name, userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCollection = await Collection.create({ name });
    await UserCollection.create({
      user_id: userId,
      collection_id: newCollection.id,
    });
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the collection",
      error,
    });
  }
};

export const getUserCollections = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
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
                  as: "book",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching collections" });
  }
};

export const updateCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCollection = await Collection.update(
      { name },
      { where: { id } }
    );
    if (updatedCollection[0] > 0) {
      res.json({ message: "Collection updated successfully" });
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the collection",
      error,
    });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  try {
    const ownership = await UserCollection.findOne({
      where: { user_id: userId, collection_id: id },
    });

    if (!ownership) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this collection" });
    }

    await UserBookCollection.destroy({ where: { collection_id: id } });
    await UserCollection.destroy({ where: { collection_id: id } });

    const deletedCollection = await Collection.destroy({ where: { id } });
    if (deletedCollection) {
      res.json({ message: "Collection deleted successfully" });
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the collection",
      error,
    });
  }
};
