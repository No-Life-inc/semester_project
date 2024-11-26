import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import Book from "../../types/book";  // Assuming 'Book' is a proper type for your books

/**
 * Fetches books from the Neo4j database with pagination.
 *
 * @param {number} page - The page number for pagination (defaults to 1).
 * @param {number} limit - The number of books to fetch per page (defaults to 50).
 *
 * @returns {Promise<Book[]>} - A promise that resolves to an array of books.
 * @throws {Error} - Throws an error if there is an issue fetching the books.
 *
 * @example
 * const books = await getBooks(1, 50);
 * // Fetches the first 50 books from the database.
 */
export const getBooks = async (page: number = 1, limit: number = 50): Promise<Book[]> => {
    // Ensure 'page' and 'limit' are valid integers
    const pageNumber = Math.max(1, parseInt(page.toString(), 10));
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit.toString(), 10))); // Limit to a maximum of 100 books per page

    if (pageNumber < 1) {
        throw new Error("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if (limitNumber < 1 || limitNumber > 100) {
        throw new Error("Invalid limit. Limit must be a number between 1 and 100.");
    }

    // Connect to Neo4j
    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        // Query Neo4j with pagination using SKIP and LIMIT
        const result = await session.run(
            'MATCH (b:Book) RETURN b SKIP 50 LIMIT 50',
            {
                skip: 50,
                limit: 50
            }
        );

        // Map the query results to your 'Book' type
        const books = result.records.map(record => {
            const bookNode = record.get('b');
            return bookNode.properties as Book;
        });

        return books;
    } catch (error) {
        console.error("Error fetching books from Neo4j:", error);
        throw new Error("Failed to fetch books from the database.");
    } finally {
        // Always close the session and driver to prevent connection leaks
        await session.close();
        await driver.close();
    }
};
