import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "express-openid-connect";
import "./models/sequilize/Associations";
import V1Routes from "./routes/V1Routes";
import { Auth0Config } from "./config/Auth0Config";
import setupDatabase from "./database/knex/createDatabase";
import { initializeDatabase } from "./database/knex/setupDatabase";
import connectDB from "./dbconnections/MongoConnection"

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
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Setting up the database...");
    await setupDatabase();

    console.log("Initializing database...");
    await initializeDatabase();

    app.use("/v1", V1Routes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
