import {
    createCollectionService,
    deleteCollectionService,
    editCollectionService,
    getCollectionsService,
} from "../../services/mongo/collectionService";

export const createCollection = async (req, res) => {
    const { userId } = req.params;
    const { name } = req.body;

    try {
        const collection = await createCollectionService(userId, name);
        res.status(201).json({ success: true, collection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCollection = async (req, res) => {
    const { userId, collectionId } = req.params;

    try {
        await deleteCollectionService(userId, collectionId);
        res.status(200).json({ success: true, message: "Collection deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const editCollection = async (req, res) => {
    const { userId, collectionId } = req.params;
    const { name } = req.body;

    try {
        const collection = await editCollectionService(userId, collectionId, name);
        res.status(200).json({ success: true, collection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getCollections = async (req, res) => {
    const { userId } = req.params;

    try {
        const collections = await getCollectionsService(userId);
        res.status(200).json({ success: true, collections });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
