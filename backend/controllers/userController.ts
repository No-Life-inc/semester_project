import { Request, Response } from "express";

export const handleCallback = (req: Request, res: Response): void => {
  res.redirect("/dashboard");
};

export const getDashboard = (req: Request, res: Response): void => {
  res.send("Hello from dashboard!");
};