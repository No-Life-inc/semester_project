import { Router } from "express";
import bookRouter from './bookRoutes';
import collectionRouter from './collectionRoutes';
import userBookRouter from './userBookRoutes';
import userRouter from './userRoutes';
import subjectRouter from "./subjectRouter";
import tagRouter from "./tagRouter";

const router = Router();

router.use("/book", bookRouter);
router.use("/collection", collectionRouter)
router.use("/userBook", userBookRouter);
router.use("/user", userRouter);
router.use("/subject", subjectRouter);
router.use("/tag", tagRouter);


export default router;