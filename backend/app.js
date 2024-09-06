import express from 'express';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 5000;

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});