import express, { Request, Response } from "express";
import { getDashboard, handleCallback } from "../controllers/userController";
import pkg from "express-openid-connect";

const {  requiresAuth } = pkg;

const router = express.Router();

router.get("/callback", handleCallback);

router.get("/dashboard", requiresAuth(), getDashboard);

router.get("/login", requiresAuth(), (req: Request, res: Response) => {
  res.redirect("/api/dashboard");
});

//TODO
// Logger ikke ud korrekt, skal fikses
// router.get("/logout", (req: Request, res: Response) => {
//   req.oidc.logout({ returnTo: "http://localhost:5000/api" });
// });

// router.get("/logout", (req: Request, res: Response) => {
//   const logoutUrl = `https://${process.env.ISSUER_BASE_URL}/v2/logout?returnTo=http://localhost:5000`;
//   res.redirect(logoutUrl);
// });

export default router;
