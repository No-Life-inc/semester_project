import { Router } from "express";
import bookRouter from './bookRoutes';
import collectionRouter from './collectionRoutes';


const router = Router();

router.use("/book", bookRouter);
router.use("/collection", collectionRouter)


export default router;