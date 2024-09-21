import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "express-openid-connect";
import "./models/Associations";
import V1Routes from "./routes/V1Routes";
import { Auth0Config } from "./config/Auth0Config";
import setupDatabase from "./database/knex/createDatabase";
import { initializeDatabase } from "./database/knex/setupDatabase";

dotenv.config();
const { auth } = pkg;
const app = express();
const port = process.env.PORT || 5000;
const config = Auth0Config(process.env);

app.use(cors());
app.use(express.json());
app.use(auth(config));

async function startServer() {
  try {
    // Først opretter vi databasen, hvis den ikke eksisterer
    console.log("Setting up the database...");
    await setupDatabase(); // Kør database setup

    // Når databasen er oprettet, initialiser med migrationer og seeding
    console.log("Initializing database...");
    await initializeDatabase(); // Kør migrationer og seeds

    // Use the v1 routes with the /v1 prefix
    app.use("/v1", V1Routes);

    // Start serveren efter at databasen er klar
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Stop hvis der er en kritisk fejl
  }
}

startServer(); // Kør serveropstart asynkront
