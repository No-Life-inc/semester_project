import {Request, Response} from "express";
import {registerUser, loginUser, editUser, editPassword} from "../services/userService";
import {AuthenticatedRequest} from "../types/authenticatedRequest";
import {BadRequestError, BaseError, ValidationError} from "../utility/errors";

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
        if (!name || !email || !password) {
            throw new BadRequestError("Name, email, and password are required");
        }

        const user = await registerUser(name, email.toLowerCase(), password);
        response.status(201).json(user);
    } catch (error: any) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
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
        if (!email || !password) {
            throw new BadRequestError("Email and password are required");
        }

        const user = await loginUser(email.toLowerCase(), password);

        response.json(user);
    } catch (error: any) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
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
export const editUserController = async (request: AuthenticatedRequest, response: Response) => {
    const { name, email: newEmail } = request.body;
    const { email  }  = request.user;

    try {
        if (!name && !newEmail) {
            throw new BadRequestError("At least one of 'name' or 'email' must be provided");
        }

        const result = await editUser(email, name, newEmail?.toLowerCase());
        response.json({ message: result });
    } catch (error: any) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
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
export const editPasswordController = async (request: AuthenticatedRequest, response: Response) => {
    const { password, oldPassword} = request.body;
    const { email } = request.user;

    try {
        if (!oldPassword || !password) {
            throw new BadRequestError("Both 'oldPassword' and 'password' must be provided");
        }

        if (oldPassword === password) {
            throw new ValidationError("New password must be different from old password");
        }

        const result = await editPassword(email, oldPassword, password);
        response.json({ message: result });
    } catch (error: any) {
        if (error instanceof BaseError) {
            response.status(error.statusCode).json({ error: error.message });
        } else {
            response.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};
