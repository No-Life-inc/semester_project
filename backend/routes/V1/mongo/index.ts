import { Router } from "express";
import collectionRoutes from "./collectionRoutes";
import tagRoutes from "./tagRoutes";
import userRoutes from "./userRoutes";


const router = Router();

router.use("/collection",collectionRoutes );
router.use("/tag", tagRoutes );
router.use("/user", userRoutes);



export default router;