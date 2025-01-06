import connectToNeo4j from "../../../dbconnections/Neo4jConnection";

async function dropAllConstraints(session) {
  try {
    const result = await session.run(`SHOW CONSTRAINTS`);
    const constraints = result.records;

    for (const constraint of constraints) {
      const name = constraint.get("name");
      console.log(`Dropping constraint: ${name}`);
      await session.run(`DROP CONSTRAINT ${name}`);
    }
  } catch (error) {
    console.error("Error dropping constraints:", error);
  }
}

export async function seedConstraints() {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {

    await dropAllConstraints(session);

    await session.run(
      `CREATE CONSTRAINT FOR (u:User) REQUIRE u.email IS UNIQUE;`
    );
    await session.run(
      `CREATE CONSTRAINT FOR (b:Book) REQUIRE b.isbn IS UNIQUE;`
    );
    await session.run(
      `CREATE CONSTRAINT FOR (t:Tag) REQUIRE t.name IS UNIQUE;`
    );
    await session.run(
      `CREATE CONSTRAINT FOR (a:Author) REQUIRE a.name IS UNIQUE;`
    );
    await session.run(
      `CREATE CONSTRAINT FOR (p:Publisher) REQUIRE p.name IS UNIQUE;`
    );
    await session.run(
      `CREATE CONSTRAINT FOR (s:Subject) REQUIRE s.name IS UNIQUE;`
    );
    console.log("Constraints created successfully.");
  } catch (error) {
    console.error("Error creating constraints:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

export default seedConstraints;
