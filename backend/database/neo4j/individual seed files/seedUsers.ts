import bcrypt from "bcrypt";
import connectToNeo4j from "../../../dbconnections/Neo4jConnection";
import { v4 as uuidv4 } from "uuid";

async function seedUsers() {
  // Neo4j connection details
  const driver = await connectToNeo4j();

  const session = driver.session();

  try {
    // Clear existing data (optional for testing)
    console.log("Deleting relationships and nodes in order...");

    await session.run(`MATCH (:User)-[r:TAGGED_WITH]->(:Tag) DELETE r`);
    await session.run(
      `MATCH (:Collection)-[r:CONTAINS_BOOK]->(:Book) DELETE r`
    );
    await session.run(`MATCH (:User)-[r:HAS_BOOK]->(:Book) DELETE r`);
    await session.run(`MATCH (c:Collection) DETACH DELETE c`);
    await session.run(`MATCH (u:User) DETACH DELETE u`);

    console.log("Deleted all users, collections, and relationships.");

    const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD;
    // Seed users
    const users = [
      {
        name: "User 1",
        email: "test_email@example.com",
        password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      },
      {
        name: "User 2",
        email: "test_password@example.com",
        password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      },
      {
        name: "Test Testsen",
        email: "test@test.com",
        password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      },
    ];

    const userNodes = [];
    for (const user of users) {
      const result = await session.run(
        `CREATE (u:User {name: $name, email: $email, password: $password, guid: $guid}) RETURN u`,
        {
          name: user.name,
          email: user.email,
          password: user.password,
          guid: uuidv4(),
        }
      );
      userNodes.push({ email: user.email });
    }
    console.log("Users seeded.");

    // Seed collections
    const collections = [
      { name: "Collection 1", userEmail: users[0].email },
      { name: "Collection 2", userEmail: users[1].email },
      { name: "Collection 3", userEmail: users[2].email },
    ];

    const collectionNodes = [];
    for (const collection of collections) {
      const result = await session.run(
        `MATCH (u:User {email: $userEmail}) CREATE (c:Collection {name: $name, guid: $guid})-[:BELONGS_TO]->(u) RETURN c`,
        {
          name: collection.name,
          userEmail: collection.userEmail,
          guid: uuidv4(),
        }
      );
      collectionNodes.push({ name: collection.name });
    }
    console.log("Collections seeded.");

    // Query for 10 existing books
    const bookResult = await session.run(`
      MATCH (b:Book)
        RETURN b.isbn as isbn, b.title as title
        Limit 30
    `);

    const books = bookResult.records.map((record) => ({
      isbn: record.get("isbn"),
      title: record.get("title"),
    }));

    if (books.length === 0) {
      console.log(
        "No books found in the database. Cannot proceed with associations."
      );
      return;
    }

    console.log(`Found ${books.length} books.`);

    // Create deterministic overlaps for users and books
    const sharedBooksCount = Math.min(3, books.length); // Number of books shared by all users
    const perUserBooks = Math.floor(
      (books.length - sharedBooksCount) / users.length
    );

    // Shared books owned by all users
    const sharedBooks = books.slice(0, sharedBooksCount);
    for (const user of userNodes) {
      for (const book of sharedBooks) {
        await session.run(
          `MATCH (u:User {email: $userEmail}), (b:Book {isbn: $isbn}) CREATE (u)-[:HAS_BOOK]->(b)`,
          { userEmail: user.email, isbn: book.isbn }
        );
      }
    }

    // Assign remaining books evenly to users
    for (let i = sharedBooksCount; i < books.length; i++) {
      const userIndex = Math.floor((i - sharedBooksCount) / perUserBooks);
      const user = userNodes[userIndex % userNodes.length];
      await session.run(
        `MATCH (u:User {email: $userEmail}), (b:Book {isbn: $isbn}) CREATE (u)-[:HAS_BOOK]->(b)`,
        { userEmail: user.email, isbn: books[i].isbn }
      );
    }
    console.log("User-book associations created deterministically.");

    // Create deterministic overlaps for collections and books
    const sharedCollectionsBooksCount = Math.min(2, books.length); // Number of books shared by all collections
    const perCollectionBooks = Math.floor(
      (books.length - sharedCollectionsBooksCount) / collections.length
    );

    // Shared books in all collections
    const sharedCollectionsBooks = books.slice(0, sharedCollectionsBooksCount);
    for (const collection of collectionNodes) {
      for (const book of sharedCollectionsBooks) {
        await session.run(
          `MATCH (c:Collection {name: $collectionName}), (b:Book {isbn: $isbn}) CREATE (c)-[:CONTAINS_BOOK]->(b)`,
          { collectionName: collection.name, isbn: book.isbn }
        );
      }
    }

    // Assign remaining books evenly to collections
    for (let i = sharedCollectionsBooksCount; i < books.length; i++) {
      const collectionIndex = Math.floor(
        (i - sharedCollectionsBooksCount) / perCollectionBooks
      );
      const collection =
        collectionNodes[collectionIndex % collectionNodes.length];
      await session.run(
        `MATCH (c:Collection {name: $collectionName}), (b:Book {isbn: $isbn}) CREATE (c)-[:CONTAINS_BOOK]->(b)`,
        { collectionName: collection.name, isbn: books[i].isbn }
      );
    }
    console.log("Collection-book associations created deterministically.");

    const tagResult = await session.run(`MATCH (t:Tag) RETURN t.name AS name`);

    const tags = tagResult.records.map((record) => record.get("name"));

    if (tags.length === 0) {
      console.log(
        "No tags found in the database. Cannot proceed with tagging."
      );
      return;
    }

    console.log(`Found ${tags.length} tags.`);

    for (const [index, book] of books.entries()) {
      const tagName = tags[index % tags.length]; // Round-robin assignment
      await session.run(
        `MATCH (b:Book {isbn: $isbn}), (t:Tag {name: $tagName}) CREATE (b)-[:TAGGED_WITH]->(t)`,
        { isbn: book.isbn, tagName }
      );
    }
    console.log("Book-tag associations created.");
  } catch (error) {
    console.error("Error seeding Neo4j:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

export default seedUsers;
