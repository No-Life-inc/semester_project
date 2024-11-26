import { User } from "../../models/mongoose/UserModel";

export const createCollectionService = async (userId: string, collectionName: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.collections.push({ name: collectionName, books: [] });
    await user.save();

    return user.collections[user.collections.length - 1];
};

export const deleteCollectionService = async (userId: string, collectionId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.collections = user.collections.filter(
        (collection) => collection._id.toString() !== collectionId
    );
    await user.save();
};

export const editCollectionService = async (
    userId: string,
    collectionId: string,
    updatedName: string
) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const collection = user.collections.find(
        (collection) => collection._id.toString() === collectionId
    );

    if (!collection) {
        throw new Error("Collection not found");
    }

    collection.name = updatedName;
    await user.save();

    return collection;
};

export const getCollectionsService = async (userId: string) => {
    const user = await User.findById(userId).populate("collections.books");
    if (!user) {
        throw new Error("User not found");
    }

    return user.collections;
};
