import { Router } from "express";
import bookRouter from './bookRoutes';
import collectionRouter from './collectionRoutes';
import userBookRouter from './userBookRoutes';
import userRouter from './userRoutes';
import subjectRouter from "./subjectRouter";

const router = Router();

router.use("/book", bookRouter);
router.use("/collection", collectionRouter)
router.use("/userBook", userBookRouter);
router.use("/user", userRouter);
router.use("/subject", subjectRouter);

export default router;