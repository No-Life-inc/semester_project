import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./models/sequelize/Associations";
import V1Routes from "./routes/V1";
import MongoRoutes from "./routes/V1/mongo";
import setupDatabase from "./database/knex/createDatabase";
import { initializeDatabase } from "./database/knex/setupDatabase";
import connectMongoDB from "./dbconnections/MongoConnection";
import { registerHooks } from "./config/hooks";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

async function startServer() {
  try {

    await connectMongoDB();

    await setupDatabase();

    await initializeDatabase();

    registerHooks();

    app.use("/v1", V1Routes);
    app.use("/v1/mongo", MongoRoutes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
