import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import Book from "../../models/neo4j/book";

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
export const getBooks = async (
  page: number = 1,
  limit: number = 50
): Promise<Book[]> => {
  // Ensure 'page' and 'limit' are valid integers
  const pageNumber = Math.max(1, parseInt(page.toString(), 10));
  const limitNumber = Math.max(
    1,
    Math.min(100, parseInt(limit.toString(), 10))
  ); // Limit to a maximum of 100 books per page

  if (pageNumber < 1) {
    throw new Error(
      "Invalid page number. Page must be a number greater than or equal to 1."
    );
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
      "MATCH (b:Book) RETURN b SKIP 50 LIMIT 50",
      {
        skip: 1,
        limit: 50,
      }
    );

    // Map the query results to your 'Book' type
    const books = result.records.map((record) => {
      const bookNode = record.get("b");
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

/**
 * Fetches a book by its ID from the Neo4j database.
 *
 * @param {number} isbn - The ID of the book to fetch.
 * @returns {Promise<BookAPIData | null>} - A promise that resolves to the book or null if not found.
 * @throws {Error} - Throws an error if there is an issue fetching the book.
 *
 * @example
 * const book = await getBookById('123');
 */
export const getBookByISBN = async (isbn: string): Promise<Book> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    // Query Neo4j to fetch the book by ID
    const result = await session.run("MATCH (b:Book {isbn: $isbn}) RETURN b", {
      isbn,
    });

    if (result.records.length === 0) {
      return null;
    }

    // Map the query result to your 'Book' type
    const bookNode = result.records[0].get("b");
    const book = bookNode.properties as Book;

    return book;
  } catch (error) {
    console.error("Error fetching book from Neo4j:", error);
    throw new Error("Failed to fetch book from the database.");
  } finally {
    // Always close the session to prevent connection leaks
    await session.close();
    await driver.close();
  }
};

//get books by title
export const getBooksByTitle = async (title: string) => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    console.log("Running query for title:", title); // Log the title being queried

    const result = await session.run(
      `MATCH (b:Book) 
           WHERE toLower(b.title) CONTAINS toLower($title) 
           RETURN b`,
      { title }
    );

    console.log("Query result:", result.records); // Log the raw query result

    const books = result.records.map((record) => {
      const bookNode = record.get("b");
      return bookNode.properties; // Extract properties of the Book node
    });

    console.log("Mapped books:", books); // Log the mapped results

    return books;
  } catch (error) {
    console.error("Error querying Neo4j:", error); // Log query errors
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
};
