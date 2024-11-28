import bcrypt from "bcryptjs";
import User from "../models/sequelize/User";
import {validateEmail, validateName, validatePassword} from "./validatorService";
import {generateToken, verifyToken, DecodedToken} from "./jwtService";

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
        throw new Error("Email is already in use.");
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
        throw new Error("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password.");
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
 * @param {string} token - The JWT token of the user
 * @param {string} name - The new name of the user
 * @param {string} email - The email of the user
 * @returns {Promise<void>} - A promise that resolves to void
 *
 * @example
 * editUser("JWT_TOKEN", "Johndoeee", "johndoe@hotmail.com")
 * This will edit the user with the given name and email
 * if the user with the given email exists.
 */

export const editUser = async (token: DecodedToken, name: string, email: string) => {
    if (name) {
        validateName(name);
    }
    if (email) {
        validateEmail(email);
    }

    const user = await User.findOne({ where: { email: token.email } });

    if (!user) {
        throw new Error("User not found.");
    }

    if (email) {
        user.email = email;
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
 * @param {string} token - The JWT token of the user
 * @param {string} oldPassword - The old password of the user
 * @param {string} password - The new password of the user
 * @returns {Promise<void>} - A promise that resolves to void
 *
 * @example
 * editPassword("JWT_TOKEN", "password123", "password1234")
 * This will edit the user with the given password
 * if the user with the given password exists.
 */
export const editPassword = async (token: DecodedToken, oldPassword: string, password: string) => {

    validatePassword(password);

    const user = await User.findOne({
        where: { email: token.email, },
        attributes: { include: ["password"] },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Invalid password.");
    }

    user.password = password;
    await user.save();
    return "Your password has been updated successfully."
}
