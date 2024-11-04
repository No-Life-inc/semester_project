import express, { Request, Response } from "express";
import { getDashboard, handleCallback } from "../../controllers/userController";
import pkg from "express-openid-connect";

const {  requiresAuth } = pkg;

const router = express.Router();

router.get("/callback", handleCallback);

router.get("/dashboard", requiresAuth(), getDashboard);

router.get("/login", requiresAuth(), (req: Request, res: Response) => {
  res.redirect("/v1/user/dashboard");
});

router.get("/logout", (req: Request, res: Response) => {
  res.oidc.logout({ returnTo: process.env.BASE_URL || "http://localhost:5000" });
});



export default router;
