import knex from "knex";
import knexConfig from "../../knexfile";
import dotenv from "dotenv";
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

        console.log("Database is ready.");
    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exit(1);
    }
}