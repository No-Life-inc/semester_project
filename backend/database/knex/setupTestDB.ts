import "../../models/sequelize/Associations";
import Knex from "knex";
import knexConfig from "../../knexfile";
import { Model } from "objection";
import dotenv from "dotenv";
import sequelize from "../../config/SqlConfig";

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

  try {
    const result = await initialDb
      .select("name")
      .from("sys.databases")
      .where("name", databaseName);

    if (result.length === 0) {
      await initialDb.raw(`CREATE DATABASE ${databaseName}`);
    } else {
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

Model.knex(knex);

export const setupTestDB = async () => {
  // Create the database if it doesn't exist
  await createDatabaseIfNotExists();

  // Run migrations
  await knex.migrate.latest();

  // Seed the database
  await knex.seed.run();
};

export const teardownTestDB = async () => {
  await knex("user_book_tags").del();
  await knex("user_books").del();
  await knex("collection_books").del();
  await knex("collections").del();
  await knex("users").del();
  await knex("book_subjects").del();
  await knex("book_authors").del();
  await knex("subjects").del();
  await knex("authors").del();
  await knex("books").del();

  // Rollback migrations
  await knex.migrate.rollback({}, true);

  Model.knex(undefined);

  await knex.destroy();
};
