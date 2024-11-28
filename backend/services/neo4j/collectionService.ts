import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import Collection from "../../models/neo4j/collection";
import Book from "../../models/neo4j/book";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from "../../utility/errors";
import { v4 as uuidv4 } from "uuid";

/**
 * Fetches collections for a specific user from the Neo4j database.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Collection[]>} - A promise that resolves to an array of collections with their books.
 * @throws {Error} - Throws an error if the user is not found.
 */
export const getUserCollections = async (
  userId: number
): Promise<Collection[]> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    // Cypher query to fetch the user's collections and their books
    const result = await session.run(
      `
            MATCH (u:User)
            WHERE id(u) = $userId
            MATCH (u)-[:HAS_COLLECTION]-(c:Collection)
            OPTIONAL MATCH (c)-[:CONTAINS_BOOK]->(b:Book)
            RETURN c, collect(b) AS books
            `,
      { userId }
    );

    const collections: Collection[] = result.records.map((record) => {
      const collectionNode = record.get("c");
      const booksNodes = record.get("books");

      return {
        ...collectionNode.properties,
        books: booksNodes.map((book: any) => book.properties as Book),
      } as Collection;
    });

    return collections;
  } catch (error) {
    throw new NotFoundError("Collection not found");
  } finally {
    // Always close the session and driver
    await session.close();
    await driver.close();
  }
};

/**
 * Fetches collections for a specific user from the Neo4j database.
 * @param {string} email  - The email of the user.
 * @returns {Promise<Collection[]>} - A promise that resolves to an array of collections with their books.
 * @throws {Error} - Throws an error if the user is not found.
 */
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
    const collections = result.records.map((record) => {
      const collectionNode = record.get("c");
      const books = record.get("books");

      return {
        ...collectionNode.properties,
        books: books.map((book: any) => book.properties),
      };
    });

    return collections;
  } catch (error) {
    throw new NotFoundError("Collection not found");
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 *
 * @param {} name
 * @param email
 * @returns
 */
export const createCollection = async (
  name: string,
  email: string
): Promise<Collection> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  const guid = uuidv4();

  try {
    // Cypher query to create a new collection for the user
    const result = await session.run(
      `
            MATCH (u:User {email: $email})
            CREATE (c:Collection {name: $name, guid: $guid})-[:BELONGS_TO]->(u)
            RETURN c
            `,
      { name: name, guid, email }
    );

    const createdCollection = result.records[0].get("c");

    return createdCollection.properties as Collection;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw new ValidationError("Collection name is required");
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 * Updates the name of a collection.
 *
 * @param {string} email - The email of the user.
 * @param {string} guid - The guid of the collection.
 * @param {string} newName - The new name for the collection.
 * @returns {Promise<Collection>} - A promise that resolves to the updated collection.
 * @throws {NotFoundError} - Throws an error if the collection is not found.
 */
export const updateCollection = async (
  email: string,
  guid: string,
  newName: string
): Promise<Collection> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    // Cypher query to update the collection name
    const result = await session.run(
      `
            MATCH (u:User {email: $email})-[:BELONGS_TO]-(c:Collection {guid: $guid})
            SET c.name = $newName
            RETURN c
            `,
      { email, guid, newName }
    );

    const updatedCollection = result.records[0].get("c");

    return updatedCollection.properties as Collection;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw new NotFoundError("Collection not found");
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 * Deletes a collection.
 *
 * @param {string} email - The email of the user.
 * @param {string} guid - The guid of the collection.
 * @returns {Promise<void>} - A promise that resolves when the collection is deleted.
 * @throws {NotFoundError} - Throws an error if the collection is not found.
 */
export const deleteCollection = async (
  email: string,
  guid: string
): Promise<void> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    // Cypher query to delete the collection
    await session.run(
      `
            MATCH (u:User {email: $email})-[:BELONGS_TO]-(c:Collection {guid: $guid})
            DETACH DELETE c
            `,
      { email, guid }
    );
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw new NotFoundError("Collection not found");
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 *
 * This function adds a book to a collection.
 *
 * @param email - The email of the user.
 * @param guid  - The guid of the collection.
 * @param isbn  - The ISBN of the book to add to the collection.
 *
 * @returns {Promise<Collection>} - A promise that resolves to the updated collection.
 */
export const addBookToCollection = async (
  email: string,
  guid: string,
  isbn: string
): Promise<Collection> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    // Cypher query to add a book to a collection
    const result = await session.run(
      `
            MATCH (u:User {email: $email})-[:BELONGS_TO]-(c:Collection {guid: $guid})
            MATCH (b:Book {isbn: $isbn})
            MERGE (c)-[:CONTAINS_BOOK]->(b)
            RETURN c
            `,
      { email, guid, isbn }
    );

    const updatedCollection = result.records[0].get("c");

    return updatedCollection.properties as Collection;
  } catch (error) {
    console.error("Error adding book to collection:", error);
    throw new NotFoundError("Collection not found");
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 *
 * This function removes a book from a collection.
 *
 * @param email - The email of the user.
 * @param guid  - The guid of the collection.
 * @param isbn  - The ISBN of the book to remove from the collection.
 *
 * @returns {Promise<Collection>} - A promise that resolves to the updated collection.
 */
export const removeBookFromCollection = async (
  email: string,
  guid: string,
  isbn: string
): Promise<Collection> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    // Cypher query to remove a book from a collection
    const result = await session.run(
      `
            MATCH (u:User {email: $email})-[:BELONGS_TO]-(c:Collection {guid: $guid})
            MATCH (b:Book {isbn: $isbn})
            MATCH (c)-[r:CONTAINS_BOOK]->(b)
            DELETE r
            RETURN c
            `,
      { email, guid, isbn }
    );

    const updatedCollection = result.records[0].get("c");

    return updatedCollection.properties as Collection;
  } catch (error) {
    console.error("Error removing book from collection:", error);
    throw new NotFoundError("Collection not found");
  } finally {
    await session.close();
    await driver.close();
  }
};
