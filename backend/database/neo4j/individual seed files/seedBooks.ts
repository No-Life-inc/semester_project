import { Driver, session, Session } from "neo4j-driver";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import connectToNeo4j from "../../../dbconnections/Neo4jConnection";
import { v4 as uuidv4 } from "uuid";

// Load environment variables from the .env file
dotenv.config();

// Path to the JSON file
const jsonFilePath = path.join("../", "dump", "books.json");

// Read and parse the JSON file
const booksData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

export async function seedBooks(): Promise<void> {
  // Neo4j connection details
  const driver = await connectToNeo4j();

  const session: Session = driver.session();

  try {
    // Clear existing data (delete all nodes and relationships)
    await session.run(`MATCH (n) DETACH DELETE n`);

    for (const book of booksData.books) {
      // Create or match the publisher
      let publisherNode = null;
      if (book.publisher) {
        const publisherResult = await session.run(
          `
          MERGE (p:Publisher {name: $name})
          ON CREATE SET p.guid = $guid
          RETURN p
          `,
          { name: book.publisher, guid: uuidv4() }
        );
        publisherNode = publisherResult.records[0]?.get("p");
      }

      // Create the book node
      const bookResult = await session.run(
        `
          CREATE (b:Book {
            guid: $guid,
            title: $title,
            image: $image,
            titleLong: $titleLong,
            publicationDate: $publicationDate,
            isbn13: $isbn13,
            binding: $binding,
            isbn: $isbn,
            isbn10: $isbn10,
            language: $language,
            pages: $pages,
            synopsis: $synopsis,
            msrp: $msrp,
            edition: $edition,
            dimensions: $dimensions
          })
          RETURN b
        `,
        {
          guid: uuidv4(),
          title: book.title,
          image: book.image || null,
          titleLong: book.title_long || null,
          publicationDate: book.date_published || null,
          isbn13: book.isbn13 || null,
          binding: book.binding || null,
          isbn: book.isbn || null,
          isbn10: book.isbn10 || null,
          language: book.language || null,
          pages: book.pages || null,
          synopsis: book.synopsis || null,
          msrp: book.msrp || null,
          edition: book.edition ? parseInt(book.edition, 10) : null,
          dimensions: book.dimensions || null,
        }
      );
      const bookNode = bookResult.records[0]?.get("b");

      // Link the book to the publisher
      if (publisherNode) {
        await session.run(
          `
            MATCH (b:Book {title: $title}), (p:Publisher {name: $name})
            CREATE (b)-[:PUBLISHED_BY]->(p)
          `,
          { title: book.title, name: book.publisher }
        );
      }

      // Create authors and link them to the book
      for (const authorName of book.authors) {
        await session.run(
          `
          MERGE (a:Author {name: $name})
          ON CREATE SET a.guid = $guid
          WITH a
          MATCH (b:Book {title: $bookTitle})
          CREATE (a)-[:AUTHORED]->(b)
          `,
          { name: authorName, bookTitle: book.title, guid: uuidv4() }
        );
      }

      // Create subjects and link them to the book
      if (Array.isArray(book.subjects)) {
        for (const subjectName of book.subjects) {
          await session.run(
            `
              MERGE (s:Subject {name: $name})
              ON CREATE SET s.guid = $guid
              WITH s
              MATCH (b:Book {title: $bookTitle})
              CREATE (b)-[:HAS_SUBJECT]->(s)
            `,
            { name: subjectName, bookTitle: book.title, guid: uuidv4() }
          );
        }
      }
    }
  } catch (error) {
    console.error("Error seeding Neo4j:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

export default seedBooks;
