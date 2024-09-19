import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/SqlConfig.js";
import pkg from "express-openid-connect";
import './models/Associations.js';
import V1Routes from './routes/v1Routes.js';


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

sequelize.authenticate()
    .then(() => {
        console.log('Connection to MSSQL has been established successfully.');
        sequelize.sync({ force: false });
        return // force: false for ikke at slette data
    })
    .then(() => {
        console.log('Database synchronized with associations');
    })
    .catch(err => {
        console.error('Unable to connect or synchronize the database:', err);
    });

// Use the v1 routes with the /v1 prefix
app.use('/v1', V1Routes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
