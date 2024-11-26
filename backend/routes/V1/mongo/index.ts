import { Router } from "express";
import collectionRoutes from "./collectionRoutes";
import tagRoutes from "./tagRoutes";


const router = Router();

router.use("/collection",collectionRoutes );
router.use("/tag", tagRoutes );



export default router;