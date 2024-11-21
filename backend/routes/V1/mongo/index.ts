import { Router } from "express";


const router = Router();

router.use("/book", bookRouter);



export default router;