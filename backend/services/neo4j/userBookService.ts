import connectToNeo4j from "../../dbconnections/Neo4jConnection";

/**
 * Fetches user books and their associated book details from Neo4j.
 *
 * @param {string} email - The email of the user to fetch books for.
 * @param {number} page - The page number to fetch (default: 1).
 * @param {number} limit - The number of records to fetch per page (default: 50).
 * @returns {Promise<{ books: any[] }>} - A promise that resolves to an object containing the books.
 */
export const getUserBooks = async (email: string, page: number = 1, limit: number = 50): Promise<{ books: any[] }> => {
    if (!email || typeof email !== "string") {
        throw new Error("Invalid email. Email must be a non-empty string.");
    }

    if (isNaN(page) || page < 1) {
        throw new Error("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
        throw new Error("Invalid limit. Limit must be a number between 1 and 100.");
    }

    // Connect to Neo4j
    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        const query = `
            MATCH (u:User {email: $email})-[:HAS_BOOK]->(b:Book)
            RETURN b SKIP 1 LIMIT 50
        `;

        const params = { email, page, limit };

        const result = await session.run(query, params);

        // Extract book details
        const books = result.records.map(record => record.get("b"));

        return { books };
    } catch (error) {
        console.error("Error fetching user books:", error);
        throw error;
    } finally {
        await session.close();
        await driver.close();
    }
};
