import { Response } from 'express';
import { addTagService, getTagsService, removeTagService } from '../../services/mongo/tagService';
import {AuthenticatedRequest} from "../../types/authenticatedRequest";

export const getTagsController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.user.email;
        const bookId = req.body.bookId;
        if (!email || !bookId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const tags = await getTagsService(email, bookId);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addTagController = async (req: AuthenticatedRequest, res: Response) => {
    const email = req.user.email;
    const bookId = req.body.bookId;
    const tag = req.body.tag;
    try {
        if (!email || !bookId || !tag) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const tags = await addTagService(email, bookId, tag);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeTagController = async (req: AuthenticatedRequest, res: Response) => {
    const email = req.user.email;
    const bookId = req.body.bookId;
    const tag = req.body.tag;
    try {

        if (!email || !bookId || !tag) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const tags = await removeTagService(email, bookId, tag);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
