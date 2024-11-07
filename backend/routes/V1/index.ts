import { Router } from "express";
import bookRouter from "./bookRoutes";
import authorRouter from "./authorRoutes";
import publisherRouter from "./publisherRoutes";
import collectionRouter from "./collectionRoutes";
import userRouter from "./userRoutes";
import userBookRouter from "./userBookRoutes";
import tagRouter from "./tagRoutes";


const router = Router();

router.use("/book", bookRouter);
router.use("/author", authorRouter);
router.use("/publisher", publisherRouter);
router.use("/collection", collectionRouter);
router.use("/user", userRouter);
router.use("/userBook", userBookRouter);
router.use("/tag", tagRouter);

export default router;