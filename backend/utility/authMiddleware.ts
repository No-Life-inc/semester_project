import { Response, NextFunction } from "express";
import { verifyToken } from "../services/jwtService";
import { UnauthorizedError } from "../utility/errors";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("Token not provided");
  }

  try {
    const decoded = verifyToken(token);
    req.user = { email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
