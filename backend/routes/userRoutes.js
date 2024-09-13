import express from "express";
import { getDashboard, handleCallback } from "../controllers/userController.js";
import pkg from "express-openid-connect";

const { auth, requiresAuth } = pkg;

const router = express.Router();

router.get("/callback", handleCallback);

router.get("/dashboard", requiresAuth(), getDashboard);

router.get("/login", requiresAuth(), (req, res) => {
  res.redirect("/api/dashboard");
});

//TODO 
// Logger ikke ud korrekt, skal fikses
// router.get("/logout", (req, res) => {
//     const logoutUrl = `https://${process.env.ISSUER_BASE_URL}/v2/logout?client_id=${process.env.CLIENT_ID}&returnTo=${process.env.BASE_URL}`;
//     res.redirect(logoutUrl);
//   });

export default router;
