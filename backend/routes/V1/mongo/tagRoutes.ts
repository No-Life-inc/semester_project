import express from 'express';
import {addTagController, getTagsController, removeTagController,} from '../../../controllers/mongo/tagController';
import {authenticate} from "../../../utility/authMiddleware";

const router = express.Router();
router.use(authenticate);

router.get('/', getTagsController);
router.post('/', addTagController);
router.delete('/', removeTagController);

export default router;