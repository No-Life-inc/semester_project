import {Request, Response} from "express";
import { loginUser, registerUser } from "../../services/neo4j/userService";

/**
 * Controller for logging in a user.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 *
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
 * Controller for registering a new user.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @param {Response} response - The HTTP response object to send data or errors.
 * 
 * @returns {Promise<void>} - A promise that resolves to void.
 * 
 * @example
 * // POST /register
 * registerUserController(request, response);
 * // This will register a new user with the given details
 * 
 **/
export const registerUserController = async (request: Request, response: Response) => {
    const { name, email, password } = request.body;

    try {
        const user = await registerUser(name, email.toLowerCase(), password);
        response.json(user);
    } catch (error: any) {
        const errorMessage = error.message || "An error occurred while registering user";
        response.status(500).json({ error: errorMessage });
    }
}