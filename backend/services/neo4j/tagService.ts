import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import Tag from "../../models/neo4j/Tag";
import neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

//getTags function
export const getTags = async (
  skip: number = 0,
  limit: number = 10
): Promise<Tag[]> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    const result = await session.run(
      `
            MATCH (t:Tag)
            RETURN t
            SKIP $skip
            LIMIT $limit
            `,
      { skip: neo4j.int(skip), limit: neo4j.int(limit) }
    );

    const tags: Tag[] = result.records.map((record) => {
      const tagNode = record.get("t");
      return tagNode.properties as Tag;
    });

    return tags;
  } catch (error) {
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
};

//getTagById function
export const getTagByGuid = async (guid: string): Promise<Tag> => {
    const driver = await connectToNeo4j();
    const session = driver.session();
    
    guid = guid.trim();
    
    try {
        const result = await session.run(
        `
                MATCH (t:Tag {guid: $guid})
                RETURN t
                `,
        { guid }
        );
    
        if (result.records.length === 0) {
        throw new Error("Tag not found");
        }
    
        const tagNode = result.records[0].get("t");
        const tag = tagNode.properties as Tag;
    
        return tag;
    } catch (error) {
        throw error;
    } finally {
        await session.close();
        await driver.close();
    }
    }

//createTag function
export const createTag = async (name: string): Promise<any> => {
    if (!name || typeof name !== "string") {
        throw new Error("Invalid tag name. Name must be a non-empty string.");
    }

    const driver = await connectToNeo4j();
    const session = driver.session();

    const guid = uuidv4(); // Generate GUID

    try {
        const query = `
            CREATE (t:Tag {name: $name, guid: $guid})
            RETURN t
        `;

        // Ensure correct parameter structure
        const params = { name, guid };

        const result = await session.run(query, params);

        const createdTag = result.records[0].get("t");

        return createdTag.properties;
    } catch (error) {
        console.error("Error creating tag:", error);
        throw error;
    } finally {
        await session.close();
        await driver.close();
    }
};

//deleteTag function
export const deleteTag = async (guid: string): Promise<void> => {
    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (t:Tag {guid: $guid})
            DETACH DELETE t
            `,
            { guid }
        );

        if (result.summary.counters.updates().nodesDeleted === 0) {
            throw new Error("Tag not found");
        }
    } catch (error) {
        throw error;
    } finally {
        await session.close();
        await driver.close();
    }
};

//addTagToBook function
export const addTagToBook = async (
    email: string,
    isbn: string,
    guid: string
): Promise<void> => {
    if (!email || typeof email !== "string") {
        throw new Error("Invalid user email. Email must be a non-empty string.");
    }

    if (!isbn || typeof isbn !== "string") {
        throw new Error("Invalid book ISBN. ISBN must be a non-empty string.");
    }

    if (!guid || typeof guid !== "string") {
        throw new Error("Invalid tag GUID. GUID must be a non-empty string.");
    }

    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        const query = `
            MATCH (u:User {email: $email})-[:HAS_BOOK]->(b:Book {isbn: $isbn})
            MATCH (t:Tag {guid: $guid})
            MERGE (b)-[:TAGGED_WITH]->(t)
        `;

        const params = { email, isbn, guid };

        await session.run(query, params);
    } catch (error) {
        console.error("Error adding tag to book:", error);
        throw error;
    } finally {
        await session.close();
        await driver.close();
    }
};

//deleteTagFromBook function
export const deleteTagFromBook = async (
    email: string,
    isbn: string,
    guid: string
): Promise<void> => {
    if (!email || typeof email !== "string") {
        throw new Error("Invalid user email. Email must be a non-empty string.");
    }

    if (!isbn || typeof isbn !== "string") {
        throw new Error("Invalid book ISBN. ISBN must be a non-empty string.");
    }

    if (!guid || typeof guid !== "string") {
        throw new Error("Invalid tag GUID. GUID must be a non-empty string.");
    }

    const driver = await connectToNeo4j();
    const session = driver.session();

    try {
        const query = `
            MATCH (u:User {email: $email})-[:HAS_BOOK]->(b:Book {isbn: $isbn})-[r:TAGGED_WITH]->(t:Tag {guid: $guid})
            DELETE r
        `;

        const params = { email, isbn, guid };

        await session.run(query, params);
    } catch (error) {
        console.error("Error deleting tag from book:", error);
        throw error;
    } finally {
        await session.close();
        await driver.close();
    }
};