import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import bcrypt from "bcrypt";
import { generateToken } from "../jwtService";
import { ValidationError } from "../../utility/errors";
import {validateEmail, validateName, validatePassword} from "../validatorService";
import { v4 as uuidv4 } from "uuid";


/**
 * 
 *  This function logs in a user by checking the email and password and returning the user and token.
 * 
 * @param email email of the user
 * @param password password of the user
 * @returns  user and token
 */
export const loginUser = async (email: string, password: string) => {
    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        // Query the database for the user with the given email
        const result = await session.run(
            `
            MATCH (u:User {email: $email})
            RETURN u.password AS password, u.name AS name, u.email AS email
            `,
            { email }
        );

        // Check if user exists
        if (result.records.length === 0) {
            throw new ValidationError("Invalid email or password.");
        }

        const record = result.records[0];
        const hashedPassword = record.get("password");
        const userEmail = record.get("email");
        const userName = record.get("name");

        // Verify the password
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            throw new ValidationError("Invalid email or password.");
        }

        // Prepare user object without the password
        const userWithoutPassword = { email: userEmail, name: userName };

        // Generate JWT token with name and email in the payload
        const token = generateToken(userWithoutPassword);

        return { user: userWithoutPassword, token };
    } catch (error) {
        console.error("Error during login:", error);
        throw new ValidationError("Invalid email or password.");
    } finally {
        await session.close();
        await driver.close();
    }
};

/**
 * This function creates a new user in the database.
 *
 * @param name name of the user
 * @param email email of the user
 * @param password password of the user
 * @returns user and token
 */
export const registerUser = async (name: string, email: string, password: string) => {
    validatePassword(password);
    validateEmail(email);
    validateName(name);

    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        // Check if a user with the same email already exists
        const existingUserResult = await session.run(
            `
            MATCH (u:User {email: $email})
            RETURN u
            `,
            { email }
        );

        if (existingUserResult.records.length > 0) {
            throw new ValidationError("A user with this email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const guid = uuidv4();

        // Cypher query to create a new user
        const result = await session.run(
            `
            CREATE (u:User {name: $name, email: $email, password: $password, guid: $guid})
            RETURN u
            `,
            { name, email, password: hashedPassword, guid }
        );

        const createdUser = result.records[0].get("u");

        // Prepare user object without the password
        const userWithoutPassword = {
            email: createdUser.properties.email,
            name: createdUser.properties.name,
        };

        // Generate JWT token with name and email in the payload
        const token = generateToken(userWithoutPassword);

        return { user: userWithoutPassword, token };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    } finally {
        await session.close();
        await driver.close();
    }
};

