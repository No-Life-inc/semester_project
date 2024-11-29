import { Request, Response } from "express";
import { registerUser, loginUser } from "../../services/mongo/userService";

/**
 * Registers a new user.
 *
 * @param req - HTTP Request.
 * @param res - HTTP Response.
 * @returns The registered user and JWT token.
 */
export const registerUserController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, email, or password." });
    }

    const result = await registerUser(name, email.toLowerCase(), password);
    res.status(201).json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({
        error: error.message || "An error occurred while registering the user.",
      });
  }
};

/**
 * Logs in a user.
 *
 * @param req - HTTP Request.
 * @param res - HTTP Response.
 * @returns The logged-in user and JWT token.
 */
export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Missing required fields: email or password." });
    }

    const result = await loginUser(email.toLowerCase(), password);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({
        error: error.message || "An error occurred while logging in the user.",
      });
  }
};
