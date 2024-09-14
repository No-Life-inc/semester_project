import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/SqlConfig.js';
import './models/Associations.js';
import V1Routes from './routes/v1Routes.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

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
