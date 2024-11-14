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
    const {name, email, password} = request.body;

    try {
        const user = await registerUser(name, email, password);
        response.json(user);
    } catch (error) {
        console.error("Error registering user:", error);
        response.status(500).json({error: "An error occurred while registering user"});
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
    const {email, password} = request.body;

    try {
        const user = await loginUser(email, password);
        response.json(user);
    } catch (error) {
        console.error("Error logging in user:", error);
        response.status(500).json({error: "An error occurred while logging in user"});
    }
}


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
    const {name, email} = request.body;

    try {
        const user = await editUser(name, email);
        response.json(user);
    } catch (error) {
        console.error("Error editing user:", error);
        response.status(500).json({error: "An error occurred while editing user"});
    }
}

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
    const {email, password} = request.body;

    try {
        const user = await editPassword(email, password);
        response.json(user);
    } catch (error) {
        console.error("Error editing user password:", error);
        response.status(500).json({error: "An error occurred while editing user password"});
    }
}
