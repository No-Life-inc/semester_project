import { Router } from "express";
import bookRouter from "./bookRoutes";
import authorRouter from "./authorRoutes";
import publisherRouter from "./publisherRoutes";
import collectionRouter from "./collectionRoutes";
import userRouter from "./userRoutes";


const router = Router();

router.use("/book", bookRouter);
router.use("/author", authorRouter);
router.use("/publisher", publisherRouter);
router.use("/collection", collectionRouter);
router.use("/user", userRouter);

export default router;