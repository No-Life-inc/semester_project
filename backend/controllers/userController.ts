import {Request, Response} from "express";
import {registerUser, loginUser, editUser, editPassword} from "../services/userService";

/**
 * Registers a new user.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * POST /register
 * registerUserController(request, response)
 * This will register a new user with the provided name, email, and password
 */
export const registerUserController = async (request: Request, response: Response) => {
    const { name, email, password } = request.body;

    try {
        const user = await registerUser(name, email.toLowerCase(), password);
        response.json(user);
    } catch (error: any) {
        const errorMessage = error.message || "An error occurred while registering user";
        response.status(500).json({ error: errorMessage });
    }
};

/**
 * Logs in a user.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const loginUserController = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const user = await loginUser(email.toLowerCase(), password);
        response.json(user);
    } catch (error: any) {
        const errorMessage = error.message || "An error occurred while logging in user";
        response.status(500).json({ error: errorMessage });
    }
};


/**
 * Edit user details without the password.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // PUT /edit
 * editUserController(request, response)
 * // This will edit the user details without the password
 */
export const editUserController = async (request: Request, response: Response) => {
    const authHeader = request.header("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
        return response.status(400).json({ error: "Authorization header is required or invalid token format" });
    }

    const { name, email } = request.body;

    if (!name && !email) {
        return response.status(400).json({ error: "At least one of 'name' or 'email' must be provided" });
    }

    try {
        const result = await editUser(token, name, email.toLowerCase());
        response.json({ message: result });
    } catch (error: any) {
        const errorMessage = error.message || "An error occurred while editing user";
        response.status(500).json({ error: errorMessage });
    }
};

/**
 * Edit user password.
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @example
 * // PUT /editPassword
 * editPasswordController(request, response)
 * // This will edit the user password
 */
export const editPasswordController = async (request: Request, response: Response) => {
    const authHeader = request.header("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
        return response.status(400).json({ error: "Authorization header is required or invalid token format" });
    }

    const { oldPassword, password } = request.body;
    if (!oldPassword || !password) {
        return response.status(400).json({ error: "Both 'oldPassword' and 'password' must be provided" });
    } else if (oldPassword === password) {
        return response.status(400).json({ error: "New password must be different from old password" });
    }

    try {
        const result = await editPassword(token, oldPassword, password);
        response.json({ message: result });
    } catch (error: any) {
        const errorMessage = error.message || "An error occurred while editing user password";
        response.status(500).json({ error: errorMessage });
    }
};

const extractToken = (authHeader: string | undefined): string | null => {
    if (!authHeader) return null;
    return authHeader;
};