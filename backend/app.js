import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/SqlConfig.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


//Setup sequelize
sequelize.authenticate()
    .then(() => {
        console.log('Connection to MSSQL has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});