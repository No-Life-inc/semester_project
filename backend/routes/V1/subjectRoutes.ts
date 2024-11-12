// routes/subjectRoutes.ts
import { Router } from 'express';
import { getAllSubjectsController, getSubjectByIdController } from '../../controllers/subjectController';

const router = Router();

router.get('/subjects', getAllSubjectsController);
router.get('/subjects/:id', getSubjectByIdController);

export default router;
