import express from "express";
import {
    registerUserController,
    loginUserController,
    editUserController,
    editPasswordController
} from "../../controllers/userController";
import {authenticate} from "../../utility/authMiddleware";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.patch("/editUser",  authenticate, editUserController);
router.patch("/editPassword", authenticate,  editPasswordController)

export default router;
