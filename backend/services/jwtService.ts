import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

interface DecodedToken {
    name: string;
    email: string;
}

/**
 * Generates a JWT token for the given user.
 *
 * @param {object} user - The user object for which to generate the token
 * @returns {string} - The generated JWT token
 */
export const generateToken = (user: { name: string; email: string }): string => {
    return jwt.sign(
        { name: user.name, email: user.email }, // Payload
        JWT_SECRET,
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
export const verifyToken = (token: string): DecodedToken => {
    try {
        return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
        throw new Error("Invalid or expired token.");
    }
};
