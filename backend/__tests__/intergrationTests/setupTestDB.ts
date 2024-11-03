import Knex from "knex";
import knexConfig from "../../knexfile";
import { Model } from "objection";
import dotenv from "dotenv";

dotenv.config();

// Initialize Knex with initial configuration
const initialDb = Knex({
    client: "mssql",
    connection: {
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
    },
  });

  
  // Function to create the database if it doesn't exist
  const createDatabaseIfNotExists = async () => {
    const databaseName = process.env.TEST_SQL_NAME;
    console.log("Connecting to MSSQL with the following configuration:", initialDb.client.config.connection);
    
    try {
        const result = await initialDb
        .select("SCHEMA_NAME")
        .from("information_schema.schemata")
        .where("SCHEMA_NAME", databaseName);
        
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
};

// Initialize Knex
const knex = Knex(knexConfig.test);

// Database name
const databaseName = process.env.TEST_SQL_NAME;

export const setupTestDB = async () => {
  // Create the database if it doesn't exist
  // await createDatabaseIfNotExists();

  // Run migrations
  await knex.migrate.latest();

  // Seed the database
  await knex.seed.run();
};

export const teardownTestDB = async () => {
    await knex("user_book_tags").del();
    await knex("user_books").del();
    await knex("collection_books").del();
    await knex("user_collections").del();
    await knex("collections").del();
    await knex("users").del();
    await knex("book_subjects").del();
    await knex("book_authors").del();
    await knex("subjects").del();
    await knex("authors").del();
    await knex("books").del();
  
    // Rollback migrations  
  await knex.migrate.rollback({}, true);

  // Destroy the Knex instance
  await knex.destroy();
};