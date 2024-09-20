import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "express-openid-connect";
import "./models/Associations";
import V1Routes from "./routes/V1Routes";
import { Auth0Config } from "./config/Auth0Config";
import connectToDatabase from "./dbconnections/SequelizeConnection";
import sequelize from "./config/SqlConfig";

const { auth } = pkg;
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const config = Auth0Config(process.env);
const sequelizeSetup = sequelize;

app.use(cors());
app.use(express.json());
app.use(auth(config));

connectToDatabase(sequelizeSetup)

// Use the v1 routes with the /v1 prefix
app.use("/v1", V1Routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
