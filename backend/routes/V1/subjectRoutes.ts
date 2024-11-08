// routes/subjectRoutes.ts
import { Router } from 'express';
import { getSubjectsController, getSubjectByIdController } from '../../controllers/subjectController';

const router = Router();

router.get('/subjects', getSubjectsController);
router.get('/subjects/:id', getSubjectByIdController);

export default router;
