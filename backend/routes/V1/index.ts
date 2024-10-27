import { Router } from "express";
import bookRouter from "./bookRoutes";
import authorRouter from "./authorRoutes";
import publisherRouter from "./publisherRoutes";
import collectionRouter from "./collectionRoutes";


const router = Router();

router.use("/book", bookRouter);
router.use("/author", authorRouter);
router.use("/publisher", publisherRouter);
router.use("/collection", collectionRouter);

export default router;