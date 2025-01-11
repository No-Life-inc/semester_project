import bcrypt from "bcryptjs";
import User from "../models/sequelize/User";
import {validateEmail, validateName, validatePassword} from "./validatorService";
import {generateToken, verifyToken, DecodedToken} from "./jwtService";
import {BadRequestError, ConflictError, NotFoundError, UnauthorizedError} from "../utility/errors";

/**
 * Registers a new user.
 *
 * @param {string} name - The name of the new user
 * @param {string} email - The email of the new user
 * @param {string} password - The password of the new user
 * @returns {Promise<User>} - The created User instance without the password
 *
 * @example
 * registerUser("johndoe", "johndoe@johndoe.com", "Password123")
 * This will create a new user with the name "johndoe", email "johndoe@johndoe.com" and password "Password123"
 * but hashing the password before storing it in the database, with the help of the User model.
 */
export const registerUser = async (name: string, email: string, password: string) => {
    validatePassword(password);
    validateEmail(email);
    validateName(name);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ConflictError("Email is already in use.");
    }

    // Create and return the new user
    const newUser = await User.create({ name, email, password });

    const userWithoutPassword = newUser.toJSON();
    delete userWithoutPassword.password;

    return userWithoutPassword;
};

/**
 * Logs in a user.
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<User>} - The logged in User instance without the password
 *
 * @example
 * loginUser("johndoe@johndoe.com", "Password123")
 * This will log in the user with the email "johndoe@johndoe.com" if the password matches the hashed password in the database.
 */
export const loginUser = async (email: string, password: string) => {

    const user = await User.findOne({
        where: { email },
        attributes: { include: ["password"] },
    });
    if (!user) {
        throw new UnauthorizedError("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new UnauthorizedError("Invalid email or password.");
    }


    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    // Generate JWT token
    const token = generateToken(user);

    return { user: userWithoutPassword, token };
};

/**
 * Edit user details without the password.
 *
 * @param {string} email - The email of the user
 * @param {string} name - The new name of the user
 * @param {string} newEmail - The new email of the user
 * @returns {Promise<void>} - A promise that resolves to void
 *
 * @example
 * editUser("user@email.com", "Johndoeee", "johndoe@hotmail.com")
 * This will edit the user with the given name and email
 * if the user with the given email exists.
 */

export const editUser = async (email: string, name: string, newEmail: string) => {
    if (name) {
        validateName(name);
    }
    if (newEmail) {
        validateEmail(newEmail);
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    if (newEmail) {
        user.email = newEmail;
    }
    if (name) {
        user.name = name;
    }

    await user.save();
    const newToken = generateToken(user);

    return { user: user, newToken };
}

/**
 * Edit user password.
 *
 * @param {string} email - The email of the user
 * @param {string} oldPassword - The old password of the user
 * @param {string} password - The new password of the user
 * @returns {Promise<void>} - A promise that resolves to void
 *
 * @example
 * editPassword("JWT_TOKEN", "password123", "password1234")
 * This will edit the user with the given password
 * if the user with the given password exists.
 */
export const editPassword = async (email: string, oldPassword: string, password: string) => {

    validatePassword(password);

    const user = await User.findOne({
        where: { email: email, },
        attributes: { include: ["password"] },
    });

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new UnauthorizedError("Old password is incorrect.");
    }

    user.password = password;
    await user.save();
    return "Your password has been updated successfully."
}

/**
 * Get user details.
 *
 * @param {string} email - The email of the user
 * @returns {Promise<User>} - The user details
 *
 * */
export const getUserIdByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundError("User not found.");
    }
    return user.id;
}