import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY

/**
 * Generates a JWT token for the given user.
 *
 * @param {object} user - The user object for which to generate the token
 * @returns {string} - The generated JWT token
 */
export const generateToken = (user: { id: number; email: string }): string => {
    return jwt.sign(
        { id: user.id, email: user.email }, // Payload
        SECRET_KEY,
        { expiresIn: "1h" } // Token expiration time
    );
};

/**
 * Verifies the given JWT token.
 *
 * @param {string} token - The token to verify
 * @returns {object} - The decoded token payload if valid
 * @throws {Error} - If the token is invalid or expired
 */
export const verifyToken = (token: string): object => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error("Invalid or expired token.");
    }
};
