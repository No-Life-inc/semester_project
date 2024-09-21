import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "express-openid-connect";
import "./models/Associations";
import V1Routes from "./routes/V1Routes";
import { Auth0Config } from "./config/Auth0Config";
import connectToDatabase from "./dbconnections/SequelizeConnection";
import sequelize from "./config/SqlConfig";
import { initializeDatabase } from "./database/knex/setupDatabase";
import setupDatabase from './database/knex/setupDatabase';  // Importér setupDatabase

const { auth } = pkg;
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const config = Auth0Config(process.env);

app.use(cors());
app.use(express.json());
app.use(auth(config));

// Midlertidig debug log
console.log('APPTS: SQL_HOST:', process.env.SQL_HOST);
console.log('SQL_USER:', process.env.SQL_USER);
console.log('SQL_PASSWORD:', process.env.SQL_PASSWORD);

async function startServer() {
  try {
    // Først sørger vi for, at databasen bliver oprettet, hvis den ikke allerede eksisterer
    console.log("Setting up the database...");
    await setupDatabase();  // Kør database setup her

    // Når databasen er oprettet, initialiser den med migrationer og seeding
    console.log("Initializing database...");
    await initializeDatabase();

    // Use the v1 routes with the /v1 prefix
    app.use("/v1", V1Routes);

    // Start serveren efter at databasen er klar
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);  // Stop hvis der er en kritisk fejl
  }
}

startServer();  // Kør serveropstart asynkront
