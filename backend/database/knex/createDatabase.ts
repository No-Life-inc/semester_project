import knex from "knex";
import { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: Knex.Config = {
  client: "mssql",
  connection: {
    server: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
};

async function setupDatabase(): Promise<void> {
  const initialDb = knex(config);
  const databaseName = "bookCollection";

  // Log konfigurationsdetaljer for at se, hvad der bliver brugt
  console.log("Connecting to MSSQL with the following configuration:", config);

  try {
    // Brug queryBuilder i stedet for raw
    const result = await initialDb
      .select("name")
      .from("sys.databases")
      .where("name", databaseName);

    if (result.length === 0) {
      await initialDb.raw(`CREATE DATABASE ${databaseName}`);
      console.log(`Database ${databaseName} created!`);
    } else {
      console.log(`Database ${databaseName} already exists.`);
    }
  } catch (err) {
    console.error("Error checking or creating database:", err);
    throw err;
  } finally {
    await initialDb.destroy();
  }
}

export default setupDatabase;
