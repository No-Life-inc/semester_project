import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./models/sequelize/Associations";
import V1Routes from "./routes/V1";
import setupDatabase from "./database/knex/createDatabase";
import { initializeDatabase } from "./database/knex/setupDatabase";
import connectDB from "./dbconnections/MongoConnection";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

async function startServer() {
  try {

    // await connectDB();

    await setupDatabase();


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
