import { Router } from "express";
import bookRouter from "./bookRoutes";
import authorRouter from "./authorRoutes";
import publisherRouter from "./publisherRoutes";


const router = Router();

router.use("/book", bookRouter);
router.use("/author", authorRouter);
router.use("/publisher", publisherRouter);

export default router;