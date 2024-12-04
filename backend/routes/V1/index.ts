import { Router } from "express";
import bookRouter from "./bookRoutes";
import collectionRouter from "./collectionRoutes";
import userBookRouter from "./userBookRoutes";
import subjectRouter from "./subjectRoutes";
import bookSubjectRouter from "./bookSubjectRoutes";
import tagRouter from "./tagRoutes";
import userBookTagRouter from "./userBookTagRoutes";
import userRouter from "./userRoutes";
import neo4jrouter from '../neo4j/neoIndex';
import mongoRouter from '../mongo/index';

const router = Router();

router.use("/book", bookRouter);
router.use("/collection", collectionRouter);
router.use("/userBook", userBookRouter);
router.use("/subject", subjectRouter);
router.use("/bookSubject", bookSubjectRouter);
router.use("/tag", tagRouter);
router.use("/userBookTag", userBookTagRouter);
router.use("/user",  userRouter);
router.use("/neo4j", neo4jrouter);
router.use("/mongo", mongoRouter);

export default router;