import { Router } from "express";
import bookRouter from './bookRoutes';
import collectionRouter from './collectionRoutes';
import userBookRouter from './userBookRoutes';
import userRouter from './userRoutes';

const router = Router();

router.use("/book", bookRouter);
router.use("/collection", collectionRouter)
router.use("/userBook", userBookRouter);
router.use("/user", userRouter);

export default router;