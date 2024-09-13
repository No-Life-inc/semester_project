import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/SqlConfig.js';
import './models/Associations.js';
import User from './models/User.js';
import Book from './models/Book.js';
import Author from './models/Author.js';
import BookCollection from './models/BookCollection.js';
import Publisher from './models/Publisher.js';
import BookHasBookCollection from "./models/BookHasBookCollection.js";
import booksHasAuthors from "./models/BooksHasAuthors.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log('Connection to MSSQL has been established successfully.');
        return sequelize.sync({ force: false }); // force: false for ikke at slette data
    })
    .then(() => {
        console.log('Database synchronized with associations');
    })
    .catch(err => {
        console.error('Unable to connect or synchronize the database:', err);
    });

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
