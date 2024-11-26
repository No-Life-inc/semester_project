import { Request, Response } from 'express';
import { addTagService, getTagsService, removeTagService } from '../../services/mongo/tagService';

export const getTagsController = async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;
    try {
        if (!userId || !bookId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const tags = await getTagsService(userId , bookId);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addTagController = async (req: Request, res: Response) => {
    const { userId, bookId } = req.params
    const { tag } = req.body;

    try {
        if (!userId || !bookId || !tag) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const tags = await addTagService(userId, bookId, tag);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeTagController = async (req: Request, res: Response) => {
    const { userId, bookId} = req.params;
    const { tag } = req.body;
    try {

        if (!userId || !bookId || !tag) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const tags = await removeTagService(userId, bookId, tag);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
