import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/SqlConfig.js";
import pkg from "express-openid-connect";
import userRoutes from "./routes/userRoutes.js";

const { auth, requiresAuth } = pkg;
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL || "http://localhost:5000",
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.AUTH0_SECRET,
};
app.use(cors());
app.use(express.json());
app.use(auth(config));

//Setup sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to MSSQL has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.use("/api", userRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
