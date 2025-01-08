import { Response, NextFunction } from "express";
import { verifyToken } from "../services/jwtService";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
