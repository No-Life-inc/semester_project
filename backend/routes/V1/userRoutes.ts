import express from "express";
import {
    registerUserController,
    loginUserController,
    editUserController,
    editPasswordController
} from "../../controllers/userController";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.patch("/editUser", editUserController);
router.patch("/editPassword", editPasswordController)

export default router;
