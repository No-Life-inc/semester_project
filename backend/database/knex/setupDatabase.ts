import knex from "knex";
import knexConfig from "../../knexfile";
import dotenv from "dotenv";
import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import seedNeo4j from "../neo4j/seedNeo4j";
import seedDatabaseUser from "../mongoose/seed_dbUser";
import seedBooks from "../mongoose/seed_books";
import seedUsers from "../mongoose/seed_users";
import { Book, createBookModel }  from "../../models/mongoose/BookModel";
import {connectMongoDB, connectMongoDBWithGranularUser} from "../../dbconnections/MongoConnection";
import mongoose from "mongoose";


dotenv.config();

const db = knex(knexConfig.development);

export async function initializeDatabase(): Promise<void> {
    try {
        console.log("Running migrations...");
        const [batchNo, log] = await db.migrate.latest();
        console.log("Migrations completed:", log);
 
        // Check if the latest migration has been applied
        const [completedMigrations, pendingMigrations] = await db.migrate.list();
        if (pendingMigrations.length === 0) {
            console.log("All migrations are up to date.");
        } else {
            console.log("Pending migrations:", pendingMigrations);
        }

        // Check for existing data in the 'books' table
        const existingData = await db("books").select("id").first();
        if (existingData) {
            console.log("Data already exists in the 'books' table. Skipping seeding.");
        } else {
            console.log("Running seeds...");
            const seedResults = await db.seed.run();
            console.log("Seeding completed:", seedResults);
        }

        console.log("SQL Database is ready.");

        // Seed the Neo4j database if needed
        // query the database to check if the data exists

        const driver = await connectToNeo4j();
        const session = driver.session();

        const result = await session.run(`MATCH (b:Book) RETURN count(b) as book LIMIT 1`);

        if (result.records[0].get("book").low > 0) {
            console.log("Data already exists in the Neo4j database. Skipping seeding.");
        } else {
            console.log("Seeding Neo4j database...");
            await seedNeo4j();
            console.log("Neo4j database seeded successfully.");
        }
        
        const seedConnection = await connectMongoDBWithGranularUser() as unknown as mongoose.Connection;
        const Book = createBookModel(seedConnection);

        console.log("Checking MongoDB user and seeding if necessary...");
        await seedDatabaseUser();

        // Check if a user exists
        const userExists = await Book.exists({});
        if (userExists) {
            console.log("Users already exist in MongoDB. Skipping seeding users and books.");
        } else {
            console.log("Seeding books...");
            await seedBooks();
            const books = await Book.find();
            console.log("Seeding users...");
            await seedUsers(books);
            console.log("Books and users seeded successfully.");
        }
    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exit(1);
    }
}