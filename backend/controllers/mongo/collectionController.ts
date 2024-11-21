import { User } from "../../models/mongoose/UserModel";

export const createCollection = async (userId: string, collectionName: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.collections.push({ name: collectionName, books: [] });
        await user.save();

        return { success: true, collection: user.collections[user.collections.length - 1] };
    } catch (error) {
        throw new Error(`Error creating collection: ${error.message}`);
    }
};

export const deleteCollection = async (userId: string, collectionId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        user.collections = user.collections.filter(
            (collection) => collection._id.toString() !== collectionId
        );
        await user.save();

        return { success: true, message: 'Collection deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting collection: ${error.message}`);
    }
};

export const editCollection = async (userId: string, collectionId: string, updatedName: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const collection = user.collections.find(
            (collection) => collection._id.toString() === collectionId
        );

        if (!collection) {
            throw new Error('Collection not found');
        }

        collection.name = updatedName;
        await user.save();

        return { success: true, collection };
    } catch (error) {
        throw new Error(`Error editing collection: ${error.message}`);
    }
};

export const getCollections = async (userId: string) => {
    try {
        const user = await User.findById(userId).populate('collections.books');
        if (!user) {
            throw new Error('User not found');
        }

        return { success: true, collections: user.collections };
    } catch (error) {
        throw new Error(`Error fetching collections: ${error.message}`);
    }
};
