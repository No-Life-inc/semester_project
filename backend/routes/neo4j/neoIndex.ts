import { Router } from "express";
import bookRouter from './bookRoutes';
import collectionRouter from './collectionRoutes';
import userBookRouter from './userBookRoutes';

const router = Router();

router.use("/book", bookRouter);
router.use("/collection", collectionRouter)
router.use("/userbook", userBookRouter);

export default router;