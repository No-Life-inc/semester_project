import User from "../models/sequelize/User";
import Collection from "../models/sequelize/Collection";
import UserCollection from "../models/sequelize/UserCollection";
import UserBook from "../models/sequelize/UserBook";
import Book from "../models/sequelize/Book";
import UserBookCollection from "../models/sequelize/UserBookCollection";

export const createCollection = async (name: string, userId: number) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const newCollection = await Collection.create({ name });
    await UserCollection.create({ user_id: userId, collection_id: newCollection.id });
    return newCollection;
};

export const getUserCollections = async (userId: number) => {
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
    if (!user) throw new Error("User not found");
    return user.collections;
};

export const updateCollection = async (id: number, name: string) => {
    const updatedCollection = await Collection.update(
        { name },
        { where: { id } }
    );
    if (updatedCollection[0] === 0) throw new Error("Collection not found");
    return updatedCollection;
};

export const deleteCollection = async (id: number, userId: number) => {
    const ownership = await UserCollection.findOne({
        where: { user_id: userId, collection_id: id },
    });
    if (!ownership) throw new Error("Unauthorized to delete this collection");

    await UserBookCollection.destroy({ where: { collection_id: id } });
    await UserCollection.destroy({ where: { collection_id: id } });
    const deletedCollection = await Collection.destroy({ where: { id } });
    if (!deletedCollection) throw new Error("Collection not found");

    return deletedCollection;
};