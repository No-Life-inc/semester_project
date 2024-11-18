import { Router } from "express";
import bookRouter from "./bookRoutes";
import authorRouter from "./authorRoutes";
import publisherRouter from "./publisherRoutes";
import collectionRouter from "./collectionRoutes";
import userBookRouter from "./userBookRoutes";
import subjectRouter from "./subjectRoutes";
import bookSubjectRouter from "./bookSubjectRoutes";
import tagRouter from "./tagRoutes";
import userBookTagRouter from "./userBookTagRoutes";
import userRouter from "./userRoutes";


const router = Router();

router.use("/book", bookRouter);
router.use("/author", authorRouter);
router.use("/publisher", publisherRouter);
router.use("/collection", collectionRouter);
router.use("/userBook", userBookRouter);
router.use("/subject", subjectRouter);
router.use("/bookSubject", bookSubjectRouter);
router.use("/tag", tagRouter);
router.use("/userBookTag", userBookTagRouter);
router.use("/user",  userRouter);


export default router;