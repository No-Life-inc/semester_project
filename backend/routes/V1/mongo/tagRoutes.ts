import express from 'express';
import {addTagController, getTagsController, removeTagController,} from '../../../controllers/mongo/tagController';

const router = express.Router();

router.get('/:userId/:bookId', getTagsController);
router.post('/:userId/:bookId', addTagController);
router.delete('/:userId/:bookId', removeTagController);

export default router;