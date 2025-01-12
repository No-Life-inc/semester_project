// routes/subjectRoutes.ts
import { Router } from 'express';
import { getAllSubjectsController, getSubjectByIdController } from '../../controllers/subjectController';

const router = Router();

router.get('/', getAllSubjectsController);
router.get('/id/:id', getSubjectByIdController);

export default router;
