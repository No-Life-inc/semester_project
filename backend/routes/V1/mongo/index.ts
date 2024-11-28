import { Router } from "express";
import collectionRoutes from "./collectionRoutes";
import tagRoutes from "./tagRoutes";
import userRoutes from "./userRoutes";
import subjectRoutes from "./subjectRoutes";
import userBookRoutes from "./userBookRoutes";

const router = Router();

router.use("/collection",collectionRoutes );
router.use("/tag", tagRoutes );
router.use("/user", userRoutes);
router.use("/subject", subjectRoutes);
router.use("/userbook", userBookRoutes);



export default router;