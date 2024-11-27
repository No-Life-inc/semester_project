import connectToNeo4j from "../../../dbconnections/Neo4jConnection";

async function dropSpecificIndexes(session, indexNames) {
    try {
      const result = await session.run(`SHOW INDEXES`);
      const indexes = result.records;
  
      for (const index of indexes) {
        const name = index.get("name");
        if (indexNames.includes(name)) {
          console.log(`Dropping index: ${name}`);
          await session.run(`DROP INDEX ${name}`);
        }
      }
    } catch (error) {
      console.error("Error dropping specific indexes:", error);
    }
  }

export async function seedIndexes() {
  const driver = await connectToNeo4j();
  const session = driver.session();

  const indexNames = [
    "user_guid_index",
    "book_guid_index",
    "tag_guid_index",
    "collection_guid_index",
    "subject_guid_index",
  ];

  try {
    // Drop all existing indexes
    await dropSpecificIndexes(session, indexNames);

    // Create new indexes
    await session.run(
      `CREATE INDEX user_guid_index IF NOT EXISTS FOR (u:User) ON (u.guid);`
    );
    await session.run(
      `CREATE INDEX book_guid_index IF NOT EXISTS FOR (b:Book) ON (b.guid);`
    );
    await session.run(
      `CREATE INDEX tag_guid_index IF NOT EXISTS FOR (t:Tag) ON (t.guid);`
    );
    await session.run(
        `CREATE INDEX collection_guid_index IF NOT EXISTS FOR (c:Collection) ON (c.guid);`
      );
    await session.run(
    `CREATE INDEX subject_guid_index IF NOT EXISTS FOR (s:Subject) ON (s.guid);`
    );

    console.log("Indexes created successfully.");
  } catch (error) {
    console.error("Error creating indexes:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

export default seedIndexes;
