import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import Collection from "../../types/collection"; // Assuming a type for collections
import Book from "../../types/book"; // Assuming a type for books

/**
 * Fetches collections for a specific user from the Neo4j database.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection[]>} - A promise that resolves to an array of collections with their books.
 * @throws {Error} - Throws an error if the user is not found.
 */
export const getUserCollections = async (userId: number): Promise<Collection[]> => {
    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        // Cypher query to fetch the user's collections and their books
        const result = await session.run(
            `
            MATCH (u:User)
            WHERE id(u) = $userId
            MATCH (u)-[:HAS_COLLECTION]->(c:Collection)
            OPTIONAL MATCH (c)-[:CONTAINS_BOOK]->(b:Book)
            RETURN c, collect(b) AS books
            `,
            { userId }
        );

        // Process the results
        const collections: Collection[] = result.records.map(record => {
            const collectionNode = record.get("c");
            const booksNodes = record.get("books");

            return {
                ...collectionNode.properties, // Include collection properties
                books: booksNodes.map((book: any) => book.properties as Book), // Map books to their properties
            } as Collection;
        });

        return collections;
    } catch (error) {
        console.error("Error fetching collections from Neo4j:", error);
        throw new Error("Failed to fetch collections from the database.");
    } finally {
        // Always close the session and driver
        await session.close();
        await driver.close();
    }
};

export const getUserCollectionsByEmail = async (email: string) => {
    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (u:User {email: $email})
            MATCH (u)-[:BELONGS_TO]-(c:Collection)
            OPTIONAL MATCH (c)-[:CONTAINS_BOOK]->(b:Book)
            RETURN c, collect(b) AS books
            `,
            { email }
        );

        // Map the query results to collections with their books
        const collections = result.records.map(record => {
            const collectionNode = record.get('c');
            const books = record.get('books');

            return {
                ...collectionNode.properties,
                books: books.map((book: any) => book.properties),
            };
        });

        return collections;
    } catch (error) {
        console.error("Error fetching collections from Neo4j:", error);
        throw new Error("Failed to fetch collections from the database.");
    } finally {
        await session.close();
        await driver.close();
    }
};