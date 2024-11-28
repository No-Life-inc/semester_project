import { Router } from "express";
import collectionRoutes from "./collectionRoutes";
import tagRoutes from "./tagRoutes";
import userRoutes from "./userRoutes";
import subjectRoutes from "./subjectRoutes";
import bookRoutes from "./bookRoutes";

const router = Router();

router.use("/collection",collectionRoutes );
router.use("/tag", tagRoutes );
router.use("/user", userRoutes);
router.use("/subject", subjectRoutes);
router.use("/book", bookRoutes);



export default router;